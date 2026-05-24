"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpenText, Clock3, Sparkles, TrendingUp } from "lucide-react";

import { GlassCard } from "@/components/cards/glass-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import {
  PublicCtaSection,
  PublicInfoGrid,
  PublicPageHero,
  PublicSection,
} from "@/components/sections/public-page-sections";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientButton } from "@/components/shared/gradient-button";
import { fetchPublicBlogs } from "@/services/blogs";

export function BlogsPage() {
  const blogsQuery = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => fetchPublicBlogs(1, 9),
  });

  const blogs = blogsQuery.data?.blogs ?? [];
  const featuredCount = blogs.filter((blog) => blog.featured).length;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <PublicPageHero
        badge="Blogs"
        title="Practical career writing for candidates who want clearer applications and stronger interviews."
        description="The blog section turns platform knowledge into useful guidance on job search strategy, resume positioning, AI-assisted workflows, and thoughtful career growth."
        primaryAction={{ href: "/register", label: "Start Building Your Profile" }}
        secondaryAction={{ href: "/jobs", label: "See Live Opportunities" }}
        highlights={[
          "Read content that connects directly to the workflows inside AI Career Helper.",
          "Use the same career system for discovery, writing, and interview preparation.",
          "Stay focused on practical steps instead of generic productivity advice.",
        ]}
      />

      <PublicSection
        badge="Editorial Focus"
        title="A blog built around the real moments candidates struggle with most."
        description="Everything here is designed to make the next application, interview, or career decision easier to act on."
        className="pb-8"
      >
        <PublicInfoGrid
          items={[
            {
              title: "Actionable guidance",
              description: "Advice is tied to applications, resumes, interview prep, and role targeting instead of vague motivation.",
              value: `${blogs.length} published articles`,
              icon: BookOpenText,
            },
            {
              title: "Featured insights",
              description: "High-priority content gets surfaced first so readers reach the strongest guidance faster.",
              value: `${featuredCount} featured`,
              icon: Sparkles,
            },
            {
              title: "Career momentum",
              description: "Articles support the same growth loop as the dashboard, AI tools, and jobs explorer.",
              value: "Integrated workflow",
              icon: TrendingUp,
            },
          ]}
        />
      </PublicSection>

      <PublicSection
        badge="Latest Posts"
        title="Published blog content from the platform."
        description="These posts are pulled from the live backend and organized to support sharper applications, stronger positioning, and better interview readiness."
        className="pb-10"
      >
        {blogsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : blogs.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <GlassCard key={blog._id} className="h-full min-w-0 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {blog.category}
                  </span>
                  {blog.featured ? (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Featured
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <h2 className="break-words text-2xl font-semibold tracking-tight text-foreground">
                    {blog.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">{blog.excerpt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4 text-secondary" />
                    {blog.readTime}
                  </span>
                  <span>{blog.authorName}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published blogs yet"
            description="The editorial pipeline is connected. As soon as published blog entries are available, they will appear here automatically."
            action={
              <GradientButton asChild>
                <Link href="/jobs">Explore Jobs Instead</Link>
              </GradientButton>
            }
          />
        )}
      </PublicSection>

      <PublicCtaSection
        badge="Keep Moving"
        title="Turn what you read into better applications."
        description="Use the blog for guidance, then move into jobs discovery and the AI workflow when you’re ready to act on what you learned."
        primaryAction={{ href: "/dashboard/cover-letters", label: "Open Cover Letter Tool" }}
        secondaryAction={{ href: "/jobs", label: "Find Roles" }}
      />
    </main>
  );
}
