"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { NavIcon } from "@/components/dashboard/nav-icons";
import { DashboardThemeSelector } from "@/components/dashboard/theme-selector";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "overview", match: "exact" as const },
  {
    href: "/dashboard/categories",
    label: TERMINOLOGY.category.plural,
    icon: "categories",
    match: "prefix" as const,
  },
  {
    href: "/dashboard/entities",
    label: TERMINOLOGY.entity.plural,
    icon: "entities",
    match: "prefix" as const,
  },
  {
    href: "/dashboard/listings",
    label: TERMINOLOGY.listing.plural,
    icon: "listings",
    match: "prefix" as const,
  },
  { href: "/dashboard/deals", label: "Deals", icon: "deals", match: "prefix" as const },
  {
    href: "/dashboard/enquiries",
    label: "Enquiries",
    icon: "enquiries",
    match: "prefix" as const,
  },
  {
    href: "/dashboard/articles",
    label: "Articles",
    icon: "articles",
    match: "prefix" as const,
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const isActive =
          item.match === "exact"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-(--dash-sidebar-muted) hover:bg-(--dash-sidebar-hover) hover:text-(--dash-sidebar-fg)",
              isActive && "bg-(--dash-sidebar-active) text-(--brand-soft)",
            )}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function UserIcon() {
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
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function SiteIcon() {
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
      <path d="M7 17 3 12l4-5M3 12h18" />
    </svg>
  );
}

export function DashboardShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navId = useId();

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNavOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavOpen]);

  return (
    <div className="dashboard min-h-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-(--dash-card) focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {isNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setIsNavOpen(false)}
        />
      ) : null}

      <aside
        id={navId}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-62 flex-col border-r border-(--dash-sidebar-border) bg-(--dash-sidebar) p-3 text-(--dash-sidebar-fg) transition-transform duration-150 lg:translate-x-0",
          isNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <p className="mb-4 flex items-center gap-2.5 px-2 py-3">
          <img
            src={BRANDING.logo.onDark}
            alt={BUSINESS.shortName}
            width={140}
            height={28}
            className="h-7 w-auto max-w-42"
          />
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto px-0.5 py-2">
          <NavLinks onNavigate={() => setIsNavOpen(false)} />
        </div>
        <div className="border-t border-(--dash-sidebar-border) px-0.5 pt-2">
          <SignOutButton />
        </div>
      </aside>

      <div className="lg:pl-62">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-(--dash-border) bg-(--dash-card) px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-(--dash-border) text-(--dash-fg) lg:hidden"
            aria-expanded={isNavOpen}
            aria-controls={navId}
            aria-label={isNavOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsNavOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
          <Link
            href="/"
            className="inline-flex h-9 min-w-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-(--dash-muted-fg) hover:bg-(--dash-muted) hover:text-(--brand-primary)"
          >
            <SiteIcon />
            <span className="truncate">Return to site</span>
          </Link>
          <div className="ml-auto flex min-w-0 items-center gap-3">
            <DashboardThemeSelector />
            <p className="flex min-w-0 max-w-56 items-center gap-2 text-[13px] text-(--dash-muted-fg)">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-(--dash-border) bg-(--dash-muted) text-(--dash-fg)">
                <UserIcon />
              </span>
              <span className="min-w-0 truncate">{email}</span>
            </p>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
