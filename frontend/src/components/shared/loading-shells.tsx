import { GlassCard } from "@/components/cards/glass-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="glass-panel rounded-[2rem] border border-border/60 px-5 py-6 shadow-glass sm:px-8 sm:py-8">
      <div className="space-y-4">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-10 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-3xl" />
        <Skeleton className="h-5 w-5/6 max-w-2xl" />
      </div>
    </div>
  );
}

export function PublicPageLoadingShell({
  showSidebar = false,
  cardCount = 4,
}: {
  showSidebar?: boolean;
  cardCount?: number;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
      <Container className="space-y-8">
        <PageHeaderSkeleton />
        <div className={`grid gap-6 ${showSidebar ? "xl:grid-cols-[300px_minmax(0,1fr)]" : ""}`}>
          {showSidebar ? (
            <GlassCard className="space-y-4">
              <Skeleton className="h-12 w-full" />
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </GlassCard>
          ) : null}

          <div className="space-y-6">
            <div className="glass-panel rounded-[1.5rem] border border-border/60 px-4 py-4 shadow-glass">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-3 h-4 w-72 max-w-full" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: cardCount }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export function JobDetailsLoadingShell() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
      <Container className="space-y-8">
        <PageHeaderSkeleton />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <SkeletonCard className="md:col-span-2" />
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

export function DashboardContentLoadingShell({
  cards = 3,
  blocks = 2,
}: {
  cards?: number;
  blocks?: number;
}) {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <SkeletonCard key={index} className="h-full" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: blocks }).map((_, index) => (
          <GlassCard key={index} className="space-y-4">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-48 w-full rounded-[1.5rem]" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export function DashboardListLoadingShell({
  items = 3,
  columnsClassName = "grid gap-4",
}: {
  items?: number;
  columnsClassName?: string;
}) {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      <div className={columnsClassName}>
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonCard key={index} className="h-full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardFormLoadingShell() {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      <GlassCard className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className={`w-full ${index === 1 || index === 3 ? "h-32" : "h-12"}`} />
          </div>
        ))}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </GlassCard>
    </div>
  );
}
