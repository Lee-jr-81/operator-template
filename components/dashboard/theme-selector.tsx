"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  getDashboardThemeServerSnapshot,
  getDashboardThemeSnapshot,
  setDashboardTheme,
  subscribeDashboardTheme,
} from "@/lib/dashboard/theme-store";

function SunIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z" />
    </svg>
  );
}

export function DashboardThemeSelector() {
  const theme = useSyncExternalStore(
    subscribeDashboardTheme,
    getDashboardThemeSnapshot,
    getDashboardThemeServerSnapshot,
  );

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex rounded-lg border border-(--dash-border) p-0.5"
    >
      <button
        type="button"
        aria-pressed={theme === "light"}
        aria-label="Light theme"
        onClick={() => setDashboardTheme("light")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-(--dash-muted-fg) hover:text-(--dash-fg)",
          theme === "light" && "bg-(--dash-muted) text-(--dash-fg)",
        )}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        aria-label="Dark theme"
        onClick={() => setDashboardTheme("dark")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-(--dash-muted-fg) hover:text-(--dash-fg)",
          theme === "dark" && "bg-(--dash-muted) text-(--dash-fg)",
        )}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
