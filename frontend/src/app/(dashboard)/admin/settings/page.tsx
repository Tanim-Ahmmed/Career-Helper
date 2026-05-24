"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchAdminDashboard } from "@/services/dashboard";

export default function AdminSettingsPage() {
  const adminDashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });

  const stats = adminDashboardQuery.data?.stats;

  if (adminDashboardQuery.isLoading) {
    return <DashboardListLoadingShell items={3} columnsClassName="grid gap-4 md:grid-cols-2 xl:grid-cols-3" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Settings</SectionBadge>}
        title="Platform configuration snapshot"
        description="This page summarizes platform-level readiness and moderation context until deeper settings controls are introduced."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Featured Jobs"
          value={String(stats?.featuredJobs ?? 0)}
          description="Highlighted opportunities across the platform."
        />
        <DashboardCard
          title="Draft Blogs"
          value={String(stats?.draftBlogs ?? 0)}
          description="Content still waiting for publication."
        />
        <DashboardCard
          title="Published Jobs"
          value={String(stats?.publishedJobs ?? 0)}
          description="Roles currently visible in the public catalog."
        />
      </div>
    </div>
  );
}
