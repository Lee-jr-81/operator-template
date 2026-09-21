import { describe, expect, it } from "vitest";
import type { ListingDetailsInput } from "@/lib/listings/vertical";
import {
  buildDuplicatedListing,
  duplicatedListingTitle,
  listingSlugAttempt,
} from "@/server/listings/duplicate";
import type { Listing } from "@/server/listings/types";

const source: Listing = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "Sample Listing",
  slug: "sample-listing",
  summary: "A short public summary of this listing.",
  description: "A longer operator-created description.",
  category_id: "22222222-2222-2222-2222-222222222222",
  entity_id: "33333333-3333-3333-3333-333333333333",
  status: "active",
  is_featured: true,
  seo_title: "Sample Listings",
  seo_description: "Friendly group walks.",
  created_at: "2026-08-16T12:00:00.000Z",
  updated_at: "2026-08-16T12:00:00.000Z",
};

const details: ListingDetailsInput = {
  service_format: "Standard format",
  price_text: "From 50",
  duration_text: "60 minutes",
};

describe("buildDuplicatedListing", () => {
  it("copies reusable fields, resets identity, and starts inactive", () => {
    const result = buildDuplicatedListing(source, details);

    expect(result.listing).toEqual({
      title: "Copy of Sample Listing",
      slug: "copy-of-sample-listing",
      summary: source.summary,
      description: source.description,
      category_id: source.category_id,
      entity_id: source.entity_id,
      status: "inactive",
      is_featured: false,
      seo_title: source.seo_title,
      seo_description: source.seo_description,
    });
    expect(result.details).toEqual(details);
    expect(result.listing).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("media");
  });

  it("does not mutate the source Listing", () => {
    const original = { ...source };
    buildDuplicatedListing(source, details);
    expect(source).toEqual(original);
  });
});

describe("duplicatedListingTitle", () => {
  it("prefixes Copy of", () => {
    expect(duplicatedListingTitle("Sample Listing B")).toBe(
      "Copy of Sample Listing B",
    );
  });
});

describe("listingSlugAttempt", () => {
  it("keeps the base slug on the first attempt", () => {
    expect(listingSlugAttempt("copy-of-walk", 1)).toBe("copy-of-walk");
  });

  it("appends a number when the slug is already taken", () => {
    expect(listingSlugAttempt("copy-of-walk", 2)).toBe("copy-of-walk-2");
  });
});
