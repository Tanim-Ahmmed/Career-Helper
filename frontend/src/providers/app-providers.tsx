"use client";

import { AppToaster } from "@/components/shared/app-toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
            <AppToaster />
          </SmoothScrollProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
