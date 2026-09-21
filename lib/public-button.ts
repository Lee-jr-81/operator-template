import { cn } from "@/lib/cn";

const shared =
  "inline-flex h-12 items-center justify-center rounded-[var(--radius-button)] px-5 text-sm font-semibold transition duration-200";

export const publicButtonClass = {
  primary: cn(
    shared,
    "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]",
  ),
  secondary: cn(
    shared,
    "border border-[var(--public-border)] bg-[var(--public-surface)] text-[var(--public-text)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
  ),
  heroPrimary: cn(
    shared,
    "bg-white text-[var(--brand-primary)] hover:bg-white/90",
  ),
  onBrand: cn(
    shared,
    "bg-white text-[var(--brand-primary)] hover:bg-[var(--public-bg)]",
  ),
};
