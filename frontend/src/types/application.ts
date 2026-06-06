import type { Job } from "@/types/job";

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "interview"
  | "accepted"
  | "rejected";

export interface Application {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        profession?: string;
        role: "admin" | "user";
      };
  jobId:
    | string
    | Pick<
        Job,
        "title" | "slug" | "company" | "location" | "workplaceType" | "employmentType" | "status"
      > & { _id?: string };
  resumeUrl: string;
  coverLetter: string;
  applicationStatus: ApplicationStatus;
  interviewDate?: string | null;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApplicationsResponse {
  applications: Application[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateApplicationPayload {
  jobId: string;
  resumeUrl?: string;
  resumeText?:string;
  coverLetter?: string;
}

export interface UpdateApplicationPayload {
  applicationStatus: ApplicationStatus;
  interviewDate?: string | null;
  feedback?: string;
}
