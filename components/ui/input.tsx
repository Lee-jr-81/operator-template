import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "block w-full min-h-10.5 rounded-lg border border-(--dash-border) bg-(--dash-input) px-3 py-2 text-sm text-(--dash-fg) placeholder:text-(--dash-subtle-fg)",
        "disabled:cursor-not-allowed disabled:bg-(--dash-muted) disabled:text-(--dash-muted-fg)",
        className,
      )}
      {...props}
    />
  );
}
