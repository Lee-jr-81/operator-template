"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { recordWhatsAppClick } from "@/server/contact/actions";

export function WhatsAppButton({
  listingId,
  href,
}: {
  listingId: string;
  href: string;
}) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    try {
      await recordWhatsAppClick(listingId);
    } catch {
      // Tracking must never block contact.
    }

    window.location.assign(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
        "bg-slate-900 text-white hover:bg-slate-800",
      )}
    >
      WhatsApp Provider
    </a>
  );
}
