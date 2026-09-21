import { describe, expect, it } from "vitest";
import {
  EMPTY_MAP_VIEW,
  SINGLE_MARKER_ZOOM,
  getMapCamera,
  hasUsableCoordinates,
  toListingMapMarkers,
  type ListingMapMarkerInput,
} from "@/server/listings/map-markers";

const sampleLocation: ListingMapMarkerInput = {
  listingId: "listing-1",
  slug: "sample-listing",
  title: "Sample Listing",
  status: "active",
  entityName: "Sample Entity",
  locationLabel: "Example Town, Example County",
  latitude: 52.45,
  longitude: -2.14,
};

const secondLocation: ListingMapMarkerInput = {
  listingId: "listing-2",
  slug: "second-sample-listing",
  title: "Second Sample Listing",
  status: "active",
  entityName: "Sample Entity B",
  locationLabel: "Example Town B, Example County",
  latitude: 52.51,
  longitude: -2.08,
};

describe("hasUsableCoordinates", () => {
  it("accepts finite in-range pairs", () => {
    expect(hasUsableCoordinates(52.45, -2.14)).toBe(true);
  });

  it("accepts numeric strings from the database", () => {
    expect(hasUsableCoordinates("52.45", "-2.14")).toBe(true);
    expect(
      toListingMapMarkers([
        {
          ...sampleLocation,
          latitude: "52.45",
          longitude: "-2.14",
        },
      ]),
    ).toEqual([
      {
        listingId: "listing-1",
        slug: "sample-listing",
        title: "Sample Listing",
        entityName: "Sample Entity",
        locationLabel: "Example Town, Example County",
        latitude: 52.45,
        longitude: -2.14,
      },
    ]);
  });

  it("rejects missing or invalid values", () => {
    expect(hasUsableCoordinates(null, -2.14)).toBe(false);
    expect(hasUsableCoordinates(52.45, null)).toBe(false);
    expect(hasUsableCoordinates(Number.NaN, -2.14)).toBe(false);
    expect(hasUsableCoordinates(91, -2.14)).toBe(false);
    expect(hasUsableCoordinates(52.45, -181)).toBe(false);
  });
});

describe("toListingMapMarkers", () => {
  it("creates a marker from an active Listing with coordinates", () => {
    expect(toListingMapMarkers([sampleLocation])).toEqual([
      {
        listingId: "listing-1",
        slug: "sample-listing",
        title: "Sample Listing",
        entityName: "Sample Entity",
        locationLabel: "Example Town, Example County",
        latitude: 52.45,
        longitude: -2.14,
      },
    ]);
  });

  it("excludes inactive Listings even when coordinates exist", () => {
    expect(
      toListingMapMarkers([{ ...sampleLocation, status: "inactive" }]),
    ).toEqual([]);
  });

  it("excludes Listings with missing or invalid coordinates", () => {
    expect(
      toListingMapMarkers([
        { ...sampleLocation, latitude: null, longitude: -2.14 },
        { ...secondLocation, latitude: 52.51, longitude: null },
        { ...sampleLocation, listingId: "bad", latitude: 91, longitude: 0 },
      ]),
    ).toEqual([]);
  });

  it("keeps only public marker fields", () => {
    const marker = toListingMapMarkers([sampleLocation])[0];

    expect(Object.keys(marker).sort()).toEqual(
      [
        "entityName",
        "latitude",
        "listingId",
        "locationLabel",
        "longitude",
        "slug",
        "title",
      ].sort(),
    );
    expect(marker).not.toHaveProperty("operator_notes");
    expect(marker).not.toHaveProperty("contact_name");
    expect(marker).not.toHaveProperty("address_line_1");
  });
});

describe("getMapCamera", () => {
  it("uses the empty-map view when there are no markers", () => {
    expect(getMapCamera([])).toEqual({
      kind: "empty",
      center: EMPTY_MAP_VIEW.center,
      zoom: EMPTY_MAP_VIEW.zoom,
    });
  });

  it("centres a single marker at a sensible zoom", () => {
    expect(
      getMapCamera([{ latitude: 52.45, longitude: -2.14 }]),
    ).toEqual({
      kind: "single",
      center: [-2.14, 52.45],
      zoom: SINGLE_MARKER_ZOOM,
    });
  });

  it("fits bounds around distinct markers", () => {
    expect(
      getMapCamera([
        { latitude: 52.45, longitude: -2.14 },
        { latitude: 52.51, longitude: -2.08 },
      ]),
    ).toEqual({
      kind: "bounds",
      bounds: [
        [-2.14, 52.45],
        [-2.08, 52.51],
      ],
    });
  });

  it("treats stacked markers on the same point as a single view", () => {
    expect(
      getMapCamera([
        { latitude: 52.45, longitude: -2.14 },
        { latitude: 52.45, longitude: -2.14 },
      ]),
    ).toEqual({
      kind: "single",
      center: [-2.14, 52.45],
      zoom: SINGLE_MARKER_ZOOM,
    });
  });
});
