import { describe, expect, it } from "vitest";
import { parseListingFeaturedFlag } from "@/server/listings/validation";
import {
  homepageCategoriesFromActiveListings,
  isPublicFeaturedListing,
  PUBLIC_ARTICLE_CARD_COLUMNS,
  selectFeaturedPublicListings,
  selectLatestPublicArticles,
  selectRecentlyAddedPublicListings,
} from "@/lib/homepage/selection";
import { HOMEPAGE_CATEGORY_LIMIT } from "@/lib/homepage/limits";

describe("parseListingFeaturedFlag", () => {
  it("defaults off unless the checkbox value is true", () => {
    expect(parseListingFeaturedFlag("")).toBe(false);
    expect(parseListingFeaturedFlag("on")).toBe(false);
    expect(parseListingFeaturedFlag("true")).toBe(true);
  });
});

describe("isPublicFeaturedListing", () => {
  it("requires both Featured and public eligibility", () => {
    expect(
      isPublicFeaturedListing({ status: "active", is_featured: true }),
    ).toBe(true);
    expect(
      isPublicFeaturedListing({ status: "inactive", is_featured: true }),
    ).toBe(false);
    expect(
      isPublicFeaturedListing({ status: "active", is_featured: false }),
    ).toBe(false);
  });
});

describe("homepageCategoriesFromActiveListings", () => {
  it("keeps unique Categories, sorted by name, within the homepage limit", () => {
    const alpha = {
      id: "1",
      name: "Alpha",
      slug: "alpha",
      description: "First category",
      image_path: "1/hero.webp",
    };
    const beta = {
      id: "2",
      name: "Beta",
      slug: "beta",
      description: "Second category",
      image_path: null,
    };

    expect(
      homepageCategoriesFromActiveListings(
        [
          { categories: alpha },
          { categories: alpha },
          { categories: beta },
        ],
        HOMEPAGE_CATEGORY_LIMIT,
      ),
    ).toEqual([alpha, beta]);
  });

  it("omits rows with no Category", () => {
    expect(homepageCategoriesFromActiveListings([{ categories: null }], 8)).toEqual(
      [],
    );
  });
});

describe("selectFeaturedPublicListings", () => {
  it("keeps only active Featured Listings, newest first, within the limit", () => {
    const listings = [
      {
        id: "old",
        status: "active",
        is_featured: true,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "inactive",
        status: "inactive",
        is_featured: true,
        created_at: "2026-06-01T00:00:00.000Z",
      },
      {
        id: "new",
        status: "active",
        is_featured: true,
        created_at: "2026-08-01T00:00:00.000Z",
      },
      {
        id: "not-featured",
        status: "active",
        is_featured: false,
        created_at: "2026-08-20T00:00:00.000Z",
      },
    ];

    expect(selectFeaturedPublicListings(listings, 1).map((row) => row.id)).toEqual([
      "new",
    ]);
    expect(selectFeaturedPublicListings(listings, 6).map((row) => row.id)).toEqual([
      "new",
      "old",
    ]);
  });
});

describe("selectRecentlyAddedPublicListings", () => {
  it("keeps public Listings newest first and excludes inactive", () => {
    const listings = [
      {
        id: "older",
        status: "active",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "inactive",
        status: "inactive",
        created_at: "2026-08-20T00:00:00.000Z",
      },
      {
        id: "newer",
        status: "active",
        created_at: "2026-08-01T00:00:00.000Z",
      },
    ];

    expect(
      selectRecentlyAddedPublicListings(listings, 6).map((row) => row.id),
    ).toEqual(["newer", "older"]);
    expect(
      selectRecentlyAddedPublicListings(listings, 1).map((row) => row.id),
    ).toEqual(["newer"]);
  });
});

describe("selectLatestPublicArticles", () => {
  it("keeps published Articles, newest first, and excludes drafts", () => {
    const now = new Date("2026-08-21T12:00:00.000Z");
    const articles = [
      {
        id: "draft",
        status: "draft",
        published_at: "2026-08-20T00:00:00.000Z",
        body: "should not be required",
      },
      {
        id: "older",
        status: "published",
        published_at: "2026-08-01T00:00:00.000Z",
      },
      {
        id: "newer",
        status: "published",
        published_at: "2026-08-10T00:00:00.000Z",
      },
    ];

    expect(
      selectLatestPublicArticles(articles, 3, now).map((row) => row.id),
    ).toEqual(["newer", "older"]);
    expect(
      selectLatestPublicArticles(articles, 1, now).map((row) => row.id),
    ).toEqual(["newer"]);
  });

  it("does not select Article body for homepage cards", () => {
    expect(PUBLIC_ARTICLE_CARD_COLUMNS).not.toMatch(/\bbody\b/);
  });
});
