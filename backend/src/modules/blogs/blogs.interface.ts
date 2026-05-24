import type { HydratedDocument } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  featured: boolean;
  readTime: string;
  views: number;
  publishedAt?: Date | null;
}

export interface BlogsQuery {
  status?: BlogStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export type BlogDocument = HydratedDocument<IBlog>;
