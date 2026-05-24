import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { upload } from "../../middleware/upload-file";
import { validateRequest } from "../../middleware/validate-request";
import { uploadsController } from "./uploads.controller";
import { uploadFileSchema } from "./uploads.validation";

export const uploadsRoutes = Router();

uploadsRoutes.post(
  "/",
  protect,
  upload.single("file"),
  validateRequest(uploadFileSchema),
  (req, res, next) => {
    const resource = req.body.resource as string;
    const isAdminOnlyResource = ["company-logo", "job-banner", "blog-image"].includes(resource);

    if (isAdminOnlyResource) {
      return restrictTo("admin")(req, res, next);
    }

    next();
  },
  uploadsController.uploadFile,
);
