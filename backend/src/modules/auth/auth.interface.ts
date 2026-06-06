import type { IUserDocument, UserRole } from "../users/users.interface";

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  profession?: string;
  experienceLevel?: string;
  skills?: string[];
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthResponseUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  profession?: string;
  role: UserRole;
  aiUsageCount: number;
  savedJobs?: string[];
  appliedJobs?: string[];
  userProfile?:object;
  recruiterProfile?:object;
}

export interface AuthResponse {
  token: string;
  user: AuthResponseUser;
}

export type SafeUserDocument = Omit<IUserDocument, "password">;
