import { api } from "@/services/api";
import type {
  PaginatedApplicationsResponse,
  Application,
  UpdateApplicationPayload,
} from "@/types/application";
import type { AuthUser } from "@/types/auth";
import type { PaginatedBlogsResponse } from "@/types/blog";
import type { AdminDashboardResponse, UserDashboardResponse } from "@/types/dashboard";
import type { JobsResponse } from "@/types/job";

export async function fetchUserDashboard() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: UserDashboardResponse;
  }>("/users/dashboard");
  return data.data;
}

export async function updateProfile(payload: Partial<AuthUser>) {
  const { data } = await api.patch<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/auth/me", payload);

  return data.data;
}

export async function fetchMyApplications() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: Application[];
  }>("/applications/me");

  return data.data;
}

export async function fetchAdminDashboard() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: AdminDashboardResponse;
  }>("/users/admin/overview");

  return data.data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: AuthUser[];
  }>("/users/admin/list");

  return data.data;
}

export async function fetchAdminJobs() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: JobsResponse;
  }>("/jobs", {
    params: {
      includeDrafts: "true",
      limit: 24,
    },
  });

  return data.data;
}

export async function fetchAdminApplications() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: PaginatedApplicationsResponse;
  }>("/applications/admin", {
    params: {
      limit: 24,
    },
  });

  return data.data;
}

export async function updateAdminApplication(id: string, payload: UpdateApplicationPayload) {
  const { data } = await api.patch<{
    success: boolean;
    message: string;
    data: Application;
  }>(`/applications/admin/${id}`, payload);

  return data.data;
}

export async function fetchAdminBlogs() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: PaginatedBlogsResponse;
  }>("/blogs/admin", {
    params: {
      limit: 24,
    },
  });

  return data.data;
}
