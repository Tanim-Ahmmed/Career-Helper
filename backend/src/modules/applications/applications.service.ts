import mongoose, { Types, type FilterQuery } from "mongoose";

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

async function getApplications(userId: string) {
  return applicationsModel.aggregate([
    // ১. প্রথমে Jobs কালেকশনের সাথে জয়েন (Lookup) করা
    {
      $lookup: {
        from: "jobs", // আপনার ডাটাবেজে jobs কালেকশনের আসল নাম (সাধারণত plural হয়)
        localField: "jobId",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    // ২. জবের ডেটা অ্যারে থেকে অবজেক্টে রূপান্তর করা
    { $unwind: "$jobDetails" },
    // ৩. ফিল্টার করা: শুধুমাত্র এই ইউজারের তৈরি করা জবের অ্যাপ্লিকেশনগুলো নেওয়া
    {
      $match: {
        "jobDetails.createdBy": new mongoose.Types.ObjectId(userId),
      },
    },
    // ৪. ইউজারের প্রোফাইল জয়েন করা (আবেদনকারীর নাম/ইমেইল দেখার জন্য)
    {
      $lookup: {
        from: "users", // ইউজার কালেকশনের নাম
        localField: "userId",
        foreignField: "_id",
        as: "applicantDetails",
      },
    },
    { $unwind: { path: "$applicantDetails", preserveNullAndEmptyArrays: true } },
    // ৫. প্রজেকশন: ফ্রন্টএন্ডে যে যে ফিল্ড দেখাতে চান তা সাজানো
    {
      $project: {
        _id: 1,
        resumeUrl:1,
        coverLetter: 1,
        createdAt: 1,
        updatedAt: 1,
        applicationStatus: 1,
        interviewDate:1,
        job: {
          _id: "$jobDetails._id",
          title: "$jobDetails.title",
          slug: "$jobDetails.slug",
          company: "$jobDetails.company",
          location: "$jobDetails.location",
          workplaceType: "$jobDetails.workplaceType",
          employmentType: "$jobDetails.employmentType",
          status: "$jobDetails.status"
        },
        applicant: {
          _id: "$applicantDetails._id",
          name: "$applicantDetails.name",
          email: "$applicantDetails.email",
          profession: "$applicantDetails.userProfile.profession",
          skills: "$applicantDetails.userProfile.skills"
        }
      },
    },
    // ৬. লেটেস্ট অ্যাপ্লিকেশনগুলো আগে দেখানোর জন্য সর্ট করা
    { $sort: { updatedAt: -1 } },
  ]);
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
  getApplications,
  getUserApplications,
  getAdminApplications,
  updateApplicationByAdmin,
};
