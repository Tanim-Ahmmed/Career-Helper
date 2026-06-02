"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  Home,
  MessageSquareQuote,
  LogOut,
  Menu,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Users2,
  Bookmark,
  FilePlus2,
  Bell,
  BellRing,
  Building2,
  PlusCircle,
  Users,
  Star,
  CalendarDays,
  CreditCard,
  FolderTree,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { GradientButton } from "@/components/shared/gradient-button";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

const userNavigation = [
  { href: "/user", label: "Overview", icon: Home },
  { href: "/user/profile-settings", label: "Profile Settings", icon: UserCircle2 },

  { href: "/user/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { href: "/user/applications", label: "My Applications", icon: FileText },

  { href: "/user/resume-builder", label: "Resume Builder", icon: FilePlus2 },
  { href: "/user/cover-letters", label: "Cover Letters", icon: FileText },
  
  { href: "/user/interview-assistant", label: "Interview Assistant", icon: MessageSquareQuote },
  { href: "/user/job-alerts", label: "Job Alerts", icon: Bell },
  
  { href: "/user/notifications", label: "Notifications", icon: BellRing },
  { href: "/user/ai-history", label: "AI History", icon: BarChart3 },
];

const recruiterNavigation = [
  { href: "/recruiter", label: "Dashboard", icon: Home },
  { href: "/recruiter/profile-settings", label: "Profile Settings", icon: Building2 },
  { href: "/recruiter/jobs", label: "Manage Jobs", icon: BriefcaseBusiness },
  { href: "/recruiter/applications", label: "Applications", icon: FileText },
  
  // { href: "/recruiter/candidates", label: "Candidates", icon: Users },
  { href: "/recruiter/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },

  { href: "/recruiter/shortlisted", label: "Shortlisted", icon: Star },

  { href: "/recruiter/interviews", label: "Interviews", icon: CalendarDays },

  { href: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },

  { href: "/recruiter/subscription", label: "Subscription", icon: CreditCard },

  { href: "/recruiter/settings", label: "Settings", icon: Settings },
];

const adminNavigation = [
  { href: "/admin", label: "Analytics", icon: ShieldCheck },

  { href: "/admin/users", label: "Users", icon: Users2 },
  { href: "/admin/recruiters", label: "Recruiters", icon: Building2 },

  { href: "/admin/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/admin/applications", label: "Applications", icon: FileText },

  { href: "/admin/blogs", label: "Blogs", icon: BookOpenText },

  { href: "/admin/categories", label: "Categories", icon: FolderTree },

  { href: "/admin/skills", label: "Skills", icon: BadgeCheck },

  { href: "/admin/reports", label: "Reports", icon: BarChart3 },

  { href: "/admin/payments", label: "Payments", icon: CreditCard },

  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const publicQuickLinks = [
  { href: "/", label: "Back to Home", icon: ArrowLeft },
  { href: "/jobs", label: "Browse Jobs", icon: BriefcaseBusiness },
  { href: "/companies", label: "Companies", icon: PanelsTopLeft },
  { href: "/blogs", label: "Blogs", icon: BookOpenText },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (!hydrated || !user) {
      return;
    }

    if (pathname.startsWith("/admin") && user.role !== "admin") {
      router.replace("/");
    }

    if (pathname.startsWith("/recruiter") && user.role !== "recruiter") {
      router.replace("/");
    }

    if (pathname.startsWith("/user") && user.role !== "user") {
      router.replace("/");
    }
  }, [hydrated, pathname, router, user]);

  if (!hydrated) {
    return (
      <main className="min-h-screen px-4 py-20">
        <Container className="max-w-6xl">
          <div className="glass-panel rounded-[2rem] border border-border/60 p-10 shadow-glass">
            <p className="text-sm text-muted-foreground">Preparing your dashboard...</p>
          </div>
        </Container>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-4 py-20">
        <Container className="max-w-5xl">
          <EmptyState
            title="Authentication required"
            description="Sign in to access dashboard layouts, saved jobs, and account tools."
            action={
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            }
          />
        </Container>
      </main>
    );
  }

  const navigation = user.role === "admin" ? adminNavigation : user.role === "user" ? userNavigation : recruiterNavigation;

  return (
    <main className="min-h-screen overflow-x-hidden px-3 py-3 sm:px-4">
      <Container className="max-w-[1600px] px-0">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="glass-panel rounded-[2rem] border border-white/20 p-5 shadow-glass">
            <div className="flex items-center gap-3 rounded-[1.6rem] border border-white/15 bg-background/60 p-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg shadow-primary/20">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {user.role === "admin" ? "Admin Console" : "Career Hub"}
                </p>
                <p className="break-words text-base font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.userProfile?.profession || (user.role === "admin" ? "Platform Admin" : "Career Builder")}
                </p>
              </div>
            </div>

            <nav className="mt-6 grid gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/60 hover:text-foreground dark:hover:bg-slate-900/70",
                      isActive && "bg-primary/12 text-primary shadow-sm",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[1.6rem] border border-white/15 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Build progress
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Your dashboard now includes live AI writing and interview prep tools.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Resume analysis, cover letters, and interview coaching all run through the protected Gemini workflow.
              </p>
            </div>

            <div className="mt-4 space-y-3 rounded-[1.6rem] border border-white/15 bg-background/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Public routes
              </p>
              <div className="grid gap-2">
                {publicQuickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/60 hover:text-foreground dark:hover:bg-slate-900/70"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="glass-panel mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/20 px-5 py-4 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary xl:hidden">
                  <Menu className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user.role === "admin" ? "Platform operations" : "Career momentum"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GradientButton asChild className="hidden xl:inline-flex">
                  <Link href="/">Back to Home</Link>
                </GradientButton>
                <ThemeToggle />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    let logoutFailed = false;

                    try {
                      await logout();
                    } catch (error) {
                      logoutFailed = true;
                      toast.error(
                        getErrorMessage(
                          error,
                          "Signed out on this device, but the server logout request failed.",
                        ),
                      );
                    }

                    clearSession();
                    if (!logoutFailed) {
                      toast.success("Logged out successfully.");
                    }
                    router.push("/login");
                    router.refresh();
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="space-y-4">{children}</div>
          </section>
        </div>
      </Container>
    </main>
  );
}
