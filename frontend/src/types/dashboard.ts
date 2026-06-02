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

export interface RecruiterDashboardResponse {
  stats: {
    totalJobs: number;
    activeJobs: number;
    draftJobs: number;
    closedJobs: number;

    totalApplications: number;

    pendingApplications: number;
    reviewedApplications: number;
    shortlistedApplications: number;
    rejectedApplications: number;

    scheduledInterviews: number;

    totalViews: number;
  };

  recentApplications: Array<{
    id: string;
    applicantName: string;
    applicantEmail: string;
    jobTitle: string;
    status: string;
    appliedAt: Date;
  }>;

  topJobs: Array<{
    id: string;
    title: string;
    applications: number;
    views: number;
  }>;

  applicationTimeline: Array<{
    month: string;
    applications: number;
  }>;

  profileCompletion: {
    completed: boolean;
    percentage: number;
  };
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
