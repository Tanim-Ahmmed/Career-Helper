"use client";

import { useQuery } from "@tanstack/react-query";

import { GlassCard } from "@/components/cards/glass-card";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchAdminUsers } from "@/services/dashboard";

export default function AdminUsersPage() {
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
  });

  if (usersQuery.isLoading) {
    return (
      <DashboardListLoadingShell items={6} columnsClassName="grid gap-4 md:grid-cols-2 xl:grid-cols-3" />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Manage Users</SectionBadge>}
        title="User directory"
        description="Review member roles, profiles, and AI usage counts from the admin workspace."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {usersQuery.data?.map((user) => (
          <GlassCard key={user.id} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {user.profession || "No profession added yet"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Meta label="AI Usage" value={String(user.aiUsageCount)} />
              <Meta label="Skills" value={String(user.skills?.length ?? 0)} />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
