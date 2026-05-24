import type { FilterQuery } from "mongoose";

import type { BlogsQuery, IBlog } from "./blogs.interface";
import { blogsModel } from "./blogs.model";

function buildBlogsFilter(query: BlogsQuery): FilterQuery<IBlog> {
  const filter: FilterQuery<IBlog> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { excerpt: { $regex: query.search, $options: "i" } },
      { category: { $regex: query.search, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.search, $options: "i" } } },
    ];
  }

  return filter;
}

async function getAdminBlogs(query: BlogsQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const filter = buildBlogsFilter(query);

  const [blogs, total] = await Promise.all([
    blogsModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    blogsModel.countDocuments(filter),
  ]);

  return {
    blogs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function getPublicBlogs(query: BlogsQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 9;
  const skip = (page - 1) * limit;
  const filter = buildBlogsFilter({
    ...query,
    status: "published",
  });

  const [blogs, total] = await Promise.all([
    blogsModel.find(filter).sort({ featured: -1, publishedAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
    blogsModel.countDocuments(filter),
  ]);

  return {
    blogs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export const blogsService = {
  async getStatus() {
    return {
      module: "blogs",
      ready: true,
      totalBlogs: await blogsModel.countDocuments(),
      statuses: ["draft", "published"],
    };
  },
  getAdminBlogs,
  getPublicBlogs,
};
