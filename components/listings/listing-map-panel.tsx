import { ListingMapLoader } from "@/components/listings/listing-map-loader";
import type { ListingMapMarker } from "@/server/listings/map-markers";

export function ListingMapPanel({
  markers,
  compact = false,
}: {
  markers: ListingMapMarker[];
  compact?: boolean;
}) {
  const heightClass = compact ? "h-80" : "h-[28rem]";

  if (markers.length === 0) {
    return (
      <div
        className={`flex ${heightClass} flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-8`}
      >
        <p className="font-medium text-slate-900">No mapped locations yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Listings without coordinates are still shown in the results.
        </p>
      </div>
    );
  }

  return (
    <ListingMapLoader
      markers={markers}
      ariaLabel={compact ? "Listing location" : "Listing locations"}
      className={heightClass}
    />
  );
}
