import type { HydratedDocument, Types } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "interview"
  | "shortlisted"
  | "accepted"
  | "rejected";

export interface IApplication {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  resumeText: string;
  resumeUrl: string;
  coverLetter: string;
  applicationStatus: ApplicationStatus;
  interviewDate?: Date | null;
  score?: number;
  feedback?: string;
}

export interface ApplicationsQuery {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateApplicationPayload {
  jobId: string;
  resumeUrl?: string;
  resumeText?: string;
  coverLetter?: string;
}

export interface UpdateApplicationPayload {
  applicationStatus: ApplicationStatus;
  interviewDate?: string | null;
  feedback?: string;
}

export type ApplicationDocument = HydratedDocument<IApplication>;
