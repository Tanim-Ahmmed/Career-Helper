import multer from "multer";

import { AppError } from "../utils/app-error";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
] as const;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype as (typeof allowedMimeTypes)[number])) {
      callback(
        new AppError(
          "Unsupported file type. Allowed formats are JPG, PNG, WEBP, and PDF.",
          400,
        ),
      );
      return;
    }

    callback(null, true);
  },
});
