import type { Metadata } from "next";

import { BlogsPage } from "@/components/sections/blogs-page";

export const metadata: Metadata = {
  title: "Blogs | AI Career Helper",
  description:
    "Read practical career guidance on resumes, job search strategy, and interview preparation inside AI Career Helper.",
};

export default function BlogsRoute() {
  return <BlogsPage />;
}
