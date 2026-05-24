import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  value,
  description,
  icon,
  className,
}: {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel min-w-0 rounded-3xl border border-border/60 p-5 shadow-glass sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <p className="break-words text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {value}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        {icon ? (
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
