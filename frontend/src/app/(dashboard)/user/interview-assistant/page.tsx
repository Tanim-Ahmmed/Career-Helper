"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, BriefcaseBusiness, CircleAlert, MessageSquareQuote, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { GlassCard } from "@/components/cards/glass-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { getErrorMessage } from "@/lib/api-error";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { Button } from "@/components/ui/button";
import { fetchAiHistory, generateInterviewAssistant } from "@/services/ai";
import type {
  AiHistoryEntry,
  InterviewAssistantResult,
  InterviewType,
} from "@/types/ai";

const interviewAssistantSchema = z.object({
  jobTitle: z.string().trim().min(2, "Add the target role."),
  companyName: z.string().trim().max(200).optional(),
  experienceLevel: z.string().trim().max(120).optional(),
  interviewType: z.enum(["technical", "behavioral", "hr", "mixed"]),
  jobDescription: z.string().trim().max(12000).optional(),
  focusAreas: z.string().trim().optional(),
  resumeHighlights: z.string().trim().optional(),
  numberOfQuestions: z.string().trim().optional(),
});

type InterviewAssistantFormValues = z.infer<typeof interviewAssistantSchema>;

const interviewTypes: InterviewType[] = ["mixed", "technical", "behavioral", "hr"];

export default function InterviewAssistantPage() {
  const queryClient = useQueryClient();
  const [prepResult, setPrepResult] = useState<InterviewAssistantResult | null>(null);

  const form = useForm<InterviewAssistantFormValues>({
    resolver: zodResolver(interviewAssistantSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      experienceLevel: "",
      interviewType: "mixed",
      jobDescription: "",
      focusAreas: "",
      resumeHighlights: "",
      numberOfQuestions: "5",
    },
  });

  const historyQuery = useQuery({
    queryKey: ["ai-history", "interview-assistant"],
    queryFn: () => fetchAiHistory(8, "interview-assistant"),
  });

  const interviewAssistantMutation = useMutation({
    mutationFn: generateInterviewAssistant,
    onSuccess: async (result) => {
      setPrepResult(result);
      await queryClient.invalidateQueries({ queryKey: ["ai-history"] });
      toast.success("Interview prep generated successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Unable to generate interview prep right now. Please verify the Gemini backend configuration and try again.",
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
          result: safeParseInterviewHistory(entry),
        }))
        .filter((item) => item.result),
    [historyQuery.data],
  );

  const activeResult = prepResult ?? parsedHistory[0]?.result ?? null;

  const onSubmit = form.handleSubmit(async (values) => {
    await interviewAssistantMutation.mutateAsync({
      jobTitle: values.jobTitle,
      companyName: values.companyName || undefined,
      experienceLevel: values.experienceLevel || undefined,
      interviewType: values.interviewType,
      jobDescription: values.jobDescription || undefined,
      focusAreas: splitCommaSeparated(values.focusAreas),
      resumeHighlights: splitLineSeparated(values.resumeHighlights),
      numberOfQuestions: values.numberOfQuestions ? Number(values.numberOfQuestions) : undefined,
    });
  });

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Step 20</SectionBadge>}
        title="AI interview assistant"
        description="Generate tailored technical, behavioral, HR, or mixed interview prep with high-signal questions, talking points, and practical coaching."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <GlassCard className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Prepare your next interview</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tell the assistant which role you are targeting, what kind of interview to expect, and the strengths you want to sharpen before the conversation.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Job title" error={form.formState.errors.jobTitle?.message}>
                <input className={inputClassName} {...form.register("jobTitle")} />
              </Field>
              <Field label="Company name" error={form.formState.errors.companyName?.message}>
                <input className={inputClassName} {...form.register("companyName")} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Experience level"
                error={form.formState.errors.experienceLevel?.message}
              >
                <input className={inputClassName} {...form.register("experienceLevel")} />
              </Field>
              <Field label="Interview type" error={form.formState.errors.interviewType?.message}>
                <select className={inputClassName} {...form.register("interviewType")}>
                  {interviewTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "hr" ? "HR" : capitalize(type)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Question count"
                error={form.formState.errors.numberOfQuestions?.message}
              >
                <input className={inputClassName} type="number" min="3" max="10" {...form.register("numberOfQuestions")} />
              </Field>
            </div>

            <Field
              label="Job description"
              error={form.formState.errors.jobDescription?.message}
              hint="Optional, but useful for sharper role-specific questions."
            >
              <textarea className={`${inputClassName} min-h-[180px] py-3`} {...form.register("jobDescription")} />
            </Field>

            <Field
              label="Focus areas"
              error={form.formState.errors.focusAreas?.message}
              hint="Comma-separated, for example: system design, stakeholder communication, SQL, conflict management"
            >
              <input className={inputClassName} {...form.register("focusAreas")} />
            </Field>

            <Field
              label="Resume highlights"
              error={form.formState.errors.resumeHighlights?.message}
              hint="One highlight per line. These become raw material for talking points."
            >
              <textarea className={`${inputClassName} min-h-[150px] py-3`} {...form.register("resumeHighlights")} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={interviewAssistantMutation.isPending}>
                {interviewAssistantMutation.isPending ? "Generating..." : "Generate Interview Prep"}
              </Button>
            </div>
          </form>
        </GlassCard>

        <div className="space-y-4">
          {activeResult ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                  title="Questions"
                  value={String(activeResult.questions.length)}
                  description="Tailored prompts to practice before the interview."
                  icon={<MessageSquareQuote className="size-5" />}
                />
                <DashboardCard
                  title="Prep Tips"
                  value={String(activeResult.preparationTips.length)}
                  description="Practical coaching notes worth reviewing."
                  icon={<BrainCircuit className="size-5" />}
                />
                <DashboardCard
                  title="Red Flags"
                  value={String(activeResult.redFlags.length)}
                  description="Pitfalls and weak answers to avoid."
                  icon={<CircleAlert className="size-5" />}
                />
                <DashboardCard
                  title="Interview Type"
                  value={form.watch("interviewType") === "hr" ? "HR" : capitalize(form.watch("interviewType"))}
                  description="Current prep angle used for this session."
                  icon={<Target className="size-5" />}
                />
              </div>

              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Session summary
                </p>
                <p className="text-sm leading-7 text-muted-foreground">{activeResult.summary}</p>
              </GlassCard>

              <div className="grid gap-4">
                {activeResult.questions.map((item, index) => (
                  <GlassCard key={`${item.question}-${index}`} className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Question {index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-foreground">{item.question}</h3>
                      </div>
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BriefcaseBusiness className="size-5" />
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Why this matters
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.intent}</p>
                    </div>

                    <div className="grid gap-2">
                      {item.sampleTalkingPoints.map((point) => (
                        <div
                          key={point}
                          className="rounded-[1.2rem] border border-border/70 bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InsightList
                  title="Preparation Tips"
                  items={activeResult.preparationTips}
                  emptyLabel="No preparation tips were returned."
                />
                <InsightList
                  title="Red Flags"
                  items={activeResult.redFlags}
                  emptyLabel="No red flags were returned."
                />
              </div>

              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Final advice
                </p>
                <p className="text-sm leading-7 text-muted-foreground">{activeResult.finalAdvice}</p>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="flex min-h-[420px] items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-lg font-semibold text-foreground">No interview prep generated yet</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Submit the form to create targeted practice questions, answer angles, and last-mile prep guidance.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent interview prep sessions</h2>
            <p className="text-sm text-muted-foreground">
              Successful coaching sessions are saved to your AI history for reuse.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquareQuote className="size-5" />
          </div>
        </div>

        {parsedHistory.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {parsedHistory.map(({ entry, result }) => (
              <div key={entry._id} className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {result!.questions[0]?.question ?? "Interview prep session"}
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
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {result!.summary}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Interview assistant sessions will appear here automatically after each successful run.
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

function splitCommaSeparated(value?: string) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function splitLineSeparated(value?: string) {
  return value
    ? value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function safeParseInterviewHistory(entry: AiHistoryEntry): InterviewAssistantResult | null {
  try {
    return JSON.parse(entry.responseText) as InterviewAssistantResult;
  } catch {
    return null;
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
