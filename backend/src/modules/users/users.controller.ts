import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { usersService } from "./users.service";
import { sendResponse } from "../../utils/send-response";

const getStatus = (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Users module structure is ready.",
    data: usersService.getStatus(),
  });
};

const getProfile = (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "User profile retrieved successfully.",
    data: usersService.getProfile(req.user!),
  });
};

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.updateProfile(req.user!._id.toString(), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
});

const getUserDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.getUserDashboard(req.user!);

  sendResponse(res, 200, {
    success: true,
    message: "User dashboard retrieved successfully.",
    data: result,
  });
});

const getAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await usersService.getAdminDashboard();

  sendResponse(res, 200, {
    success: true,
    message: "Admin dashboard retrieved successfully.",
    data: result,
  });
});

const getAdminUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await usersService.getAdminUsers();

  sendResponse(res, 200, {
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
});

const saveJob = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.saveJob(req.user!._id.toString(), String(req.params.jobId));

  sendResponse(res, 200, {
    success: true,
    message: "Job saved successfully.",
    data: result,
  });
});

const unsaveJob = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.unsaveJob(req.user!._id.toString(), String(req.params.jobId));

  sendResponse(res, 200, {
    success: true,
    message: "Job removed from saved list successfully.",
    data: result,
  });
});

export const usersController = {
  getStatus,
  getProfile,
  updateProfile,
  getUserDashboard,
  getAdminDashboard,
  getAdminUsers,
  saveJob,
  unsaveJob,
};
