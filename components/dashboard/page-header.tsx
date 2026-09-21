import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  back?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {back}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
            {title}
          </h1>
          {description ? (
            <div className="mt-1.5 text-sm leading-6 text-(--dash-muted-fg)">
              {description}
            </div>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
