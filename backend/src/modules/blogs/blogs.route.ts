import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { blogsController } from "./blogs.controller";
import { blogsQuerySchema } from "./blogs.validation";

export const blogRoutes = Router();

blogRoutes.get("/status", blogsController.getStatus);
blogRoutes.get("/", validateRequest(blogsQuerySchema), blogsController.getPublicBlogs);
blogRoutes.get(
  "/admin",
  protect,
  restrictTo("admin"),
  validateRequest(blogsQuerySchema),
  blogsController.getAdminBlogs,
);
