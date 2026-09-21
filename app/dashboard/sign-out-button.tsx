"use client";

import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-(--dash-sidebar-muted) hover:bg-(--dash-sidebar-hover) hover:text-(--dash-sidebar-fg)"
      >
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </svg>
        Sign out
      </button>
    </form>
  );
}
