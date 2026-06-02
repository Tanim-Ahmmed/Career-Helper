"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminJobFormDialog, type AdminJobFormValues } from "@/components/dashboard/admin-job-form-dialog";
import { DeleteConfirmDialog } from "@/components/dashboard/delete-confirm-dialog";
import { GlassCard } from "@/components/cards/glass-card";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api-error";
import { fetchAdminJobs } from "@/services/dashboard";
import { createJob, deleteJob, fetchAdminJobById, updateJob } from "@/services/jobs";
import type { Job, JobMutationPayload } from "@/types/job";

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  const jobsQuery = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: fetchAdminJobs,
  });
  const editingJobQuery = useQuery({
    queryKey: ["admin-job", editingJobId],
    queryFn: () => fetchAdminJobById(editingJobId!),
    enabled: Boolean(editingJobId),
  });

  const sortedJobs = useMemo(
    () =>
      [...(jobsQuery.data?.jobs ?? [])].sort((left, right) => {
        const statusWeight = { published: 0, draft: 1, closed: 2 } as const;
        return (
          statusWeight[left.status] - statusWeight[right.status] ||
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
      }),
    [jobsQuery.data?.jobs],
  );

  const createJobMutation = useMutation({
    mutationFn: (payload: JobMutationPayload) => createJob(payload),
    onSuccess: async (job) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
      toast.success(getVisibilityToastMessage(job, "created"));
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to create the job right now."));
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<JobMutationPayload> }) =>
      updateJob(id, payload),
    onSuccess: async (job) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-job", editingJobId] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
      toast.success(getVisibilityToastMessage(job, "updated"));
      setEditingJobId(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update the job right now."));
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-jobs"] });
      const previousJobs = queryClient.getQueryData<{ jobs: Job[]; meta: unknown }>(["admin-jobs"]);

      queryClient.setQueryData(["admin-jobs"], (current: { jobs: Job[]; meta: unknown } | undefined) =>
        current
          ? {
              ...current,
              jobs: current.jobs.filter((job) => job._id !== id),
            }
          : current,
      );

      return { previousJobs };
    },
    onError: (error, _id, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(["admin-jobs"], context.previousJobs);
      }
      toast.error(getErrorMessage(error, "Unable to delete the job right now."));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
      toast.success("Job deleted successfully.");
      setDeletingJob(null);
    },
  });

  if (jobsQuery.isLoading) {
    return <DashboardListLoadingShell items={4} />;
  }

  const handleCreate = async (values: AdminJobFormValues) => {
    await createJobMutation.mutateAsync(toJobPayload(values));
  };

  const handleUpdate = async (values: AdminJobFormValues) => {
    if (!editingJobId) {
      return;
    }

    await updateJobMutation.mutateAsync({
      id: editingJobId,
      payload: toJobPayload(values, editingJobQuery.data ?? undefined),
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Manage Jobs</SectionBadge>}
        title="Job pipeline control"
        description="Create, update, and retire roles from one admin workspace while keeping the public jobs experience synchronized."
        action={
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create job
          </Button>
        }
      />

      <div className="grid gap-4">
        {sortedJobs.map((job) => (
          <GlassCard key={job._id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{job.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {job.status}
                </span>
                {job.featured ? (
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Featured
                  </span>
                ) : null}
                <VisibilityBadge job={job} />
              </div>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">{job.shortDescription}</p>

            <div className="grid gap-3 md:grid-cols-4">
              <MetaCard label="Category" value={job.category} />
              <MetaCard label="Applicants" value={String(job.applicantsCount)} />
              <MetaCard label="Views" value={String(job.views)} />
              <MetaCard
                label="Deadline"
                value={new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(job.applicationDeadline))}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-border/60 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingJobId(job._id)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </Button>
              <Button type="button" variant="outline" onClick={() => setDeletingJob(job)}>
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      <AdminJobFormDialog
        open={isCreateOpen}
        mode="create"
        isSubmitting={createJobMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <AdminJobFormDialog
        open={Boolean(editingJobId)}
        mode="edit"
        job={editingJobQuery.data}
        isSubmitting={updateJobMutation.isPending || editingJobQuery.isLoading}
        onClose={() => setEditingJobId(null)}
        onSubmit={handleUpdate}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingJob)}
        title="Delete job"
        description={`Remove "${deletingJob?.title ?? "this job"}" from the platform?`}
        isSubmitting={deleteJobMutation.isPending}
        onClose={() => setDeletingJob(null)}
        onConfirm={() => {
          if (!deletingJob) {
            return;
          }

          void deleteJobMutation.mutateAsync(deletingJob._id);
        }}
      />
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function VisibilityBadge({ job }: { job: Job }) {
  const visibility = getVisibilitySummary(job);

  return (
    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
      {visibility.badge}
    </span>
  );
}

function getVisibilitySummary(job: Pick<Job, "status" | "featured">) {
  if (job.status !== "published") {
    return {
      badge: "Admin only",
      description: "This role is saved as a draft or closed and will not appear on public pages.",
    };
  }

  if (job.featured) {
    return {
      badge: "Jobs + homepage",
      description: "This role is visible on the public jobs page and the homepage featured jobs section.",
    };
  }

  return {
    badge: "Jobs page",
    description: "This role is visible on the public jobs page but not in the homepage featured jobs section.",
  };
}

function getVisibilityToastMessage(job: Pick<Job, "title" | "status" | "featured">, action: "created" | "updated") {
  const visibility = getVisibilitySummary(job);
  return `"${job.title}" ${action}. ${visibility.description}`;
}

function toJobPayload(values: AdminJobFormValues, existingJob?: Job): JobMutationPayload {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    companyLogo: values.companyLogo?.trim() ?? "",
    companyWebsite: values.companyWebsite?.trim() ?? "",
    employmentType: values.employmentType,
    workplaceType: values.workplaceType,
    category: values.category.trim(),
    experienceLevel: values.experienceLevel.trim(),
    salary: {
      min: values.salary.min,
      max: values.salary.max,
      currency: values.salary.currency.trim().toUpperCase(),
      period: values.salary.period,
    },
    location: values.location.trim(),
    skillsRequired: splitLines(values.skillsRequired),
    responsibilities: splitLines(values.responsibilities),
    requirements: splitLines(values.requirements),
    benefits: splitLines(values.benefits ?? ""),
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    tags: splitCommaSeparated(values.tags ?? ""),
    applicantsCount: existingJob?.applicantsCount ?? 0,
    featured: values.featured,
    status: values.status,
    views: existingJob?.views ?? 0,
    applicationDeadline: values.applicationDeadline,
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
