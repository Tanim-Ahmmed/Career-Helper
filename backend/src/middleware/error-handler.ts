import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next;

  const isOperationalError = error instanceof AppError;
  const statusCode = isOperationalError ? error.statusCode : 500;
  const message = isOperationalError
    ? error.message
    : "Something went wrong on the server.";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && error instanceof Error
      ? { stack: error.stack }
      : {}),
  });
}
