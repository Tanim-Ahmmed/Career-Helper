"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api-error";
import { saveJob, unsaveJob } from "@/services/jobs";
import { useAuthStore } from "@/store/auth-store";

export function JobActionButtons({
  jobId,
  variant = "stacked",
  hasApplied = false,
  isSaved = false,
  onApply,
}: {
  jobId: string;
  variant?: "stacked" | "inline";
  hasApplied?: boolean;
  isSaved?: boolean;
  onApply?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        return unsaveJob(jobId);
      }

      return saveJob(jobId);
    },
    onSuccess: async (updatedUser) => {
      updateUser(updatedUser);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      toast.success(isSaved ? "Job removed from saved list." : "Job saved successfully.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update saved jobs right now."));
    },
  });

  const requireUser = () => {
    if (!user) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return false;
    }

    if (user.role !== "user") {
      toast.error("This action is available for user accounts only.");
      return false;
    }

    return true;
  };

  return (
    <div
      className={
        variant === "inline"
          ? "flex w-full flex-col gap-3"
          : "flex w-full flex-col gap-3"
      }
    >
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={hasApplied}
        onClick={() => {
          if (!requireUser()) {
            return;
          }

          onApply?.();
        }}
      >
        {hasApplied ? (
          <>
            <CheckCircle2 className="mr-2 size-4" />
            Already Applied
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Apply for this job
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={saveMutation.isPending}
        onClick={() => {
          if (!requireUser()) {
            return;
          }

          void saveMutation.mutateAsync();
        }}
      >
        {saveMutation.isPending ? (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        ) : (
          <Bookmark className="mr-2 size-4" />
        )}
        {isSaved ? "Saved" : "Save for later"}
      </Button>

      {!user ? (
        <Link href="/login" className="text-sm font-medium text-primary">
          Sign in to apply and save jobs
        </Link>
      ) : null}
      {user?.role === "admin" ? (
        <p className="text-sm text-muted-foreground">
          Admin accounts can manage jobs from the dashboard, but cannot apply to them.
        </p>
      ) : null}
    </div>
  );
}
