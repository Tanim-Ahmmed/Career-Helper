"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchJobs } from "@/services/jobs";
import type { JobsQueryParams } from "@/types/job";

export function useJobsQuery(params: JobsQueryParams) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
    placeholderData: keepPreviousData,
  });
}
