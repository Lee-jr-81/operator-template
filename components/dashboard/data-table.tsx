import type { ReactNode } from "react";
import { dashTh } from "@/lib/dashboard/classes";

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-(--dash-border) bg-(--dash-card)">
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-(--dash-border) bg-(--dash-muted)">
      {children}
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={className ? `${dashTh} ${className}` : dashTh}>{children}</th>
  );
}
