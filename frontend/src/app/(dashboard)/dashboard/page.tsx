"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, FileSearch, Sparkles, UserCircle2 } from "lucide-react";
import Link from "next/link";

import { AnalyticsChartCard } from "@/components/dashboard/analytics-chart-card";
import { JobCard } from "@/components/cards/job-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  DashboardBarAnalyticsChart,
  DashboardDonutAnalyticsChart,
} from "@/components/dashboard/dashboard-charts";
import { GlassCard } from "@/components/cards/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import { fetchMyApplications, fetchUserDashboard } from "@/services/dashboard";
import { buildUserProgressAnalytics } from "@/utils/dashboard-analytics";

export default function UserDashboardOverviewPage() {
  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchUserDashboard,
  });
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: fetchMyApplications,
  });

  const dashboard = dashboardQuery.data;
  const analytics = buildUserProgressAnalytics(
    dashboard,
    applicationsQuery.data ?? dashboard?.recentApplications ?? [],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Step 14</SectionBadge>}
        title="Your career workspace"
        description="Track saved jobs, application progress, profile completion, and the Gemini-powered tools that strengthen each stage of your search."
        action={
          <Link
            href="/dashboard/profile-settings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Refine profile
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      {dashboardQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="h-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Saved Jobs"
              value={String(dashboard?.stats.savedJobs ?? 0)}
              description="Roles you bookmarked for later review."
              icon={<Sparkles className="size-5" />}
            />
            <DashboardCard
              title="Applications"
              value={String(dashboard?.stats.appliedJobs ?? 0)}
              description="Tracked applications tied to your profile."
              icon={<BriefcaseBusiness className="size-5" />}
            />
            <DashboardCard
              title="AI Usage"
              value={String(dashboard?.stats.aiUsageCount ?? 0)}
              description="Generations recorded so far."
              icon={<FileSearch className="size-5" />}
            />
            <DashboardCard
              title="Profile Completion"
              value={`${dashboard?.stats.profileCompletion ?? 0}%`}
              description="A stronger profile improves relevance and trust."
              icon={<UserCircle2 className="size-5" />}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
            <GlassCard className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Recommended jobs</h2>
                  <p className="text-sm text-muted-foreground">
                    Suggestions based on your profile and platform highlights.
                  </p>
                </div>
                <Link href="/jobs" className="text-sm font-semibold text-primary">
                  Explore more
                </Link>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {dashboard?.recommendedJobs.length ? (
                  dashboard.recommendedJobs.map((job) => <JobCard key={job._id} job={job} />)
                ) : (
                  <GlassCard className="lg:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Recommended jobs will appear here once jobs and profile signals overlap.
                    </p>
                  </GlassCard>
                )}
              </div>
            </GlassCard>

            <GlassCard className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recent applications</h2>
                <p className="text-sm text-muted-foreground">
                  A quick pulse on where each application stands right now.
                </p>
              </div>
              <div className="grid gap-3">
                {dashboard?.recentApplications.length ? (
                  dashboard.recentApplications.map((application) => {
                    const job = typeof application.jobId === "string" ? null : application.jobId;

                    return (
                      <div
                        key={application._id}
                        className="rounded-[1.6rem] border border-border/70 bg-background/70 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {job?.title ?? "Role unavailable"}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {job?.company ?? "Unknown company"}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            {application.applicationStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    No tracked applications yet. Once application workflows are used, this panel will update automatically.
                  </p>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <AnalyticsChartCard
              title="Career momentum mix"
              description="A live snapshot of saved jobs, applications, AI usage, and profile strength."
            >
              <DashboardBarAnalyticsChart
                data={analytics.progressMix}
                bars={[{ key: "value", label: "Value", color: "hsl(239 84% 67%)" }]}
              />
            </AnalyticsChartCard>

            <AnalyticsChartCard
              title="Application status breakdown"
              description="The current distribution of your tracked applications."
            >
              <DashboardDonutAnalyticsChart data={analytics.applicationStatuses} />
            </AnalyticsChartCard>
          </div>

          <AnalyticsChartCard
            title="Opportunity categories"
            description="The strongest categories across your saved and recommended jobs."
          >
            <DashboardBarAnalyticsChart
              data={analytics.opportunityCategories}
              bars={[{ key: "value", label: "Jobs", color: "hsl(160 84% 39%)" }]}
            />
          </AnalyticsChartCard>
        </>
      )}
    </div>
  );
}
