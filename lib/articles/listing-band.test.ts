import { describe, expect, it } from "vitest";
import {
  ARTICLE_LISTING_BAND_MIN,
  buildArticleListingBand,
  latestArticleBandHeading,
  relatedArticleBandHeading,
} from "@/lib/articles/listing-band";
import type { PublicListingCard } from "@/server/listings/types";

function card(id: string, title: string): PublicListingCard {
  return {
    id,
    title,
    slug: id,
    summary: "",
    category_name: "Sample Category",
    category_slug: "walking",
    entity_name: "Sample Entity",
    details: {
      service_format: "",
      price_text: "",
      duration_text: "",
    },
    image: null,
    entity_location: null,
    created_at: "2026-08-26T12:00:00.000Z",
    current_deal: null,
  };
}

const related = card("related-1", "Related Walk");
const latest = [
  card("latest-1", "Latest One"),
  card("latest-2", "Latest Two"),
  card("latest-3", "Latest Three"),
];

describe("buildArticleListingBand", () => {
  it("falls back to latest listings when the operator linked none", () => {
    const band = buildArticleListingBand([], latest);

    expect(band?.heading).toBe(latestArticleBandHeading());
    expect(band?.listings.map((item) => item.id)).toEqual([
      "latest-1",
      "latest-2",
      "latest-3",
    ]);
  });

  it("keeps related listings first and fills a short set to three", () => {
    const band = buildArticleListingBand([related], latest);

    expect(band?.heading).toBe(relatedArticleBandHeading());
    expect(band?.listings).toHaveLength(ARTICLE_LISTING_BAND_MIN);
    expect(band?.listings.map((item) => item.id)).toEqual([
      "related-1",
      "latest-1",
      "latest-2",
    ]);
  });

  it("does not pad when the operator already linked enough listings", () => {
    const many = [
      card("a", "A"),
      card("b", "B"),
      card("c", "C"),
      card("d", "D"),
    ];
    const band = buildArticleListingBand(many, latest);

    expect(band?.listings.map((item) => item.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("returns nothing when the marketplace has no public listings", () => {
    expect(buildArticleListingBand([], [])).toBeNull();
  });
});
