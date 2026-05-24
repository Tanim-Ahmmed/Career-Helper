"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export function ModalShell({
  open,
  title,
  description,
  onClose,
  children,
  size = "md",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "glass-panel max-h-[90vh] w-full overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl",
          size === "sm" && "max-w-xl",
          size === "md" && "max-w-3xl",
          size === "lg" && "max-w-5xl",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-5.5rem)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
