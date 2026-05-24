import type { Application } from "@/types/application";
import type { AuthUser } from "@/types/auth";
import type { Blog } from "@/types/blog";
import type { Job } from "@/types/job";

export interface UserDashboardResponse {
  stats: {
    savedJobs: number;
    appliedJobs: number;
    aiUsageCount: number;
    profileCompletion: number;
  };
  profile: AuthUser;
  recentApplications: Application[];
  savedJobs: Job[];
  recommendedJobs: Job[];
}

export interface AdminDashboardResponse {
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalJobs: number;
    publishedJobs: number;
    draftJobs: number;
    featuredJobs: number;
    totalApplications: number;
    totalBlogs: number;
    draftBlogs: number;
    publishedBlogs: number;
  };
  recentUsers: AuthUser[];
}

export interface DashboardAdminData {
  users: AuthUser[];
  applications: Application[];
  blogs: Blog[];
}

export interface ChartDatum {
  label: string;
  value: number;
}
