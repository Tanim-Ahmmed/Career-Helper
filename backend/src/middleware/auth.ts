import type { NextFunction, Request, Response } from "express";

import { usersModel } from "../modules/users/users.model";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { verifyToken } from "../utils/jwt";

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = await resolveRequestUser(req, true);
    req.user = user;
    next();
  },
);

export const optionalProtect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = await resolveRequestUser(req, false);

    if (user) {
      req.user = user;
    }

    next();
  },
);

export function restrictTo(...roles: Array<"admin" | "user" | 'recruiter'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized to access this resource.", 403));
    }

    next();
  };
}

async function resolveRequestUser(req: Request, required: boolean) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (required) {
      throw new AppError("Authentication required.", 401);
    }

    return undefined;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET);
  const user = await usersModel.findById(decoded.userId).select("-password");

  if (!user) {
    throw new AppError("User associated with this token was not found.", 401);
  }

  return user;
}
