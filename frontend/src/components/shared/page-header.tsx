import { cn } from "@/lib/utils";

export function PageHeader({
  badge,
  title,
  description,
  action,
  className,
}: {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col gap-5 rounded-[2rem] border border-border/60 px-5 py-6 shadow-glass sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-3">
        {badge}
        <div className="space-y-2">
          <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex w-full shrink-0 items-center lg:w-auto">{action}</div> : null}
    </div>
  );
}
