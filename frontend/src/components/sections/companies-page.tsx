"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, Building2, Globe, Layers3, Sparkles } from "lucide-react";

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
import { fetchJobs } from "@/services/jobs";

type CompanySummary = {
  name: string;
  website?: string;
  logo?: string;
  jobCount: number;
  featuredJobs: number;
  categories: string[];
  workplaceTypes: string[];
};

export function CompaniesPage() {
  const companiesQuery = useQuery({
    queryKey: ["public-companies"],
    queryFn: () => fetchJobs({ page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" }),
  });

  const companies = useMemo(() => {
    const map = new Map<string, CompanySummary>();

    for (const job of companiesQuery.data?.jobs ?? []) {
      const existing = map.get(job.company);

      if (existing) {
        existing.jobCount += 1;
        existing.featuredJobs += job.featured ? 1 : 0;
        if (!existing.categories.includes(job.category)) {
          existing.categories.push(job.category);
        }
        if (!existing.workplaceTypes.includes(job.workplaceType)) {
          existing.workplaceTypes.push(job.workplaceType);
        }
        continue;
      }

      map.set(job.company, {
        name: job.company,
        website: job.companyWebsite,
        logo: job.companyLogo,
        jobCount: 1,
        featuredJobs: job.featured ? 1 : 0,
        categories: [job.category],
        workplaceTypes: [job.workplaceType],
      });
    }

    return Array.from(map.values()).sort((left, right) => right.jobCount - left.jobCount);
  }, [companiesQuery.data?.jobs]);

  const highlights = [
    "Browse teams that are actively hiring across engineering, product, design, and operations.",
    "Compare brand signals, remote flexibility, and hiring volume without losing context.",
    "Move from discovery to application with the same premium workflow used across the platform.",
  ];

  const companyInsights = [
    {
      title: "Active hiring volume",
      description: "Teams shown here are pulled from live published jobs already in the platform feed.",
      value: `${companies.length} companies`,
      icon: Building2,
    },
    {
      title: "Featured opportunities",
      description: "Spot employers putting extra energy behind their highest-priority openings.",
      value: `${companies.reduce((sum, company) => sum + company.featuredJobs, 0)} featured roles`,
      icon: Sparkles,
    },
    {
      title: "Flexible work patterns",
      description: "Compare remote, hybrid, and on-site expectations before you commit to a funnel.",
      value: `${new Set(companies.flatMap((company) => company.workplaceTypes)).size} work modes`,
      icon: Globe,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <PublicPageHero
        badge="Companies"
        title="Find companies that are hiring with clarity, momentum, and a stronger candidate experience."
        description="The companies directory helps you evaluate real employers already posting roles on AI Career Helper, so you can prioritize teams with the right category fit, hiring urgency, and working style."
        primaryAction={{ href: "/jobs", label: "Explore Jobs" }}
        secondaryAction={{ href: "/register", label: "Create Account" }}
        highlights={highlights}
      />

      <PublicSection
        badge="Signals"
        title="A cleaner read on where to invest your attention."
        description="Instead of bouncing across disconnected tabs, you can compare companies using the same job signals, hiring activity, and work setup data already powering the platform."
        className="pb-8"
      >
        <PublicInfoGrid items={companyInsights} />
      </PublicSection>

      <PublicSection
        badge="Directory"
        title="Companies currently represented in the jobs feed."
        description="Every card below is derived from published jobs in the platform, which means you can go directly from company research to live openings without switching tools."
        className="pb-10"
      >
        {companiesQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : companies.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <GlassCard key={company.name} className="min-w-0 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-words text-xl font-semibold text-foreground">{company.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {company.jobCount} open role{company.jobCount === 1 ? "" : "s"} across{" "}
                      {company.categories.length} category{company.categories.length === 1 ? "" : "ies"}.
                    </p>
                  </div>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Categories</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{company.categories.slice(0, 2).join(", ")}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Work modes</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-foreground">
                      {company.workplaceTypes.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {company.categories.slice(0, 3).map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <GradientButton asChild>
                    <Link href={`/jobs?search=${encodeURIComponent(company.name)}`}>
                      View Open Roles
                      <ArrowRight className="size-4" />
                    </Link>
                  </GradientButton>
                  {company.website ? (
                    <Link
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
                    >
                      Company Website
                    </Link>
                  ) : null}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No companies are visible yet"
            description="As published jobs are added to the platform, the company directory will automatically reflect the teams currently hiring."
            action={
              <GradientButton asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </GradientButton>
            }
          />
        )}
      </PublicSection>

      <PublicSection
        badge="Why It Helps"
        title="Company research works better when it stays connected to action."
        description="These are the filters candidates usually care about most once they move from passive browsing to serious application planning."
        className="pb-10"
      >
        <PublicInfoGrid
          items={[
            {
              title: "Hiring momentum",
              description: "See which employers are posting consistently so you can focus on active funnels, not stale listings.",
              icon: BriefcaseBusiness,
            },
            {
              title: "Category alignment",
              description: "Compare companies by the work they are actually hiring for instead of generic brand claims.",
              icon: Layers3,
            },
            {
              title: "Application efficiency",
              description: "Move from research into AI-assisted resume, cover letter, and interview workflows without context switching.",
              icon: Sparkles,
            },
          ]}
        />
      </PublicSection>

      <PublicCtaSection
        badge="Next Move"
        title="Shortlist better employers before you spend time applying."
        description="Use the company directory to narrow the field, then jump into the jobs explorer and AI tools once you find a team worth pursuing."
        primaryAction={{ href: "/jobs", label: "Browse All Jobs" }}
        secondaryAction={{ href: "/dashboard/resume-analyzer", label: "Open AI Tools" }}
      />
    </main>
  );
}
