import type { PublicLocation } from "@/server/locations/types";

export function formatConciseLocation(
  location: Pick<PublicLocation, "town_city" | "county_region"> | null | undefined,
) {
  if (!location) {
    return null;
  }

  const parts = [location.town_city, location.county_region]
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}
