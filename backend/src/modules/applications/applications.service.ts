import { Types, type FilterQuery } from "mongoose";

import { jobsModel } from "../jobs/jobs.model";
import { usersModel } from "../users/users.model";
import { AppError } from "../../utils/app-error";
import { applicationsModel } from "./applications.model";
import type {
  ApplicationsQuery,
  CreateApplicationPayload,
  IApplication,
  UpdateApplicationPayload,
} from "./applications.interface";

function buildApplicationsFilter(query: ApplicationsQuery): FilterQuery<IApplication> {
  const filter: FilterQuery<IApplication> = {};

  if (query.status) {
    filter.applicationStatus = query.status;
  }

  return filter;
}

async function getUserApplications(userId: string) {
  return applicationsModel
    .find({ userId })
    .populate("jobId", "title slug company location workplaceType employmentType status")
    .sort({ updatedAt: -1 });
}

async function createApplication(userId: string, payload: CreateApplicationPayload) {
  const job = await jobsModel.findById(payload.jobId);

  if (!job || job.status !== "published") {
    throw new AppError("This job is no longer available for applications.", 404);
  }

  if (new Date(job.applicationDeadline).getTime() < Date.now()) {
    throw new AppError("The application deadline for this job has already passed.", 400);
  }

  const existingApplication = await applicationsModel.findOne({
    userId,
    jobId: job._id,
  });

  if (existingApplication) {
    throw new AppError("You have already applied to this job.", 409);
  }

  const application = await applicationsModel.create({
    userId,
    jobId: job._id,
    resumeUrl: payload.resumeUrl?.trim() ?? "",
    coverLetter: payload.coverLetter?.trim() ?? "",
  });

  await Promise.all([
    usersModel.findByIdAndUpdate(userId, {
      $addToSet: {
        appliedJobs: job._id,
      },
    }),
    jobsModel.findByIdAndUpdate(job._id, {
      $inc: {
        applicantsCount: 1,
      },
    }),
  ]);

  return applicationsModel
    .findById(application._id)
    .populate("jobId", "title slug company location workplaceType employmentType status");
}

async function getAdminApplications(query: ApplicationsQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const filter = buildApplicationsFilter(query);
  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    const [matchingUsers, matchingJobs] = await Promise.all([
      usersModel.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).select("_id"),
      jobsModel.find({ $or: [{ title: searchRegex }, { company: searchRegex }] }).select("_id"),
    ]);

    const userIds = matchingUsers.map((user) => new Types.ObjectId(user._id));
    const jobIds = matchingJobs.map((job) => new Types.ObjectId(job._id));

    if (userIds.length === 0 && jobIds.length === 0) {
      return {
        applications: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 1,
        },
      };
    }

    filter.$or = [
      { userId: { $in: userIds } },
      { jobId: { $in: jobIds } },
    ];
  }

  const [applications, total] = await Promise.all([
    applicationsModel
      .find(filter)
      .populate("userId", "name email profession role")
      .populate("jobId", "title slug company location workplaceType employmentType status")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    applicationsModel.countDocuments(filter),
  ]);

  return {
    applications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function updateApplicationByAdmin(id: string, payload: UpdateApplicationPayload) {
  const updatedApplication = await applicationsModel
    .findByIdAndUpdate(
      id,
      {
        applicationStatus: payload.applicationStatus,
        interviewDate: payload.interviewDate ? new Date(payload.interviewDate) : null,
        feedback: payload.feedback?.trim() ?? "",
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .populate("userId", "name email profession role")
    .populate("jobId", "title slug company location workplaceType employmentType status");

  if (!updatedApplication) {
    throw new AppError("Application not found.", 404);
  }

  return {
    ...updatedApplication.toObject(),
  };
}

export const applicationService = {
  async getStatus() {
    return {
      module: "applications",
      ready: true,
      totalApplications: await applicationsModel.countDocuments(),
      statuses: ["pending", "reviewed", "interview", "accepted", "rejected"],
    };
  },
  createApplication,
  getUserApplications,
  getAdminApplications,
  updateApplicationByAdmin,
};
