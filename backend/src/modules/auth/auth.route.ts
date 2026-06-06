import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import { upload } from "../../middleware/upload-file";

export const authRoutes = Router();

authRoutes.get("/status", authController.getStatus);
authRoutes.post("/register", validateRequest(registerSchema), authController.register);
authRoutes.post("/login", validateRequest(loginSchema), authController.login);
authRoutes.post("/google", authController.googleLogin);
authRoutes.post("/logout", protect, authController.logout);
authRoutes.get("/me", protect, authController.getCurrentUser);
authRoutes.patch("/me", protect,upload.single("resumeFile"), authController.updateCurrentUser);
authRoutes.get("/admin-status", protect, restrictTo("admin"), authController.getAdminStatus);
