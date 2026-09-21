import Link from "next/link";
import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: number;
  hint?: string;
  href?: string;
}) {
  const className =
    "rounded-[10px] border border-(--dash-border) bg-(--dash-card) p-5";
  const inner = (
    <>
      <p className="text-[13px] font-medium text-(--dash-muted-fg)">{label}</p>
      <p className="mt-2 text-[32px] font-bold tracking-tight text-(--dash-fg)">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-sm text-(--dash-muted-fg)">{hint}</p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          className,
          "block transition-colors hover:border-(--dash-fg)/25",
        )}
      >
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
