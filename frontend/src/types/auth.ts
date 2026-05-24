export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  skills?: string[];
  experienceLevel?: string;
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  role: UserRole;
  aiUsageCount: number;
  savedJobs?: string[];
  appliedJobs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  profession?: string;
  experienceLevel?: string;
  skills?: string[];
  bio?: string;
}
