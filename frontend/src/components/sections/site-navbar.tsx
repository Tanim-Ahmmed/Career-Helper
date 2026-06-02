"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileSearch,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  loggedInNavItems,
  publicNavItems,
  resourceMenuItems,
} from "@/constants/navigation";
import { Container } from "@/components/shared/container";
import { GradientButton } from "@/components/shared/gradient-button";
import { PrimaryButton } from "@/components/shared/primary-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

type DropdownKey = "resources" | "profile" | null;

const accountMenuItems = [
  { label: "Dashboard", href: "/user", icon: LayoutDashboard },
  { label: "Applications", href: "/user/applications", icon: BriefcaseBusiness },
  { label: "Resume Analyzer", href: "/user/resume-analyzer", icon: FileSearch },
  { label: "Cover Letters", href: "/user/cover-letters", icon: FileText },
  { label: "Interview Assistant", href: "/user/interview-assistant", icon: MessageSquareQuote },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRootRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const isAuthenticated = Boolean(user);
  const navItems = isAuthenticated ? loggedInNavItems : publicNavItems;

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!navRootRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (key: DropdownKey) => {
    clearCloseTimer();

    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown((current) => (current === key ? null : current));
    }, 140);
  };

  const handleLogout = async () => {
    let logoutFailed = false;

    try {
      await logout();
    } catch (error) {
      logoutFailed = true;
      toast.error(
        getErrorMessage(error, "Signed out on this device, but the server logout request failed."),
      );
    }

    clearSession();
    setOpenDropdown(null);
    setIsMenuOpen(false);
    if (!logoutFailed) {
      toast.success("Logged out successfully.");
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-4">
      <Container className="px-0">
        <div
          ref={navRootRef}
          className="glass-panel relative rounded-[1.75rem] border border-white/20 shadow-glass"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="AI Career Helper home">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg shadow-primary/20">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  AI Career Helper
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Premium career growth toolkit
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} active={isRouteActive(pathname, item.href)}>
                  {item.label}
                </NavLink>
              ))}

              <DesktopDropdown
                label="Resources"
                open={openDropdown === "resources"}
                onOpen={() => {
                  clearCloseTimer();
                  setOpenDropdown("resources");
                }}
                onToggle={() =>
                  setOpenDropdown((current) => (current === "resources" ? null : "resources"))
                }
                onScheduleClose={() => scheduleClose("resources")}
              >
                {resourceMenuItems.map((item) => (
                  <DropdownLink key={item.href} href={item.href}>
                    {item.label}
                  </DropdownLink>
                ))}
              </DesktopDropdown>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <ThemeToggle />

              {isAuthenticated ? (
                <DesktopDropdown
                  label="Account"
                  open={openDropdown === "profile"}
                  onOpen={() => {
                    clearCloseTimer();
                    setOpenDropdown("profile");
                  }}
                  onToggle={() =>
                    setOpenDropdown((current) => (current === "profile" ? null : "profile"))
                  }
                  onScheduleClose={() => scheduleClose("profile")}
                  triggerClassName="gap-2 rounded-full border border-white/20 bg-white/50 px-2.5 py-2 dark:bg-slate-900/50"
                  triggerContent={
                    <>
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCircle2 className="size-5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="break-words text-sm font-semibold text-foreground">{user?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.role === "user" ? "Career Builder" : "Manage Emplyer"}
                        </p>
                      </div>
                    </>
                  }
                >
                  {accountMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <DropdownLink key={item.href} href={item.href}>
                        <span className="inline-flex items-center gap-2">
                          <Icon className="size-4" />
                          {item.label}
                        </span>
                      </DropdownLink>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                  >
                    Logout
                  </button>
                </DesktopDropdown>
              ) : (
                <>
                  <Button asChild variant="ghost" className="rounded-full px-4">
                    <Link href="/login">Login</Link>
                  </Button>
                  <GradientButton asChild>
                    <Link href="/register">Get Started</Link>
                  </GradientButton>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((current) => !current)}
                className="border-white/20 bg-white/50 backdrop-blur-xl hover:bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-900/80"
              >
                {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isMenuOpen ? (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="overflow-hidden border-t border-white/15 lg:hidden"
              >
                <div className="space-y-6 px-4 py-5 sm:px-5">
                  <div className="grid gap-2">
                    {navItems.map((item) => (
                      <MobileNavLink
                        key={item.href}
                        href={item.href}
                        active={isRouteActive(pathname, item.href)}
                      >
                        {item.label}
                      </MobileNavLink>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-white/15 bg-white/50 p-3 dark:bg-slate-900/50">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((current) => (current === "resources" ? null : "resources"))
                      }
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium text-foreground"
                      aria-expanded={openDropdown === "resources"}
                    >
                      <span>Resources</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          openDropdown === "resources" && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openDropdown === "resources" ? (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="mt-2 grid gap-1"
                        >
                          {resourceMenuItems.map((item) => (
                            <MobileNavLink key={item.href} href={item.href}>
                              {item.label}
                            </MobileNavLink>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  {isAuthenticated ? (
                    <div className="rounded-3xl border border-white/15 bg-white/50 p-4 dark:bg-slate-900/50">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserCircle2 className="size-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-foreground">{user?.name}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {user?.role === "recruiter" ? "Manage Emplyer" : "Career Builder"}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {accountMenuItems.map((item) => (
                          <MobileNavLink key={item.href} href={item.href}>
                            {item.label}
                          </MobileNavLink>
                        ))}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="rounded-2xl px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-background/80 hover:text-foreground"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <PrimaryButton asChild>
                        <Link href="/login">Login</Link>
                      </PrimaryButton>
                      <GradientButton asChild>
                        <Link href="/register">Get Started</Link>
                      </GradientButton>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  );
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/60 hover:text-foreground dark:hover:bg-slate-900/60",
        active && "bg-primary/10 text-primary",
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-background/80 hover:text-foreground",
        active && "bg-primary/10 text-primary",
      )}
    >
      {children}
    </Link>
  );
}

function DropdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function DesktopDropdown({
  label,
  open,
  onOpen,
  onToggle,
  onScheduleClose,
  children,
  triggerContent,
  triggerClassName,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onScheduleClose: () => void;
  children: React.ReactNode;
  triggerContent?: React.ReactNode;
  triggerClassName?: string;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onScheduleClose}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/60 hover:text-foreground dark:hover:bg-slate-900/60",
          open && "bg-primary/10 text-primary",
          triggerClassName,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {triggerContent ?? <span>{label}</span>}
        <ChevronDown
          className={cn("ml-2 size-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[220px] max-w-[min(22rem,calc(100vw-2rem))] rounded-[1.5rem] border border-white/20 bg-white/85 p-3 shadow-2xl backdrop-blur-2xl dark:bg-slate-950/85"
            onMouseEnter={onOpen}
            onMouseLeave={onScheduleClose}
          >
            <div className="grid gap-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
