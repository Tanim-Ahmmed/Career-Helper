import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import type { JobsQuery } from "./jobs.interface";
import { jobsService } from "./jobs.service";

const createJob = catchAsync(async (req: Request, res: Response) => {
  const result = await jobsService.createJob(req.body);

  sendResponse(res, 201, {
    success: true,
    message: "Job created successfully.",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const validatedQuery = (res.locals.validated?.query ?? req.query) as JobsQuery & {
    includeDrafts?: boolean;
  };
  const includeDrafts =
    req.user?.role === "admin" && validatedQuery.includeDrafts === true;

  const result = await jobsService.getAllJobs(validatedQuery, includeDrafts);

  sendResponse(res, 200, {
    success: true,
    message: "Jobs retrieved successfully.",
    data: result,
  });
});

const getFeaturedJobs = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 4;
  const result = await jobsService.getFeaturedJobs(limit);

  sendResponse(res, 200, {
    success: true,
    message: "Featured jobs retrieved successfully.",
    data: result,
  });
});

const getJobBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await jobsService.getJobBySlug(String(req.params.slug));

  sendResponse(res, 200, {
    success: true,
    message: "Job details retrieved successfully.",
    data: result,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const result = await jobsService.getJobById(String(req.params.id));

  sendResponse(res, 200, {
    success: true,
    message: "Job retrieved successfully.",
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const result = await jobsService.updateJob(String(req.params.id), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Job updated successfully.",
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const result = await jobsService.deleteJob(String(req.params.id));

  sendResponse(res, 200, {
    success: true,
    message: "Job deleted successfully.",
    data: result,
  });
});

export const jobsController = {
  createJob,
  getAllJobs,
  getFeaturedJobs,
  getJobBySlug,
  getJobById,
  updateJob,
  deleteJob,
};
