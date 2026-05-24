export type UploadResource =
  | "avatar"
  | "company-logo"
  | "job-banner"
  | "resume"
  | "blog-image";

export interface UploadBody {
  resource: UploadResource;
}

export interface UploadedFileResponse {
  resource: UploadResource;
  url: string;
  publicId: string;
  secureUrl: string;
  bytes: number;
  format?: string;
  originalName: string;
}
