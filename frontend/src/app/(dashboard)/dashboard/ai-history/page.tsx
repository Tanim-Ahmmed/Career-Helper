"use client";

import { useQuery } from "@tanstack/react-query";
import { Cpu, DatabaseZap, ShieldCheck } from "lucide-react";

import { AnalyticsChartCard } from "@/components/dashboard/analytics-chart-card";
import { DashboardBarAnalyticsChart } from "@/components/dashboard/dashboard-charts";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchAiHistory, fetchAiStatus } from "@/services/ai";
import { fetchMyApplications, fetchUserDashboard } from "@/services/dashboard";
import { buildUserProgressAnalytics } from "@/utils/dashboard-analytics";

export default function AiHistoryPage() {
  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchUserDashboard,
  });
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: fetchMyApplications,
  });
  const aiStatusQuery = useQuery({
    queryKey: ["ai-status"],
    queryFn: fetchAiStatus,
  });
  const aiHistoryQuery = useQuery({
    queryKey: ["ai-history"],
    queryFn: () => fetchAiHistory(20),
  });

  const aiUsageCount = dashboardQuery.data?.stats.aiUsageCount ?? 0;
  const analytics = buildUserProgressAnalytics(
    dashboardQuery.data,
    applicationsQuery.data ?? [],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>AI History</SectionBadge>}
        title="AI activity overview"
        description="Review the Gemini-powered resume analyses, cover letters, and interview prep sessions already recorded against your account."
      />
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <DashboardCard
          title="Recorded AI Runs"
          value={String(aiUsageCount)}
          description="Every successful protected AI generation increments your account usage."
        />
        <DashboardCard
          title="Provider"
          value={aiStatusQuery.data?.provider === "gemini" ? "Gemini" : "Not Ready"}
          description={aiStatusQuery.data?.defaultModel ?? "Awaiting backend configuration."}
          icon={<Cpu className="size-5" />}
        />
        <DashboardCard
          title="History Records"
          value={String(aiHistoryQuery.data?.length ?? 0)}
          description="Persisted AI requests and responses stored by the backend."
          icon={<DatabaseZap className="size-5" />}
        />
        <DashboardCard
          title="Integration State"
          value={aiStatusQuery.data?.ready ? "Active" : "Pending"}
          description="Protected Gemini backend integration for upcoming AI tools."
          icon={<ShieldCheck className="size-5" />}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AnalyticsChartCard
          title="Career activity mix"
          description="This chart shows how saved jobs, applications, profile strength, and AI usage currently balance across your workflow."
        >
          <DashboardBarAnalyticsChart
            data={analytics.progressMix}
            bars={[{ key: "value", label: "Value", color: "hsl(188 91% 42%)" }]}
          />
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Gemini backend readiness"
          description="The shared AI module now powers multiple feature-specific dashboard experiences through protected endpoints."
        >
          <div className="grid gap-3">
            <ReadinessItem
              label="Provider"
              value={aiStatusQuery.data?.provider ?? "Unknown"}
            />
            <ReadinessItem
              label="SDK"
              value={aiStatusQuery.data?.sdk ?? "Unknown"}
            />
            <ReadinessItem
              label="Default model"
              value={aiStatusQuery.data?.defaultModel ?? "Unknown"}
            />
            <ReadinessItem
              label="Capabilities"
              value={aiStatusQuery.data?.features.join(", ") ?? "Loading"}
            />
              <p className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                {aiStatusQuery.data?.nextStep ??
                "Feature-specific Gemini tools are active and storing usage history here."}
              </p>
          </div>
        </AnalyticsChartCard>
      </div>

      {aiHistoryQuery.data?.length ? (
        <div className="grid gap-4">
          {aiHistoryQuery.data.map((entry) => (
            <div
              key={entry._id}
              className="glass-panel rounded-[2rem] border border-border/60 p-6 shadow-glass"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {entry.feature}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{entry.model}</h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    entry.status === "success"
                      ? "bg-accent/10 text-accent"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Prompt
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.prompt}</p>
                </div>
                <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Response
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {entry.responseText || entry.errorMessage || "No output was stored."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No AI history yet"
          description="Your Gemini workspace is ready. Once you run a resume analysis, cover letter, or interview prep session, the output will appear here."
        />
      )}
    </div>
  );
}

function ReadinessItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
