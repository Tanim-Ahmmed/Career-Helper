import type { HydratedDocument } from "mongoose";

export type JobStatus = "draft" | "published" | "closed";
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";
export type WorkplaceType = "remote" | "hybrid" | "on-site";

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
  period: "hour" | "month" | "year";
}

export interface IJob {
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  companyWebsite?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  category: string;
  experienceLevel: string;
  salary: JobSalary;
  location: string;
  skillsRequired: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  applicantsCount: number;
  featured: boolean;
  status: JobStatus;
  views: number;
  applicationDeadline: Date;
}

export interface JobsQuery {
  search?: string;
  category?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: string;
  location?: string;
  status?: JobStatus;
  featured?: boolean;
  skills?: string[];
  sortBy?: "createdAt" | "applicationDeadline" | "views" | "applicantsCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type JobDocument = HydratedDocument<IJob>;
