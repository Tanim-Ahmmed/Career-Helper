import { api } from "@/services/api";
import type { PaginatedBlogsResponse } from "@/types/blog";

export async function fetchPublicBlogs(page = 1, limit = 9) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: PaginatedBlogsResponse;
  }>("/blogs", {
    params: { page, limit },
  });

  return data.data;
}
