export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  status: "draft" | "published";
  featured: boolean;
  readTime: string;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBlogsResponse {
  blogs: Blog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
