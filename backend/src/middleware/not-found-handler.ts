import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}
