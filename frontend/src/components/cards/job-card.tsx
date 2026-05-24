"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/cards/glass-card";
import { JobActionButtons } from "@/components/shared/job-action-buttons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Job } from "@/types/job";

function formatSalary(salary: Job["salary"]) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: salary.currency || "USD",
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} / ${salary.period}`;
}

function formatDeadline(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function JobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply?: () => void;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isSaved = Boolean(user?.savedJobs?.includes(job._id));
  const hasApplied = Boolean(user?.appliedJobs?.includes(job._id));

  return (
    <GlassCard className="flex h-full min-w-0 flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border-white/15 bg-white/60 p-5 dark:bg-slate-950/50 sm:p-6">
      <div className="min-w-0 space-y-5">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {job.category}
              </span>
              {job.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <Sparkles className="size-3" />
                  Featured
                </span>
              ) : null}
            </div>
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
                {job.title}
              </h3>
              <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary xl:size-10 2xl:size-11">
            <BriefcaseBusiness className="size-5" />
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
          {job.shortDescription}
        </p>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-secondary" />
            <span className="min-w-0 break-words">
              {job.location} / {job.workplaceType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0 text-secondary" />
            <span className="min-w-0 break-words">
              {job.employmentType} / Deadline {formatDeadline(job.applicationDeadline)}
            </span>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-border/70 bg-background/70 px-4 py-3 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Salary Range
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">{formatSalary(job.salary)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className={cn("rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground")}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
        <div className="flex-1 break-words text-sm text-muted-foreground">
          {job.views} views / {job.applicantsCount} applicants
        </div>
        <div className="flex w-full flex-col gap-3">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-secondary"
          >
            View details
            <ArrowRight className="size-4" />
          </Link>
          {user?.role === "user" ? (
            <JobActionButtons
              jobId={job._id}
              variant="inline"
              hasApplied={hasApplied}
              isSaved={isSaved}
              onApply={onApply ?? (() => router.push(`/jobs/${job.slug}`))}
            />
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
