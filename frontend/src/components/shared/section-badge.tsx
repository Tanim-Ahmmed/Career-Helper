import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
