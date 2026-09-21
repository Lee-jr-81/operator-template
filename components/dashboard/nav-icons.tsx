import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </svg>
  );
}

export function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "overview":
      return (
        <Icon>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </Icon>
      );
    case "categories":
      return (
        <Icon>
          <path d="M3 7a1 1 0 0 1 1-1h6l2 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
        </Icon>
      );
    case "entities":
      return (
        <Icon>
          <path d="M4 20V7l8-4 8 4v13" />
          <path d="M9 20v-6h6v6" />
          <path d="M9 10h.01M15 10h.01" />
        </Icon>
      );
    case "listings":
      return (
        <Icon>
          <path d="M12 3 4 7v10l8 4 8-4V7Z" />
          <path d="m4 7 8 4 8-4M12 11v10" />
        </Icon>
      );
    case "deals":
      return (
        <Icon>
          <path d="M20.59 13.41 11 3H3v8l9.59 9.59a2 2 0 0 0 2.82 0l5.18-5.18a2 2 0 0 0 0-2.82Z" />
          <circle cx="7.5" cy="7.5" r="1.25" />
        </Icon>
      );
    case "enquiries":
      return (
        <Icon>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </Icon>
      );
    case "articles":
      return (
        <Icon>
          <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8Z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </Icon>
      );
    default:
      return null;
  }
}
