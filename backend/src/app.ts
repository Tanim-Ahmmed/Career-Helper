import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found-handler";
import { apiRouter } from "./routes";
import { getDatabaseStatus } from "./utils/database-status";

const app = express();

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Career Helper API is running.",
    data: {
      environment: env.NODE_ENV,
      database: getDatabaseStatus(),
    },
  });
});

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
