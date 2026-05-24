"use client";

import { GlassCard } from "@/components/cards/glass-card";
import { cn } from "@/lib/utils";

export function AnalyticsChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard className={cn("min-w-0 space-y-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="break-words text-xl font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </GlassCard>
  );
}
