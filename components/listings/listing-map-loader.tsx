"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import type { ListingMapMarker } from "@/server/listings/map-markers";

const ListingMap = dynamic(
  () => import("./listing-map").then((module) => module.ListingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-80 items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading map…
      </div>
    ),
  },
);

export function ListingMapLoader({
  markers,
  ariaLabel,
  className,
}: {
  markers: ListingMapMarker[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200",
        className,
      )}
    >
      <ListingMap
        markers={markers}
        ariaLabel={ariaLabel}
        className="h-full"
      />
    </div>
  );
}
