export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

export type WorkplaceType = "remote" | "hybrid" | "on-site";
export type JobStatus = "draft" | "published" | "closed";

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
  period: "hour" | "month" | "year";
}

export interface Job {
  _id: string;
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
  applicationDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsResponse {
  jobs: Job[];
  meta: JobsMeta;
}

export interface JobDetailsResponse {
  job: Job;
  relatedJobs: Job[];
}

export interface JobMutationPayload {
  title: string;
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
  applicantsCount?: number;
  featured?: boolean;
  status?: JobStatus;
  views?: number;
  applicationDeadline: string;
}

export interface JobsQueryParams {
  search?: string;
  category?: string;
  employmentType?: EmploymentType | "";
  workplaceType?: WorkplaceType | "";
  experienceLevel?: string;
  location?: string;
  featured?: "true" | "";
  sortBy?: "createdAt" | "applicationDeadline" | "views" | "applicantsCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
