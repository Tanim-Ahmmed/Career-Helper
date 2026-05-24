"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { AnalyticsChartCard } from "@/components/dashboard/analytics-chart-card";
import {
  DashboardBarAnalyticsChart,
  DashboardDonutAnalyticsChart,
} from "@/components/dashboard/dashboard-charts";
import { GlassCard } from "@/components/cards/glass-card";
import { DashboardContentLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { getErrorMessage } from "@/lib/api-error";
import { fetchAdminApplications, fetchAdminJobs, updateAdminApplication } from "@/services/dashboard";
import type { Application, ApplicationStatus } from "@/types/application";
import {
  buildApplicationStatusAnalytics,
  buildUserProgressAnalytics,
} from "@/utils/dashboard-analytics";

export default function AdminReportsPage() {
  const applicationsQuery = useQuery({
    queryKey: ["admin-applications"],
    queryFn: fetchAdminApplications,
  });
  const jobsQuery = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: fetchAdminJobs,
  });
  const applicationStatusData = buildApplicationStatusAnalytics(
    applicationsQuery.data?.applications ?? [],
  );
  const roleDemandData = buildUserProgressAnalytics(
    {
      stats: {
        savedJobs: 0,
        appliedJobs: 0,
        aiUsageCount: 0,
        profileCompletion: 0,
      },
      profile: {
        id: "",
        name: "",
        username: "",
        email: "",
        role: "user",
        aiUsageCount: 0,
      },
      recentApplications: [],
      savedJobs: jobsQuery.data?.jobs ?? [],
      recommendedJobs: [],
    },
    [],
  ).opportunityCategories;

  if (applicationsQuery.isLoading || jobsQuery.isLoading) {
    return <DashboardContentLoadingShell cards={2} blocks={2} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Reports</SectionBadge>}
        title="Operational reports"
        description="Operational reporting now includes responsive chart views tied to live application and job data."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsChartCard
          title="Application status report"
          description="A distribution view of current application outcomes."
        >
          <DashboardDonutAnalyticsChart data={applicationStatusData} />
        </AnalyticsChartCard>
        <AnalyticsChartCard
          title="Hiring demand by category"
          description="A quick read on the strongest role categories in the active jobs pool."
        >
          <DashboardBarAnalyticsChart
            data={roleDemandData}
            bars={[{ key: "value", label: "Open Roles", color: "hsl(239 84% 67%)" }]}
          />
        </AnalyticsChartCard>
      </div>

      <div className="grid gap-4">
        {applicationsQuery.data?.applications.length ? (
          applicationsQuery.data.applications.map((application) => (
            <ApplicationManagementCard key={application._id} application={application} />
          ))
        ) : (
          <GlassCard>
            <p className="text-sm leading-6 text-muted-foreground">
              No application records exist yet. This reports view is ready as soon as workflows start generating records.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function ApplicationManagementCard({ application }: { application: Application }) {
  const queryClient = useQueryClient();
  const job = typeof application.jobId === "string" ? null : application.jobId;
  const user = typeof application.userId === "string" ? null : application.userId;
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(
    application.applicationStatus,
  );
  const [interviewDate, setInterviewDate] = useState(
    application.interviewDate ? application.interviewDate.slice(0, 10) : "",
  );
  const [feedback, setFeedback] = useState(application.feedback ?? "");

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAdminApplication(application._id, {
        applicationStatus,
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : null,
        feedback: feedback.trim(),
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["my-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] }),
      ]);
      toast.success("Application status updated successfully.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update the application right now."));
    },
  });

  return (
    <GlassCard className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-foreground">{job?.title ?? "Role unavailable"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.name ?? "Unknown applicant"} • {job?.company ?? "Unknown company"}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {user?.email ?? "No email available"}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {application.applicationStatus}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-foreground">
          <span className="font-medium">Status</span>
          <select
            value={applicationStatus}
            onChange={(event) => setApplicationStatus(event.target.value as ApplicationStatus)}
            className={inputClassName}
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-foreground">
          <span className="font-medium">Interview date</span>
          <input
            type="date"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="grid gap-2 text-sm text-foreground">
          <span className="font-medium">Resume</span>
          {application.resumeUrl ? (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-2xl border border-border/70 bg-background/70 px-4 text-sm font-medium text-primary"
            >
              Open resume link
            </a>
          ) : (
            <div className="inline-flex h-12 items-center rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-muted-foreground">
              No resume link
            </div>
          )}
        </label>
      </div>

      <label className="grid gap-2 text-sm text-foreground">
        <span className="font-medium">Feedback</span>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          className={`${inputClassName} min-h-28 py-3`}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <p className="text-sm text-muted-foreground">
          Submitted{" "}
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(application.createdAt))}
        </p>
        <button
          type="button"
          onClick={() => void updateMutation.mutateAsync()}
          disabled={updateMutation.isPending}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {updateMutation.isPending ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save update"
          )}
        </button>
      </div>
    </GlassCard>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
