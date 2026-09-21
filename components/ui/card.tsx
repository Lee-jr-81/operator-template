import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-(--dash-border) bg-(--dash-card) p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
