import streamifier from "streamifier";

import { cloudinary } from "../../config/cloudinary";
import { AppError } from "../../utils/app-error";
import type {
  UploadResource,
  UploadedFileResponse,
} from "./uploads.interface";

const uploadFolderMap: Record<UploadResource, string> = {
  avatar: "ai-career-helper/avatars",
  "company-logo": "ai-career-helper/company-logos",
  "job-banner": "ai-career-helper/job-banners",
  resume: "ai-career-helper/resumes",
  "blog-image": "ai-career-helper/blog-images",
};

function getUploadOptions(resource: UploadResource) {
  const isResume = resource === "resume";

  return {
    folder: uploadFolderMap[resource],
    resource_type: isResume ? "raw" : "image",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  } as const;
}

async function uploadFileToCloudinary(
  file: Express.Multer.File,
  resource: UploadResource,
): Promise<UploadedFileResponse> {
  if (!file.buffer?.length) {
    throw new AppError("A file is required for upload.", 400);
  }

  const options = getUploadOptions(resource);

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    bytes: number;
    format?: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, resultData) => {
      if (error || !resultData) {
        reject(new AppError("Cloudinary upload failed.", 502));
        return;
      }

      resolve({
        public_id: resultData.public_id,
        secure_url: resultData.secure_url,
        bytes: resultData.bytes,
        format: resultData.format,
      });
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

  return {
    resource,
    url: result.secure_url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format,
    originalName: file.originalname,
  };
}

export const uploadsService = {
  uploadFileToCloudinary,
};
