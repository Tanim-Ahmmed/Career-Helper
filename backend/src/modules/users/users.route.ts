import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { usersController } from "./users.controller";
import { savedJobParamSchema, updateUserProfileSchema } from "./users.validation";

export const usersRoutes = Router();

usersRoutes.get("/status", usersController.getStatus);
usersRoutes.get("/me", protect, usersController.getProfile);
usersRoutes.patch("/me", protect, validateRequest(updateUserProfileSchema), usersController.updateProfile);
usersRoutes.post(
  "/me/saved-jobs/:jobId",
  protect,
  restrictTo("user"),
  validateRequest(savedJobParamSchema),
  usersController.saveJob,
);
usersRoutes.delete(
  "/me/saved-jobs/:jobId",
  protect,
  restrictTo("user"),
  validateRequest(savedJobParamSchema),
  usersController.unsaveJob,
);
usersRoutes.get("/dashboard", protect, usersController.getUserDashboard);
usersRoutes.get("/admin/overview", protect, restrictTo("admin"), usersController.getAdminDashboard);
usersRoutes.get("/admin/list", protect, restrictTo("admin"), usersController.getAdminUsers);
