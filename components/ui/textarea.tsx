import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "block min-h-28 w-full rounded-lg border border-(--dash-border) bg-(--dash-input) px-3 py-2 text-sm text-(--dash-fg) placeholder:text-(--dash-subtle-fg)",
        "disabled:cursor-not-allowed disabled:bg-(--dash-muted) disabled:text-(--dash-muted-fg)",
        className,
      )}
      {...props}
    />
  );
}
