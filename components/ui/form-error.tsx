import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FormErrorProps = HTMLAttributes<HTMLParagraphElement>;

export function FormError({ className, ...props }: FormErrorProps) {
  return (
    <p
      role="alert"
      className={cn("text-sm text-(--dash-destructive)", className)}
      {...props}
    />
  );
}
