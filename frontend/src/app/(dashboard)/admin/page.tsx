"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpenText, BriefcaseBusiness, Users2 } from "lucide-react";

import { AnalyticsChartCard } from "@/components/dashboard/analytics-chart-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  DashboardAreaAnalyticsChart,
  DashboardBarAnalyticsChart,
  DashboardDonutAnalyticsChart,
} from "@/components/dashboard/dashboard-charts";
import { GlassCard } from "@/components/cards/glass-card";
import { DashboardContentLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import {
  fetchAdminApplications,
  fetchAdminBlogs,
  fetchAdminDashboard,
  fetchAdminJobs,
  fetchAdminUsers,
} from "@/services/dashboard";
import {
  buildApplicationStatusAnalytics,
  buildPipelineAnalytics,
  buildPlatformActivityTimeline,
} from "@/utils/dashboard-analytics";

export default function AdminOverviewPage() {
  const adminDashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });
  const adminUsersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
  });
  const adminJobsQuery = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: fetchAdminJobs,
  });
  const adminApplicationsQuery = useQuery({
    queryKey: ["admin-applications"],
    queryFn: fetchAdminApplications,
  });
  const adminBlogsQuery = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: fetchAdminBlogs,
  });

  const data = adminDashboardQuery.data;
  const timelineData = buildPlatformActivityTimeline({
    users: adminUsersQuery.data ?? [],
    jobs: adminJobsQuery.data?.jobs ?? [],
    applications: adminApplicationsQuery.data?.applications ?? [],
    blogs: adminBlogsQuery.data?.blogs ?? [],
  });
  const applicationStatusData = buildApplicationStatusAnalytics(
    adminApplicationsQuery.data?.applications ?? [],
  );
  const pipelineData = buildPipelineAnalytics(
    data?.stats ?? {
      totalUsers: 0,
      totalAdmins: 0,
      totalJobs: 0,
      publishedJobs: 0,
      draftJobs: 0,
      featuredJobs: 0,
      totalApplications: 0,
      totalBlogs: 0,
      draftBlogs: 0,
      publishedBlogs: 0,
    },
    adminJobsQuery.data?.jobs ?? [],
    adminBlogsQuery.data?.blogs ?? [],
  );

  if (adminDashboardQuery.isLoading) {
    return <DashboardContentLoadingShell cards={4} blocks={3} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Step 15</SectionBadge>}
        title="Admin operations overview"
        description="A central view of platform volume, content readiness, and job pipeline health, with charts intentionally deferred to Step 16."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Users"
          value={String(data?.stats.totalUsers ?? 0)}
          description={`${data?.stats.totalAdmins ?? 0} admin accounts across the platform.`}
          icon={<Users2 className="size-5" />}
        />
        <DashboardCard
          title="Jobs"
          value={String(data?.stats.totalJobs ?? 0)}
          description={`${data?.stats.publishedJobs ?? 0} published and ${data?.stats.draftJobs ?? 0} draft roles.`}
          icon={<BriefcaseBusiness className="size-5" />}
        />
        <DashboardCard
          title="Applications"
          value={String(data?.stats.totalApplications ?? 0)}
          description="Application volume ready for report filtering."
          icon={<BarChart3 className="size-5" />}
        />
        <DashboardCard
          title="Blogs"
          value={String(data?.stats.totalBlogs ?? 0)}
          description={`${data?.stats.publishedBlogs ?? 0} published articles and ${data?.stats.draftBlogs ?? 0} drafts.`}
          icon={<BookOpenText className="size-5" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <AnalyticsChartCard
          title="Platform growth timeline"
          description="Real database activity across users, jobs, applications, and blogs over the last six months."
        >
          <DashboardAreaAnalyticsChart
            data={timelineData}
            categories={[
              { key: "users", label: "Users", color: "hsl(239 84% 67%)" },
              { key: "jobs", label: "Jobs", color: "hsl(188 91% 42%)" },
              { key: "applications", label: "Applications", color: "hsl(160 84% 39%)" },
              { key: "blogs", label: "Blogs", color: "hsl(222 47% 45%)" },
            ]}
          />
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Application status mix"
          description="How the current application pool is distributed by status."
        >
          <DashboardDonutAnalyticsChart data={applicationStatusData} />
        </AnalyticsChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Content and publishing pipeline"
          description="Published, draft, and featured content totals across jobs and blogs."
        >
          <DashboardBarAnalyticsChart
            data={pipelineData.contentMix}
            bars={[
              { key: "jobs", label: "Jobs", color: "hsl(239 84% 67%)" },
              { key: "blogs", label: "Blogs", color: "hsl(188 91% 42%)" },
            ]}
          />
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Top job categories"
          description="The categories carrying the most hiring inventory right now."
        >
          <DashboardBarAnalyticsChart
            data={pipelineData.topJobCategories}
            bars={[{ key: "jobs", label: "Jobs", color: "hsl(160 84% 39%)" }]}
          />
        </AnalyticsChartCard>
      </div>

      <GlassCard className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recent user signups</h2>
          <p className="text-sm text-muted-foreground">
            New accounts visible to the admin console before analytics charts are introduced.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data?.recentUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-[1.6rem] border border-border/70 bg-background/70 p-4"
            >
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {user.role}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
