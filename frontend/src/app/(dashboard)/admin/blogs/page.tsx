"use client";

import { useQuery } from "@tanstack/react-query";

import { GlassCard } from "@/components/cards/glass-card";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchAdminBlogs } from "@/services/dashboard";

export default function AdminBlogsPage() {
  const blogsQuery = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: fetchAdminBlogs,
  });

  if (blogsQuery.isLoading) {
    return <DashboardListLoadingShell items={4} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Manage Blogs</SectionBadge>}
        title="Editorial pipeline"
        description="Review article readiness, publishing status, and featured content from the admin side."
      />

      <div className="grid gap-4">
        {blogsQuery.data?.blogs.length ? (
          blogsQuery.data.blogs.map((blog) => (
            <GlassCard key={blog._id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{blog.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {blog.category} • {blog.readTime}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {blog.status}
                  </span>
                  {blog.featured ? (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Featured
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{blog.excerpt}</p>
            </GlassCard>
          ))
        ) : (
          <GlassCard>
            <p className="text-sm leading-6 text-muted-foreground">
              No blog documents exist yet. The admin page is ready for content as soon as entries are created.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
