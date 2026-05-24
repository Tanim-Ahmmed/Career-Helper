import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { blogsService } from "./blogs.service";
import { sendResponse } from "../../utils/send-response";

const getStatus = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Blogs module structure is ready.",
    data: await blogsService.getStatus(),
  });
});

const getAdminBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogsService.getAdminBlogs(res.locals.validated?.query ?? req.query);

  sendResponse(res, 200, {
    success: true,
    message: "Admin blogs retrieved successfully.",
    data: result,
  });
});

const getPublicBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogsService.getPublicBlogs(res.locals.validated?.query ?? req.query);

  sendResponse(res, 200, {
    success: true,
    message: "Published blogs retrieved successfully.",
    data: result,
  });
});

export const blogsController = {
  getStatus,
  getAdminBlogs,
  getPublicBlogs,
};
