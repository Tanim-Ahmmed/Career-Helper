import type { HydratedDocument, Types } from "mongoose";

export type UserRole = "admin" | "user";

export interface UserSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
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
  savedJobs: Types.ObjectId[];
  appliedJobs: Types.ObjectId[];
  aiUsageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = HydratedDocument<IUser>;
