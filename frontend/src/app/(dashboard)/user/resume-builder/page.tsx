"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, FileSearch, Sparkles, Target } from "lucide-react";

import { GlassCard } from "@/components/cards/glass-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getErrorMessage } from "@/lib/api-error";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { Button } from "@/components/ui/button";
import { analyzeResume, fetchAiHistory } from "@/services/ai";
import type { AiHistoryEntry, ResumeAnalysisResult } from "@/types/ai";

const resumeAnalyzerSchema = z.object({
  resumeText: z.string().trim().min(120, "Paste a fuller resume so the analyzer has enough context."),
  targetJobTitle: z.string().trim().max(200).optional(),
  targetJobDescription: z.string().trim().max(12000).optional(),
  targetSkills: z.string().trim().optional(),
});

type ResumeAnalyzerFormValues = z.infer<typeof resumeAnalyzerSchema>;

export default function ResumeAnalyzerPage() {
  const queryClient = useQueryClient();
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const form = useForm<ResumeAnalyzerFormValues>({
    resolver: zodResolver(resumeAnalyzerSchema),
    defaultValues: {
      resumeText: "",
      targetJobTitle: "",
      targetJobDescription: "",
      targetSkills: "",
    },
  });

  const historyQuery = useQuery({
    queryKey: ["ai-history", "resume-analyzer"],
    queryFn: () => fetchAiHistory(10, "resume-analyzer"),
  });

  const analyzeResumeMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: async (result) => {
      setAnalysisResult(result);
      await queryClient.invalidateQueries({ queryKey: ["ai-history"] });
      toast.success("Resume analyzed successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Unable to analyze the resume right now. Please verify the Gemini backend configuration and try again.",
        ),
      );
    },
  });

  const parsedHistory = useMemo(
    () =>
      (historyQuery.data ?? [])
        .filter((entry) => entry.status === "success")
        .map((entry) => ({
          entry,
          result: safeParseResumeHistory(entry),
        }))
        .filter((item) => item.result),
    [historyQuery.data],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    await analyzeResumeMutation.mutateAsync({
      resumeText: values.resumeText,
      targetJobTitle: values.targetJobTitle || undefined,
      targetJobDescription: values.targetJobDescription || undefined,
      targetSkills: values.targetSkills
        ? values.targetSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
    });
  });

  const activeResult = analysisResult ?? parsedHistory[0]?.result ?? null;

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Step 18</SectionBadge>}
        title="Resume analysis workspace"
        description="Run a real Gemini-powered resume review for ATS score, missing skills, formatting, grammar, and keyword optimization."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <GlassCard className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Analyze your resume</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Paste your resume text, add the target role if you have one, and the analyzer will return a structured review you can act on immediately.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <Field
              label="Resume text"
              error={form.formState.errors.resumeText?.message}
              hint="Paste the full resume text for best ATS and keyword analysis."
            >
              <textarea
                className={`${inputClassName} min-h-[260px] py-3`}
                {...form.register("resumeText")}
              />
            </Field>

            <Field label="Target job title" error={form.formState.errors.targetJobTitle?.message}>
              <input className={inputClassName} {...form.register("targetJobTitle")} />
            </Field>

            <Field
              label="Target job description"
              error={form.formState.errors.targetJobDescription?.message}
              hint="Optional, but strongly improves relevance."
            >
              <textarea
                className={`${inputClassName} min-h-[180px] py-3`}
                {...form.register("targetJobDescription")}
              />
            </Field>

            <Field
              label="Target skills"
              error={form.formState.errors.targetSkills?.message}
              hint="Comma-separated, for example: React, TypeScript, REST APIs, Product Thinking"
            >
              <input className={inputClassName} {...form.register("targetSkills")} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={analyzeResumeMutation.isPending}>
                {analyzeResumeMutation.isPending ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </div>
          </form>
        </GlassCard>

        <div className="space-y-4">
          {activeResult ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                  title="ATS Score"
                  value={`${activeResult.atsScore}/100`}
                  description="Estimated match quality for automated screening."
                  icon={<Target className="size-5" />}
                />
                <DashboardCard
                  title="Strengths"
                  value={String(activeResult.strengths.length)}
                  description="Strong points the resume already communicates well."
                  icon={<CheckCircle2 className="size-5" />}
                />
                <DashboardCard
                  title="Missing Skills"
                  value={String(activeResult.missingSkills.length)}
                  description="Capabilities the target role likely expects to see."
                  icon={<AlertTriangle className="size-5" />}
                />
                <DashboardCard
                  title="Suggested Keywords"
                  value={String(activeResult.suggestedKeywords.length)}
                  description="Terms worth integrating naturally into the resume."
                  icon={<Sparkles className="size-5" />}
                />
              </div>

              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Summary
                </p>
                <p className="text-sm leading-7 text-muted-foreground">{activeResult.summary}</p>
              </GlassCard>

              <div className="grid gap-4 md:grid-cols-2">
                <InsightList
                  title="Strengths"
                  items={activeResult.strengths}
                  emptyLabel="No strengths were returned."
                />
                <InsightList
                  title="Missing Skills"
                  items={activeResult.missingSkills}
                  emptyLabel="No missing skills were flagged."
                />
                <InsightList
                  title="Formatting Issues"
                  items={activeResult.formattingIssues}
                  emptyLabel="No formatting issues were flagged."
                />
                <InsightList
                  title="Grammar Issues"
                  items={activeResult.grammarIssues}
                  emptyLabel="No grammar issues were flagged."
                />
                <InsightList
                  title="Keyword Optimization"
                  items={activeResult.keywordOptimization}
                  emptyLabel="No keyword suggestions were returned."
                />
                <InsightList
                  title="Recommended Improvements"
                  items={activeResult.recommendedImprovements}
                  emptyLabel="No improvement priorities were returned."
                />
              </div>

              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Suggested Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeResult.suggestedKeywords.length ? (
                    activeResult.suggestedKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No suggested keywords returned.</p>
                  )}
                </div>
              </GlassCard>
            </>
          ) : (
            <EmptyState
              title="No resume analysis yet"
              description="Submit a resume to receive a real ATS-focused analysis with skill gaps, formatting notes, grammar feedback, and keyword guidance."
            />
          )}
        </div>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent resume analyses</h2>
            <p className="text-sm text-muted-foreground">
              Your latest successful Gemini resume reviews are saved to AI history.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileSearch className="size-5" />
          </div>
        </div>

        {parsedHistory.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {parsedHistory.map(({ entry, result }) => (
              <div
                key={entry._id}
                className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      ATS Score {result!.atsScore}/100
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(entry.createdAt))}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {entry.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{result!.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Resume analyses you run here will appear in this history section automatically.
          </p>
        )}
      </GlassCard>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function InsightList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <GlassCard className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      {items.length ? (
        <div className="grid gap-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-[1.2rem] border border-border/70 bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </GlassCard>
  );
}

function safeParseResumeHistory(entry: AiHistoryEntry): ResumeAnalysisResult | null {
  try {
    return JSON.parse(entry.responseText) as ResumeAnalysisResult;
  } catch {
    return null;
  }
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
