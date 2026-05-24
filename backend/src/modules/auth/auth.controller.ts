import type { Request, Response } from "express";

import { sendResponse } from "../../utils/send-response";
import { catchAsync } from "../../utils/catch-async";
import { authService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendResponse(res, 201, {
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Login successful.",
    data: result,
  });
});

const logout = (req: Request, res: Response) => {
  void req;

  sendResponse(res, 200, authService.logout());
};

const getCurrentUser = (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Authenticated user retrieved successfully.",
    data: authService.getCurrentUser(req.user!),
  });
};

const getAdminStatus = (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Admin-only route accessed successfully.",
    data: {
      module: "auth",
      role: req.user?.role,
      area: "admin",
    },
  });
};

const getStatus = (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Auth module is configured and active.",
    data: authService.getStatus(),
  });
};

export const authController = {
  register,
  login,
  logout,
  getCurrentUser,
  getAdminStatus,
  getStatus,
};
