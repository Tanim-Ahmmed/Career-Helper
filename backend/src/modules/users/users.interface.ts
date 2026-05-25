import type { HydratedDocument, Types } from "mongoose";

export type UserRole = "admin" | "user" | "recruiter";

export interface UserSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface IRecruiterProfile {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyLocation?: string;

  companySize?:
    | "1-10"
    | "11-50"
    | "51-200"
    | "201-500"
    | "500+";

  industry?: string;

  designation?: string;

  companyDescription?: string;

  foundedYear?: number;

  phone?: string;

  isVerified?: boolean;

  hiringStatus?:
    | "actively_hiring"
    | "occasionally_hiring"
    | "not_hiring";
}

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  skills: string[];
  experienceLevel?: string;
  resumeUrl?: string;
  socialLinks: UserSocialLinks;
  role: UserRole;
  recruiterProfile?: IRecruiterProfile;
  savedJobs: Types.ObjectId[];
  appliedJobs: Types.ObjectId[];
  aiUsageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = HydratedDocument<IUser>;