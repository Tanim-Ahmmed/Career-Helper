export type UserRole = "admin" | "user" | "recruiter";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  userProfile: {
    resumeFile: string;
    resumeText: string;
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
  recruiterProfile:{
    companyName: string;
    companyLogo: string;
    companyWebsite: string;
    companyLocation: string;
  
    companySize: string;
    industry: string;
    designation: string;
    companyDescription: string;
    foundedYear: string;
    phone: string;
    isVerified: boolean;
    hiringStatus:string;
    isComplete: boolean;
  };
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
