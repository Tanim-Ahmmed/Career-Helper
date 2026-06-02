"use client";

import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, Users2, BarChart3, Star } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { AnalyticsChartCard } from "@/components/dashboard/analytics-chart-card";
import {
  DashboardAreaAnalyticsChart,
  DashboardBarAnalyticsChart,
  DashboardDonutAnalyticsChart,
} from "@/components/dashboard/dashboard-charts";

import { GlassCard } from "@/components/cards/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { DashboardContentLoadingShell } from "@/components/shared/loading-shells";

import { fetchRecruiterDashboard } from "@/services/dashboard";

export default function RecruiterOverviewPage() {
  const recruiterDashboardQuery = useQuery({
    queryKey: ["recruiter-dashboard"],
    queryFn: fetchRecruiterDashboard,
  });

  const data = recruiterDashboardQuery.data;

  if (recruiterDashboardQuery.isLoading) {
    return <DashboardContentLoadingShell cards={4} blocks={3} />;
  }

  const stats = data?.stats;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <PageHeader
        badge={<SectionBadge>Recruiter Dashboard</SectionBadge>}
        title="Hiring overview"
        description="Track your jobs, applications, and hiring performance in real time."
      />

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Jobs"
          value={String(stats?.totalJobs ?? 0)}
          description="Jobs you have posted"
          icon={<BriefcaseBusiness className="size-5" />}
        />

        <DashboardCard
          title="Active Jobs"
          value={String(stats?.activeJobs ?? 0)}
          description="Currently accepting applications"
          icon={<BriefcaseBusiness className="size-5" />}
        />

        <DashboardCard
          title="Applications"
          value={String(stats?.totalApplications ?? 0)}
          description="Total candidates applied"
          icon={<Users2 className="size-5" />}
        />

        <DashboardCard
          title="Shortlisted"
          value={String(stats?.shortlistedApplications ?? 0)}
          description="Candidates in shortlist"
          icon={<Star className="size-5" />}
        />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Application growth"
          description="Applications received over time"
        >
          <DashboardAreaAnalyticsChart
            data={data?.applicationTimeline ?? []}
            categories={[
              {
                key: "applications",
                label: "Applications",
                color: "hsl(239 84% 67%)",
              },
            ]}
          />
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Application status"
          description="Current hiring pipeline distribution"
        >
          <DashboardDonutAnalyticsChart
            data={[
              {
                label: "Pending",
                value: stats?.pendingApplications ?? 0,
              },
              {
                label: "Reviewed",
                value: stats?.reviewedApplications ?? 0,
              },
              {
                label: "Shortlisted",
                value: stats?.shortlistedApplications ?? 0,
              },
              {
                label: "Rejected",
                value: stats?.rejectedApplications ?? 0,
              },
            ]}
          />
        </AnalyticsChartCard>
      </div>

      {/* TOP JOBS */}
      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Top performing jobs"
          description="Jobs with highest engagement"
        >
          <DashboardBarAnalyticsChart
            data={data?.topJobs ?? []}
            bars={[
              {
                key: "views",
                label: "Views",
                color: "hsl(160 84% 39%)",
              },
            ]}
          />
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Hiring performance"
          description="Job vs application comparison"
        >
          <DashboardBarAnalyticsChart
            data={[
              {
                name: "Jobs",
                value: stats?.totalJobs ?? 0,
              },
              {
                name: "Applications",
                value: stats?.totalApplications ?? 0,
              },
            ]}
            bars={[
              {
                key: "value",
                label: "Count",
                color: "hsl(188 91% 42%)",
              },
            ]}
          />
        </AnalyticsChartCard>
      </div>

      {/* RECENT APPLICATIONS */}
      <GlassCard className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <p className="text-sm text-muted-foreground">
            Latest candidates who applied to your jobs
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data?.recentApplications?.map((app) => (
            <div
              key={app.id}
              className="rounded-[1.6rem] border border-border/70 bg-background/70 p-4"
            >
              <p className="font-semibold text-foreground">
                {app.applicantName}
              </p>

              <p className="text-sm text-muted-foreground">
                {app.jobTitle}
              </p>

              <p className="mt-2 text-xs text-primary font-semibold uppercase tracking-[0.15em]">
                {app.status}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}