import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-muted via-muted/70 to-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent dark:before:via-white/10",
        className,
      )}
      {...props}
    />
  );
}
