"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border-white/20 bg-white/50 backdrop-blur-xl hover:bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-900/80"
    >
      {isDark ? (
        <SunMedium className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}