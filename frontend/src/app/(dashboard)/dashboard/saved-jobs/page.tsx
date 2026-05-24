"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { JobCard } from "@/components/cards/job-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchUserDashboard } from "@/services/dashboard";

export default function SavedJobsPage() {
  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchUserDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <DashboardListLoadingShell items={4} columnsClassName="grid gap-4 lg:grid-cols-2" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Saved Jobs</SectionBadge>}
        title="Curated opportunities"
        description="Everything you bookmarked lives here so you can compare fit, urgency, and next action."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {dashboardQuery.data?.savedJobs.length ? (
          dashboardQuery.data.savedJobs.map((job) => <JobCard key={job._id} job={job} />)
        ) : (
          <EmptyState
            title="No saved jobs yet"
            description="Bookmark roles from the jobs explorer or any job details page to keep them here for side-by-side review."
            action={
              <PrimaryButton asChild>
                <Link href="/jobs">Explore jobs</Link>
              </PrimaryButton>
            }
          />
        )}
      </div>
    </div>
  );
}
