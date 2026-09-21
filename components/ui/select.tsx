import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "block w-full min-h-10.5 rounded-lg border border-(--dash-border) bg-(--dash-input) px-3 py-2 text-sm text-(--dash-fg)",
        "disabled:cursor-not-allowed disabled:bg-(--dash-muted) disabled:text-(--dash-muted-fg)",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
