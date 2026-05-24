"use client";

import { AlertTriangle } from "lucide-react";

import { ModalShell } from "@/components/shared/modal-shell";
import { Button } from "@/components/ui/button";

export function DeleteConfirmDialog({
  open,
  title,
  description,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-[1.6rem] border border-rose-300/30 bg-rose-500/10 p-4 text-rose-600 dark:border-rose-400/20 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-6">
            This action cannot be undone. The job will disappear from admin management and public workflows immediately.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Deleting..." : "Delete job"}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
