"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJobBySlug } from "@/services/jobs";

export function useJobDetailsQuery(slug: string) {
  return useQuery({
    queryKey: ["job-details", slug],
    queryFn: () => fetchJobBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
  });
}
