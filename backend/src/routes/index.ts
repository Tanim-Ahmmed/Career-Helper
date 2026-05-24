import { Router } from "express";

import { aiRoutes } from "../modules/ai/ai.route";
import { applicationRoutes } from "../modules/applications/applications.route";
import { authRoutes } from "../modules/auth/auth.route";
import { blogRoutes } from "../modules/blogs/blogs.route";
import { jobsRoutes } from "../modules/jobs/jobs.route";
import { uploadsRoutes } from "../modules/uploads/uploads.route";
import { usersRoutes } from "../modules/users/users.route";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Career Helper API v1",
    data: {
      modules: ["auth", "users", "jobs", "ai", "applications", "blogs"],
    },
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/jobs", jobsRoutes);
apiRouter.use("/uploads", uploadsRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/applications", applicationRoutes);
apiRouter.use("/blogs", blogRoutes);
