import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl border border-border/60 p-6 shadow-glass",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
