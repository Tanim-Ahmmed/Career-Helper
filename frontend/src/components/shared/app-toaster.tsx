"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      expand
      position="top-right"
      richColors
      toastOptions={{
        className: "border border-white/20 bg-background/95 text-foreground shadow-2xl",
      }}
    />
  );
}
