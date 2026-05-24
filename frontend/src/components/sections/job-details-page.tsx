"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe,
  Layers3,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { JobCard } from "@/components/cards/job-card";
import { GlassCard } from "@/components/cards/glass-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientButton } from "@/components/shared/gradient-button";
import { JobActionButtons } from "@/components/shared/job-action-buttons";
import { ModalShell } from "@/components/shared/modal-shell";
import { PageHeader } from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubtitle } from "@/components/shared/section-subtitle";
import { SectionTitle } from "@/components/shared/section-title";
import { useJobDetailsQuery } from "@/hooks/use-job-details-query";
import { getErrorMessage } from "@/lib/api-error";
import { applyToJob } from "@/services/jobs";
import { useAuthStore } from "@/store/auth-store";
import type { Application } from "@/types/application";
import type { Job } from "@/types/job";

function formatSalary(salary: Job["salary"]) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: salary.currency || "USD",
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} / ${salary.period}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getCompanyInitials(company: string) {
  return company
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function JobDetailsPage({ slug }: { slug: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { data, isLoading, isError } = useJobDetailsQuery(slug);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const applicationForm = useForm({
    defaultValues: {
      resumeUrl: user?.resumeUrl ?? "",
      coverLetter: "",
    },
  });

  const applyMutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: async (application: Application) => {
      if (user) {
        const appliedJobId =
          typeof application.jobId === "string" ? application.jobId : application.jobId._id;

        updateUser({
          ...user,
          appliedJobs: Array.from(new Set([...(user.appliedJobs ?? []), appliedJobId ?? ""])).filter(Boolean),
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["job-details", slug] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);

      toast.success("Application submitted successfully.");
      setIsApplyModalOpen(false);
      applicationForm.reset({
        resumeUrl: user?.resumeUrl ?? "",
        coverLetter: "",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to submit your application right now."));
    },
  });

  const galleryCards = useMemo(() => {
    if (!data?.job) {
      return [];
    }

    return [
      {
        title: "Brand Snapshot",
        value: data.job.company,
        icon: Building2,
        accent: "from-primary/20 via-secondary/10 to-accent/10",
      },
      {
        title: "Workplace Mode",
        value: `${data.job.workplaceType} • ${data.job.location}`,
        icon: MapPin,
        accent: "from-secondary/20 via-primary/10 to-accent/10",
      },
      {
        title: "Team Demand",
        value: `${data.job.applicantsCount} applicants • ${data.job.views} views`,
        icon: Users2,
        accent: "from-accent/20 via-secondary/10 to-primary/10",
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
        <Container className="space-y-8">
          <SkeletonCard />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </Container>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
        <Container>
          <EmptyState
            title="Job details could not be loaded"
            description="The requested role could not be retrieved from the backend. Confirm the job exists and the API server is running."
            action={
              <PrimaryButton asChild>
                <Link href="/jobs">Back to jobs</Link>
              </PrimaryButton>
            }
          />
        </Container>
      </main>
    );
  }

  const { job, relatedJobs } = data;
  const isSaved = Boolean(user?.savedJobs?.includes(job._id));
  const hasApplied = Boolean(user?.appliedJobs?.includes(job._id));

  return (
    <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
      <Container className="space-y-8">
        <PageHeader
          badge={<SectionBadge>Job Details</SectionBadge>}
          title={job.title}
          description={job.shortDescription}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton asChild variant="outline">
                <Link href="/jobs">
                  <ArrowLeft className="size-4" />
                  Back to jobs
                </Link>
              </PrimaryButton>
              {user?.role === "user" ? (
                <JobActionButtons
                  jobId={job._id}
                  variant="inline"
                  isSaved={isSaved}
                  hasApplied={hasApplied}
                  onApply={() => setIsApplyModalOpen(true)}
                />
              ) : (
                <GradientButton
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please log in to apply for jobs.");
                      router.push("/login");
                      return;
                    }

                    toast.error("Admin accounts cannot apply to jobs.");
                  }}
                >
                  Apply Now
                  <ArrowRight className="size-4" />
                </GradientButton>
              )}
            </div>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard className="overflow-hidden rounded-[2rem] border-white/15 bg-white/65 p-0 md:col-span-2 dark:bg-slate-950/50">
                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 p-8">
                  <div className="absolute inset-0 bg-grid opacity-60" />
                  <div className="relative flex size-28 items-center justify-center rounded-[2rem] border border-white/25 bg-white/70 text-3xl font-semibold tracking-[0.18em] text-foreground shadow-glass dark:bg-slate-900/70">
                    {job.companyLogo ? (
                      <div
                        aria-label={`${job.company} logo`}
                        role="img"
                        className="h-full w-full rounded-[2rem] bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${job.companyLogo})` }}
                      />
                    ) : (
                      getCompanyInitials(job.company)
                    )}
                  </div>
                </div>
              </GlassCard>

              <div className="grid gap-6">
                {galleryCards.map(({ title, value, icon: Icon, accent }) => (
                  <GlassCard
                    key={title}
                    className={`rounded-[2rem] border-white/15 bg-gradient-to-br ${accent} p-5 dark:bg-slate-950/50`}
                  >
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/70 text-primary dark:bg-slate-900/70">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {title}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold text-foreground">
                      {value}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ContentBlock badge="Description" title="Role overview" items={[job.description]} prose />
              <ContentBlock badge="Responsibilities" title="What you will own" items={job.responsibilities} />
              <ContentBlock badge="Requirements" title="What the team is looking for" items={job.requirements} />
              <ContentBlock badge="Benefits" title="What comes with the role" items={job.benefits} />
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <GlassCard className="rounded-[2rem] border-white/15 bg-white/60 p-6 dark:bg-slate-950/50">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BriefcaseBusiness className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{job.company}</p>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
                  </div>
                </div>

                <div className="grid gap-4 text-sm text-muted-foreground">
                  <InfoRow icon={MapPin} label="Location" value={job.location} />
                  <InfoRow
                    icon={Layers3}
                    label="Work setup"
                    value={`${job.employmentType} • ${job.workplaceType}`}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Application deadline"
                    value={formatDate(job.applicationDeadline)}
                  />
                  <InfoRow icon={ShieldCheck} label="Salary range" value={formatSalary(job.salary)} />
                </div>

                {job.companyWebsite ? (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-secondary"
                  >
                    <Globe className="size-4" />
                    Visit company website
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </GlassCard>

            <GlassCard className="rounded-[2rem] border-white/15 bg-white/60 p-6 dark:bg-slate-950/50">
              <SectionBadge>Skills Required</SectionBadge>
              <SectionTitle className="mt-4 text-2xl">Core strengths</SectionTitle>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="break-words rounded-full border border-border/70 px-3 py-1.5 text-sm font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="rounded-[2rem] border-white/15 bg-white/60 p-6 dark:bg-slate-950/50">
              <SectionBadge>Tags</SectionBadge>
              <SectionSubtitle className="mt-4">
                A quick signal of the role, stack, and working context.
              </SectionSubtitle>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="break-words rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-medium text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="rounded-[2rem] border-white/15 bg-gradient-to-br from-primary/12 via-white/70 to-accent/12 p-6 dark:from-primary/18 dark:via-slate-950/70 dark:to-accent/14">
              <SectionBadge>Apply</SectionBadge>
              <SectionTitle className="mt-4 text-2xl">Ready to move on this opportunity?</SectionTitle>
              <SectionSubtitle className="mt-3">
                Submit your application, save the role for later, and keep the workflow synced with your dashboard.
              </SectionSubtitle>
              <div className="mt-6 flex flex-col gap-3">
                <JobActionButtons
                  jobId={job._id}
                  isSaved={isSaved}
                  hasApplied={hasApplied}
                  onApply={() => setIsApplyModalOpen(true)}
                />
              </div>
            </GlassCard>
          </aside>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <SectionBadge>Related Jobs</SectionBadge>
            <SectionTitle>More roles with a similar signal.</SectionTitle>
            <SectionSubtitle>
              Explore adjacent opportunities from the same company, category, or tag context.
            </SectionSubtitle>
          </div>

          {relatedJobs.length === 0 ? (
            <EmptyState
              title="No related jobs yet"
              description="The backend did not return related opportunities for this role. As more jobs are added, this section will start surfacing similar openings."
              action={
                <PrimaryButton asChild>
                  <Link href="/jobs">Explore all jobs</Link>
                </PrimaryButton>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {relatedJobs.map((relatedJob) => (
                <JobCard
                  key={relatedJob._id}
                  job={relatedJob}
                  onApply={() => router.push(`/jobs/${relatedJob.slug}`)}
                />
              ))}
            </div>
          )}
        </section>
      </Container>

      <ModalShell
        open={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        description="Submit your resume link and a concise cover letter. Duplicate applications are blocked automatically."
        size="sm"
      >
        <form
          onSubmit={applicationForm.handleSubmit(async (values) => {
            if (!user) {
              toast.error("Please log in to submit an application.");
              router.push("/login");
              return;
            }

            await applyMutation.mutateAsync({
              jobId: job._id,
              resumeUrl: values.resumeUrl.trim() || undefined,
              coverLetter: values.coverLetter.trim(),
            });
          })}
          className="grid gap-4"
        >
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Resume URL</span>
            <input className={inputClassName} {...applicationForm.register("resumeUrl")} />
          </label>
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Cover letter</span>
            <textarea
              className={`${inputClassName} min-h-36 py-3`}
              {...applicationForm.register("coverLetter", {
                required: "Cover letter is required.",
                minLength: {
                  value: 20,
                  message: "Please provide a little more context before submitting.",
                },
              })}
            />
            {applicationForm.formState.errors.coverLetter ? (
              <span className="text-xs text-rose-500">
                {applicationForm.formState.errors.coverLetter.message}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Focus on fit, motivation, and one or two measurable outcomes.
              </span>
            )}
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <PrimaryButton type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </PrimaryButton>
            <GradientButton type="submit" disabled={applyMutation.isPending}>
              {applyMutation.isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="size-4" />
                </>
              )}
            </GradientButton>
          </div>
        </form>
      </ModalShell>
    </main>
  );
}

function ContentBlock({
  badge,
  title,
  items,
  prose = false,
}: {
  badge: string;
  title: string;
  items: string[];
  prose?: boolean;
}) {
  return (
    <GlassCard className="rounded-[2rem] border-white/15 bg-white/60 p-6 dark:bg-slate-950/50">
      <SectionBadge>{badge}</SectionBadge>
      <SectionTitle className="mt-4 text-2xl">{title}</SectionTitle>
      {prose ? (
        <SectionSubtitle className="mt-5 max-w-none text-sm leading-7">{items[0]}</SectionSubtitle>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-secondary" />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
