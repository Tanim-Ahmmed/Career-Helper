import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

export const authRoutes = Router();

authRoutes.get("/status", authController.getStatus);
authRoutes.post("/register", validateRequest(registerSchema), authController.register);
authRoutes.post("/login", validateRequest(loginSchema), authController.login);
authRoutes.post("/logout", protect, authController.logout);
authRoutes.get("/me", protect, authController.getCurrentUser);
authRoutes.get("/admin-status", protect, restrictTo("admin"), authController.getAdminStatus);
