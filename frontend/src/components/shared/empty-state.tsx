import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
  action,
}: {
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/80 p-6 text-center shadow-glass sm:p-8 sm:text-left lg:items-start",
        className,
      )}
    >
      <div className="space-y-2">
        <h3 className="break-words text-xl font-semibold text-foreground">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
