import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { applicationsController } from "./applications.controller";
import {
  applicationsQuerySchema,
  createApplicationSchema,
  updateApplicationSchema,
} from "./applications.validation";

export const applicationRoutes = Router();

applicationRoutes.get("/status", applicationsController.getStatus);
applicationRoutes.post("/", protect, restrictTo("user"), validateRequest(createApplicationSchema), applicationsController.createApplication,);
applicationRoutes.get("/", protect,restrictTo("admin", "recruiter"), applicationsController.getApplications);
applicationRoutes.get("/me", protect, applicationsController.getMyApplications);
applicationRoutes.get("/admin", protect, restrictTo("admin"), validateRequest(applicationsQuerySchema), applicationsController.getAdminApplications,);
applicationRoutes.patch("/admin/:id", protect, restrictTo("admin"), validateRequest(updateApplicationSchema), applicationsController.updateAdminApplication,);
