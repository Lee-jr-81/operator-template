import { cn } from "@/lib/cn";

export function statusBannerClass(isError: boolean) {
  return cn(
    "rounded-[8px] border px-3 py-2 text-sm",
    isError
      ? "border-(--dash-destructive)/30 bg-(--dash-destructive-bg) text-(--dash-destructive)"
      : "border-(--dash-border) bg-(--dash-card) text-(--dash-fg)",
  );
}
