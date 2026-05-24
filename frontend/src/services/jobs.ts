import { api } from "@/services/api";
import type {
  JobDetailsResponse,
  JobMutationPayload,
  Job,
  JobsQueryParams,
  JobsResponse,
} from "@/types/job";
import type { AuthUser } from "@/types/auth";
import type { Application, CreateApplicationPayload } from "@/types/application";

export async function fetchJobs(params: JobsQueryParams) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: JobsResponse;
  }>("/jobs", {
    params,
  });

  return data.data;
}

export async function fetchJobBySlug(slug: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: JobDetailsResponse;
  }>(`/jobs/${slug}`);

  return data.data;
}

export async function fetchFeaturedJobs(limit = 4) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: Job[];
  }>("/jobs/featured", {
    params: {
      limit,
    },
  });

  return data.data;
}

export async function fetchAdminJobById(id: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: Job;
  }>(`/jobs/admin/${id}`);

  return data.data;
}

export async function createJob(payload: JobMutationPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: Job;
  }>("/jobs", payload);

  return data.data;
}

export async function updateJob(id: string, payload: Partial<JobMutationPayload>) {
  const { data } = await api.patch<{
    success: boolean;
    message: string;
    data: Job;
  }>(`/jobs/admin/${id}`, payload);

  return data.data;
}

export async function deleteJob(id: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: Job;
  }>(`/jobs/admin/${id}`);

  return data.data;
}

export async function applyToJob(payload: CreateApplicationPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: Application;
  }>("/applications", payload);

  return data.data;
}

export async function saveJob(jobId: string) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>(`/users/me/saved-jobs/${jobId}`);

  return data.data;
}

export async function unsaveJob(jobId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>(`/users/me/saved-jobs/${jobId}`);

  return data.data;
}
