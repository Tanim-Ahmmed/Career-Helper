import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { AppError } from "../../utils/app-error";
import { uploadsService } from "./uploads.service";
import type { UploadBody } from "./uploads.interface";

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Please attach a file to upload.", 400);
  }

  const { resource } = req.body as UploadBody;
  const result = await uploadsService.uploadFileToCloudinary(req.file, resource);

  sendResponse(res, 201, {
    success: true,
    message: "File uploaded successfully.",
    data: result,
  });
});

export const uploadsController = {
  uploadFile,
};
