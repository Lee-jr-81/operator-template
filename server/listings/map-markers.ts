import { parseStoredCoordinate } from "@/server/locations/coordinates";
import { isPubliclyVisibleListing } from "@/server/listings/status";
import type { ListingStatus } from "@/server/listings/status";

export type ListingMapMarker = {
  listingId: string;
  slug: string;
  title: string;
  entityName: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
};

export type ListingMapMarkerInput = {
  listingId: string;
  slug: string;
  title: string;
  status: ListingStatus;
  entityName: string;
  locationLabel: string | null;
  latitude: unknown;
  longitude: unknown;
};

export type MapCamera =
  | { kind: "empty"; center: [number, number]; zoom: number }
  | { kind: "single"; center: [number, number]; zoom: number }
  | {
      kind: "bounds";
      bounds: [[number, number], [number, number]];
    };

// [longitude, latitude] — MapLibre order. Set a country-appropriate empty
// view when cloning. The template default is a world-scale overview.
export const EMPTY_MAP_VIEW = {
  center: [0, 20] as [number, number],
  zoom: 1.5,
};

export const SINGLE_MARKER_ZOOM = 12;

export function readUsableCoordinates(
  latitude: unknown,
  longitude: unknown,
): { latitude: number; longitude: number } | null {
  const parsedLatitude = parseStoredCoordinate(latitude);
  const parsedLongitude = parseStoredCoordinate(longitude);

  if (
    parsedLatitude == null ||
    parsedLongitude == null ||
    parsedLatitude < -90 ||
    parsedLatitude > 90 ||
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    return null;
  }

  return { latitude: parsedLatitude, longitude: parsedLongitude };
}

export function hasUsableCoordinates(latitude: unknown, longitude: unknown) {
  return readUsableCoordinates(latitude, longitude) !== null;
}

export function toListingMapMarkers(
  listings: ListingMapMarkerInput[],
): ListingMapMarker[] {
  const markers: ListingMapMarker[] = [];

  for (const listing of listings) {
    if (!isPubliclyVisibleListing(listing.status)) {
      continue;
    }

    const coordinates = readUsableCoordinates(
      listing.latitude,
      listing.longitude,
    );

    if (!coordinates) {
      continue;
    }

    markers.push({
      listingId: listing.listingId,
      slug: listing.slug,
      title: listing.title,
      entityName: listing.entityName,
      locationLabel: listing.locationLabel?.trim() ?? "",
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }

  return markers;
}

export function getMapCamera(
  markers: Array<Pick<ListingMapMarker, "latitude" | "longitude">>,
): MapCamera {
  if (markers.length === 0) {
    return {
      kind: "empty",
      center: EMPTY_MAP_VIEW.center,
      zoom: EMPTY_MAP_VIEW.zoom,
    };
  }

  const first = markers[0];
  const allSamePoint = markers.every(
    (marker) =>
      marker.latitude === first.latitude &&
      marker.longitude === first.longitude,
  );

  if (markers.length === 1 || allSamePoint) {
    return {
      kind: "single",
      center: [first.longitude, first.latitude],
      zoom: SINGLE_MARKER_ZOOM,
    };
  }

  let minLng = first.longitude;
  let minLat = first.latitude;
  let maxLng = first.longitude;
  let maxLat = first.latitude;

  for (const marker of markers) {
    minLng = Math.min(minLng, marker.longitude);
    minLat = Math.min(minLat, marker.latitude);
    maxLng = Math.max(maxLng, marker.longitude);
    maxLat = Math.max(maxLat, marker.latitude);
  }

  return {
    kind: "bounds",
    bounds: [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
  };
}
