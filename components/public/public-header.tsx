"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Container } from "@/components/ui/container";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/listings", label: TERMINOLOGY.listing.plural },
  { href: "/articles", label: "Articles" },
  { href: "/login", label: "Operator login" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="relative sticky top-0 z-50 border-b border-(--public-border) bg-[color-mix(in_srgb,var(--public-surface)_96%,transparent)] backdrop-blur-[10px]">
      <Container className="flex h-19 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src={BRANDING.logo.primary}
            alt={BUSINESS.name}
            width={160}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Public" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-(--public-text-muted) transition duration-200 hover:text-(--brand-primary)"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-(--radius-button) text-(--public-text) md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </Container>
      <div
        id={menuId}
        className={cn(
          "absolute inset-x-0 top-full border-b border-(--public-border) bg-(--public-surface) md:hidden",
          "origin-top transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0 motion-reduce:translate-y-0",
        )}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <nav aria-label="Mobile" className="flex flex-col px-4 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-12 items-center text-base font-medium text-(--public-text)"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
