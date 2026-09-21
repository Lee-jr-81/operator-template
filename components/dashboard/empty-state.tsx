import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-(--dash-fg)">{title}</h2>
      <div className="mt-2 space-y-4 text-sm leading-6 text-(--dash-muted-fg)">
        {children}
      </div>
    </Card>
  );
}
