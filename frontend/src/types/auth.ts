export type UserRole = "admin" | "user" | "recruiter";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;

  userProfile: {
    bio?: string;
    profession?: string;
    skills?: string[];
    experienceLevel?: string;
    resumeUrl?: string;
    savedJobs?: string[];
    appliedJobs?: string[];

    socialLinks?: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
      website?: string;
    };
  }
  recruiterProfile: any;
  role: UserRole;
  aiUsageCount: number;
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
  role: "user" | "recruiter";
}

export interface GooglePayload {
  name: string;
  username: string;
  email: string;
  role: "user" | "recruiter";
}
