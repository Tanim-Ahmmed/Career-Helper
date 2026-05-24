import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm",
        className,
      )}
    >
      <div className="space-y-4">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
