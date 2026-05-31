export type UserRole = "admin" | "user";

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
  role: string;
}

export interface GooglePayload {
  name: string;
  username: string;
  email: string;
  role: string;
}
