import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const shared =
  "inline-flex h-[42px] items-center justify-center rounded-[8px] px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const buttonClass: Record<ButtonVariant, string> = {
  primary: cn(
    shared,
    "bg-(--dash-primary) text-(--dash-primary-fg) hover:opacity-90",
  ),
  secondary: cn(
    shared,
    "border border-(--dash-border) bg-(--dash-card) text-(--dash-fg) hover:bg-(--dash-muted)",
  ),
  ghost: cn(shared, "text-(--dash-muted-fg) hover:bg-(--dash-muted) hover:text-(--dash-fg)"),
  danger: cn(
    shared,
    "bg-(--dash-destructive) text-(--dash-destructive-fg) hover:opacity-90",
  ),
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClass[variant], className)}
      {...props}
    />
  );
}
