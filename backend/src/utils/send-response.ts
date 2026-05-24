import type { Response } from "express";

import type { ApiResponse } from "../interfaces/api-response.interface";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
) {
  res.status(statusCode).json(payload);
}
