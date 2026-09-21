import { describe, expect, it } from "vitest";
import {
  isDuplicateArticleListingError,
  listingMatchesRelatedSearch,
  neighborForRelatedListingMove,
  nextRelatedListingSortOrder,
  publicRelatedListingIds,
} from "@/lib/articles/related-listings";

describe("nextRelatedListingSortOrder", () => {
  it("starts at 0 and appends after the current max", () => {
    expect(nextRelatedListingSortOrder([])).toBe(0);
    expect(
      nextRelatedListingSortOrder([{ sort_order: 0 }, { sort_order: 2 }]),
    ).toBe(3);
  });
});

describe("neighborForRelatedListingMove", () => {
  const items = [
    { listing_id: "a", sort_order: 0 },
    { listing_id: "b", sort_order: 1 },
    { listing_id: "c", sort_order: 2 },
  ];

  it("swaps with the neighbor when moving up or down", () => {
    expect(neighborForRelatedListingMove(items, "b", "up")).toEqual({
      current: { listing_id: "b", sort_order: 1 },
      neighbor: { listing_id: "a", sort_order: 0 },
    });
    expect(neighborForRelatedListingMove(items, "b", "down")?.neighbor.listing_id).toBe(
      "c",
    );
  });

  it("returns null at the ends or for an unknown Listing", () => {
    expect(neighborForRelatedListingMove(items, "a", "up")).toBeNull();
    expect(neighborForRelatedListingMove(items, "c", "down")).toBeNull();
    expect(neighborForRelatedListingMove(items, "missing", "up")).toBeNull();
  });
});

describe("publicRelatedListingIds", () => {
  it("keeps editorial order and drops non-public Listings", () => {
    expect(
      publicRelatedListingIds(
        [
          { listing_id: "inactive", sort_order: 0 },
          { listing_id: "second", sort_order: 2 },
          { listing_id: "first", sort_order: 1 },
        ],
        [
          { id: "inactive", status: "inactive" },
          { id: "first", status: "active" },
          { id: "second", status: "active" },
        ],
      ),
    ).toEqual(["first", "second"]);
  });

  it("does not remove the relationship when a Listing is hidden", () => {
    const relations = [
      { listing_id: "hidden", sort_order: 0 },
      { listing_id: "visible", sort_order: 1 },
    ];

    expect(
      publicRelatedListingIds(relations, [
        { id: "hidden", status: "inactive" },
        { id: "visible", status: "active" },
      ]),
    ).toEqual(["visible"]);
    expect(relations).toHaveLength(2);
  });

  it("returns nothing when no related Listing is public", () => {
    expect(
      publicRelatedListingIds(
        [{ listing_id: "draft-like", sort_order: 0 }],
        [{ id: "draft-like", status: "inactive" }],
      ),
    ).toEqual([]);
  });
});

describe("listingMatchesRelatedSearch", () => {
  const listing = {
    title: "Sample Listing",
    entity_name: "Sample Entity",
    category_name: "Sample Category",
  };

  it("matches title, Entity, or Category", () => {
    expect(listingMatchesRelatedSearch(listing, "listing")).toBe(true);
    expect(listingMatchesRelatedSearch(listing, "entity")).toBe(true);
    expect(listingMatchesRelatedSearch(listing, "category")).toBe(true);
    expect(listingMatchesRelatedSearch(listing, "  SAMPLE  ")).toBe(true);
  });

  it("treats a blank query as a match", () => {
    expect(listingMatchesRelatedSearch(listing, "")).toBe(true);
    expect(listingMatchesRelatedSearch(listing, "   ")).toBe(true);
  });

  it("rejects unrelated text", () => {
    expect(listingMatchesRelatedSearch(listing, "grooming")).toBe(false);
  });
});

describe("isDuplicateArticleListingError", () => {
  it("detects unique-constraint failures", () => {
    expect(isDuplicateArticleListingError({ code: "23505" })).toBe(true);
    expect(isDuplicateArticleListingError({ code: "23503" })).toBe(false);
    expect(isDuplicateArticleListingError(null)).toBe(false);
  });
});
