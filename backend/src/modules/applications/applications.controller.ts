import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { applicationService } from "./applications.service";
import { sendResponse } from "../../utils/send-response";

const getStatus = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Applications module structure is ready.",
    data: await applicationService.getStatus(),
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const applications = await applicationService.getUserApplications(req.user!._id.toString());

  sendResponse(res, 200, {
    success: true,
    message: "Applications retrieved successfully.",
    data: applications,
  });
});

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await applicationService.createApplication(req.user!._id.toString(), req.body);

  sendResponse(res, 201, {
    success: true,
    message: "Application submitted successfully.",
    data: result,
  });
});

const getAdminApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await applicationService.getAdminApplications(res.locals.validated?.query ?? req.query);

  sendResponse(res, 200, {
    success: true,
    message: "Admin applications retrieved successfully.",
    data: result,
  });
});

const updateAdminApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await applicationService.updateApplicationByAdmin(
    String(req.params.id),
    req.body,
  );

  sendResponse(res, 200, {
    success: true,
    message: "Application updated successfully.",
    data: result,
  });
});

export const applicationsController = {
  getStatus,
  createApplication,
  getMyApplications,
  getAdminApplications,
  updateAdminApplication,
};
