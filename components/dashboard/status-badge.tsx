import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatusBadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "info";

const tones: Record<StatusBadgeTone, string> = {
  success: "bg-(--dash-success-bg) text-(--dash-success)",
  warning: "bg-(--dash-warning-bg) text-(--dash-warning)",
  danger: "bg-(--dash-destructive-bg) text-(--dash-destructive)",
  muted: "bg-(--dash-muted) text-(--dash-muted-fg)",
  info: "bg-(--dash-info-bg) text-(--dash-info)",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: StatusBadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
