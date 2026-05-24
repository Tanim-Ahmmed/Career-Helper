"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { GlassCard } from "@/components/cards/glass-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchMyApplications } from "@/services/dashboard";

export default function UserApplicationsPage() {
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: fetchMyApplications,
  });

  if (applicationsQuery.isLoading) {
    return <DashboardListLoadingShell items={3} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Applications</SectionBadge>}
        title="Tracked applications"
        description="Monitor status changes, interview timing, and feedback from every role connected to your account."
      />

      <div className="grid gap-4">
        {applicationsQuery.data?.length ? (
          applicationsQuery.data.map((application) => {
            const job = typeof application.jobId === "string" ? null : application.jobId;

            return (
              <GlassCard key={application._id} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {job?.title ?? "Role unavailable"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job?.company ?? "Unknown company"}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {application.applicationStatus}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Meta label="Workplace" value={job?.workplaceType ?? "Not available"} />
                  <Meta label="Employment" value={job?.employmentType ?? "Not available"} />
                  <Meta
                    label="Updated"
                    value={new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(application.updatedAt))}
                  />
                  <Meta
                    label="Interview"
                    value={
                      application.interviewDate
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(application.interviewDate))
                        : "Not scheduled"
                    }
                  />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {application.feedback || "Feedback has not been attached to this application yet."}
                </p>
              </GlassCard>
            );
          })
        ) : (
          <EmptyState
            title="No applications submitted yet"
            description="Apply from any live job detail page and your submissions will appear here with their latest status, timing, and feedback."
            action={
              <PrimaryButton asChild>
                <Link href="/jobs">Browse jobs</Link>
              </PrimaryButton>
            }
          />
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
