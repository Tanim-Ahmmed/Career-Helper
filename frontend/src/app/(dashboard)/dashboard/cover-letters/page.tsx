"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, FileText, PenLine, Sparkles, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { GlassCard } from "@/components/cards/glass-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { getErrorMessage } from "@/lib/api-error";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { Button } from "@/components/ui/button";
import { generateCoverLetter, fetchAiHistory } from "@/services/ai";
import { useAuthStore } from "@/store/auth-store";
import type { AiHistoryEntry, CoverLetterResult, CoverLetterTone } from "@/types/ai";

export default function CoverLettersPage() {
  const queryClient = useQueryClient();
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetterResult | null>(null);
  const user = useAuthStore((state) => state.user);

  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      applicantName: user?.name ?? "",
      jobTitle: "",
      companyName: "",
      hiringManagerName: "",
      tone: "professional",
      yearsOfExperience: "",
      jobDescription: "",
      keySkills: "",
      achievements: "",
      relevantExperience: "",
      additionalContext: "",
    },
  });

  const historyQuery = useQuery({
    queryKey: ["ai-history", "cover-letter-generator"],
    queryFn: () => fetchAiHistory(8, "cover-letter-generator"),
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: async (result) => {
      setGeneratedLetter(result);
      await queryClient.invalidateQueries({ queryKey: ["ai-history"] });
      toast.success("Cover letter generated successfully.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Unable to generate the cover letter right now. Please verify the Gemini backend configuration and try again.",
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
          result: safeParseCoverLetterHistory(entry),
        }))
        .filter((item) => item.result),
    [historyQuery.data],
  );

  const activeLetter = generatedLetter ?? parsedHistory[0]?.result ?? null;

  const onSubmit = form.handleSubmit(async (values) => {
    await generateCoverLetterMutation.mutateAsync({
      applicantName: values.applicantName || undefined,
      jobTitle: values.jobTitle,
      companyName: values.companyName,
      hiringManagerName: values.hiringManagerName || undefined,
      tone: values.tone,
      yearsOfExperience: values.yearsOfExperience ? Number(values.yearsOfExperience) : undefined,
      jobDescription: values.jobDescription || undefined,
      keySkills: splitCommaSeparated(values.keySkills),
      achievements: splitLineSeparated(values.achievements),
      relevantExperience: values.relevantExperience || undefined,
      additionalContext: values.additionalContext || undefined,
    });
  });

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Step 19</SectionBadge>}
        title="Cover letter generation hub"
        description="Generate tailored, Gemini-powered cover letters that stay grounded in your experience, the job description, and the company context."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <GlassCard className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Build a targeted letter</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add the role, company, relevant experience, and the strongest proof points you want the letter to emphasize.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Applicant name" error={form.formState.errors.applicantName?.message}>
                <input className={inputClassName} {...form.register("applicantName")} />
              </Field>
              <Field label="Tone" error={form.formState.errors.tone?.message}>
                <select className={inputClassName} {...form.register("tone")}>
                  {toneOptions.map((tone) => (
                    <option key={tone} value={tone}>
                      {capitalize(tone)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Job title" error={form.formState.errors.jobTitle?.message}>
                <input className={inputClassName} {...form.register("jobTitle")} />
              </Field>
              <Field label="Company name" error={form.formState.errors.companyName?.message}>
                <input className={inputClassName} {...form.register("companyName")} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Hiring manager"
                error={form.formState.errors.hiringManagerName?.message}
                hint="Optional, if you want the greeting personalized."
              >
                <input className={inputClassName} {...form.register("hiringManagerName")} />
              </Field>
              <Field
                label="Years of experience"
                error={form.formState.errors.yearsOfExperience?.message}
              >
                <input className={inputClassName} type="number" min="0" max="50" {...form.register("yearsOfExperience")} />
              </Field>
            </div>

            <Field
              label="Job description"
              error={form.formState.errors.jobDescription?.message}
              hint="Optional, but strongly improves specificity."
            >
              <textarea className={`${inputClassName} min-h-[180px] py-3`} {...form.register("jobDescription")} />
            </Field>

            <Field
              label="Key skills"
              error={form.formState.errors.keySkills?.message}
              hint="Comma-separated, for example: React, Product Strategy, Stakeholder Communication"
            >
              <input className={inputClassName} {...form.register("keySkills")} />
            </Field>

            <Field
              label="Achievements"
              error={form.formState.errors.achievements?.message}
              hint="One achievement per line. Numbers and measurable outcomes help."
            >
              <textarea className={`${inputClassName} min-h-[130px] py-3`} {...form.register("achievements")} />
            </Field>

            <Field
              label="Relevant experience"
              error={form.formState.errors.relevantExperience?.message}
            >
              <textarea className={`${inputClassName} min-h-[150px] py-3`} {...form.register("relevantExperience")} />
            </Field>

            <Field
              label="Additional context"
              error={form.formState.errors.additionalContext?.message}
              hint="Optional: reasons for interest, industry focus, remote preference, or product affinity."
            >
              <textarea className={`${inputClassName} min-h-[120px] py-3`} {...form.register("additionalContext")} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={generateCoverLetterMutation.isPending}>
                {generateCoverLetterMutation.isPending ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </div>
          </form>
        </GlassCard>

        <div className="space-y-4">
          {activeLetter ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <DashboardCard
                  title="Themes"
                  value={String(activeLetter.keyThemes.length)}
                  description="Core storylines emphasized in this letter."
                  icon={<Sparkles className="size-5" />}
                />
                <DashboardCard
                  title="Body Blocks"
                  value={String(activeLetter.bodyParagraphs.length)}
                  description="Main evidence sections in the generated draft."
                  icon={<PenLine className="size-5" />}
                />
                <DashboardCard
                  title="Targeting"
                  value={form.watch("companyName") || "Focused"}
                  description="Current company context being addressed."
                  icon={<Target className="size-5" />}
                />
              </div>

              <GlassCard className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Generated draft
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">
                      {activeLetter.headline}
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                  onClick={async () => {
                      await navigator.clipboard.writeText(activeLetter.fullLetter);
                      toast.success("Cover letter copied to clipboard.");
                    }}
                  >
                    <Copy className="mr-2 size-4" />
                    Copy Letter
                  </Button>
                </div>

                <div className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {activeLetter.fullLetter}
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Key themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeLetter.keyThemes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="flex min-h-[420px] items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-lg font-semibold text-foreground">No cover letter generated yet</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Submit the form to create a polished, job-specific draft with reusable themes and a full letter preview.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent cover letters</h2>
            <p className="text-sm text-muted-foreground">
              Successful drafts are stored in your AI history for quick reuse.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
        </div>

        {parsedHistory.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {parsedHistory.map(({ entry, result }) => (
              <div key={entry._id} className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{result!.headline}</p>
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
                  {result!.fullLetter}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Generated cover letters will appear here automatically after each successful run.
          </p>
        )}
      </GlassCard>
    </div>
  );
}

const coverLetterSchema = z.object({
  applicantName: z.string().trim().max(120).optional(),
  jobTitle: z.string().trim().min(2, "Add the role you are applying for."),
  companyName: z.string().trim().min(2, "Add the target company."),
  hiringManagerName: z.string().trim().max(120).optional(),
  tone: z.enum(["professional", "confident", "warm"]),
  yearsOfExperience: z.string().trim().optional(),
  jobDescription: z.string().trim().max(12000).optional(),
  keySkills: z.string().trim().optional(),
  achievements: z.string().trim().optional(),
  relevantExperience: z.string().trim().max(8000).optional(),
  additionalContext: z.string().trim().max(4000).optional(),
});

type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;

const toneOptions: CoverLetterTone[] = ["professional", "confident", "warm"];

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

function safeParseCoverLetterHistory(entry: AiHistoryEntry): CoverLetterResult | null {
  try {
    return JSON.parse(entry.responseText) as CoverLetterResult;
  } catch {
    return null;
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
