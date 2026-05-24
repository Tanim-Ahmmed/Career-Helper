import type { FilterQuery, UpdateQuery } from "mongoose";

import { AppError } from "../../utils/app-error";
import { slugify } from "../../utils/slugify";
import type { IJob, JobsQuery } from "./jobs.interface";
import { jobsModel } from "./jobs.model";

type CreateJobPayload = Omit<IJob, "slug">;
type UpdateJobPayload = Partial<Omit<IJob, "slug">>;

async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (await jobsModel.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function buildJobsFilter(query: JobsQuery, includeDrafts: boolean): FilterQuery<IJob> {
  const filter: FilterQuery<IJob> = {};

  if (!includeDrafts) {
    filter.status = "published";
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { company: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.search, $options: "i" } } },
    ];
  }

  if (query.category) {
    filter.category = { $regex: `^${query.category}$`, $options: "i" };
  }

  if (query.employmentType) {
    filter.employmentType = query.employmentType;
  }

  if (query.workplaceType) {
    filter.workplaceType = query.workplaceType;
  }

  if (query.experienceLevel) {
    filter.experienceLevel = { $regex: `^${query.experienceLevel}$`, $options: "i" };
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (typeof query.featured === "boolean") {
    filter.featured = query.featured;
  }

  if (query.skills?.length) {
    filter.skillsRequired = {
      $all: query.skills.map((skill) => new RegExp(`^${skill}$`, "i")),
    };
  }

  return filter;
}

async function createJob(payload: CreateJobPayload) {
  const slug = await generateUniqueSlug(payload.title);

  const createdJob = await jobsModel.create({
    ...payload,
    slug,
  });

  return createdJob;
}

async function getAllJobs(query: JobsQuery, includeDrafts = false) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  const filter = buildJobsFilter(query, includeDrafts);

  const [jobs, total] = await Promise.all([
    jobsModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    jobsModel.countDocuments(filter),
  ]);

  return {
    jobs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function getFeaturedJobs(limit = 4) {
  return jobsModel
    .find({
      status: "published",
      featured: true,
    })
    .sort({ createdAt: -1 })
    .limit(limit);
}

async function getJobBySlug(slug: string) {
  const job = await jobsModel.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true },
  );

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  const stronglyRelatedJobs = await jobsModel
    .find({
      _id: { $ne: job._id },
      status: "published",
      $or: [
        { category: job.category },
        { company: job.company },
        { tags: { $in: job.tags } },
        { skillsRequired: { $in: job.skillsRequired } },
      ],
    })
    .sort({ featured: -1, createdAt: -1 })
    .limit(4);

  const existingIds = stronglyRelatedJobs.map((relatedJob) => relatedJob._id);
  const remainingSlots = Math.max(0, 4 - stronglyRelatedJobs.length);

  const fallbackJobs =
    remainingSlots > 0
      ? await jobsModel
          .find({
            _id: { $nin: [job._id, ...existingIds] },
            status: "published",
          })
          .sort({ featured: -1, createdAt: -1 })
          .limit(remainingSlots)
      : [];

  return {
    job,
    relatedJobs: [...stronglyRelatedJobs, ...fallbackJobs],
  };
}

async function getJobById(id: string) {
  const job = await jobsModel.findById(id);

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  return job;
}

async function updateJob(id: string, payload: UpdateJobPayload) {
  const updateData: UpdateQuery<IJob> = { ...payload };

  if (payload.title) {
    const baseSlug = slugify(payload.title);
    let slug = baseSlug;
    let counter = 1;

    while (await jobsModel.exists({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    updateData.slug = slug;
  }

  const updatedJob = await jobsModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    throw new AppError("Job not found.", 404);
  }

  return updatedJob;
}

async function deleteJob(id: string) {
  const deletedJob = await jobsModel.findByIdAndDelete(id);

  if (!deletedJob) {
    throw new AppError("Job not found.", 404);
  }

  return deletedJob;
}

export const jobsService = {
  createJob,
  getAllJobs,
  getFeaturedJobs,
  getJobBySlug,
  getJobById,
  updateJob,
  deleteJob,
};
