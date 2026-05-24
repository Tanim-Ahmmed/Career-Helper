import { Router } from "express";

import { optionalProtect, protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { jobsController } from "./jobs.controller";
import {
  createJobSchema,
  jobSlugParamSchema,
  jobsQuerySchema,
  updateJobSchema,
} from "./jobs.validation";

export const jobsRoutes = Router();

jobsRoutes.get("/", optionalProtect, validateRequest(jobsQuerySchema), jobsController.getAllJobs);
jobsRoutes.get("/featured", jobsController.getFeaturedJobs);

jobsRoutes.post(
  "/",
  protect,
  restrictTo("admin"),
  validateRequest(createJobSchema),
  jobsController.createJob,
);

jobsRoutes.get("/admin/:id", protect, restrictTo("admin"), jobsController.getJobById);
jobsRoutes.patch(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  validateRequest(updateJobSchema),
  jobsController.updateJob,
);
jobsRoutes.delete(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  jobsController.deleteJob,
);

jobsRoutes.get("/:slug", validateRequest(jobSlugParamSchema), jobsController.getJobBySlug);
