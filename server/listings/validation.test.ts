import { describe, expect, it } from "vitest";
import { listingPageMetadata } from "@/server/listings/metadata";
import {
  DUPLICATE_SLUG_MESSAGE,
  isRestrictDeleteError,
  isUniqueSlugError,
  listingRelationshipErrors,
  parseListingInput,
} from "@/server/listings/validation";

const valid = {
  title: "Sample Listing",
  slug: "",
  summary: "A short public summary of this listing.",
  description: "A longer operator-created description.",
  category_id: "11111111-1111-1111-1111-111111111111",
  entity_id: "22222222-2222-2222-2222-222222222222",
  status: "active",
  is_featured: "",
  seo_title: "",
  seo_description: "",
};

describe("parseListingInput", () => {
  it("requires title, summary, Category, Entity, and a valid status", () => {
    const result = parseListingInput({
      title: "  ",
      slug: "",
      summary: "",
      description: "",
      category_id: "",
      entity_id: "",
      status: "draft",
      is_featured: "",
      seo_title: "",
      seo_description: "",
    });

    expect(result).toEqual({
      fieldErrors: {
        title: "Enter a Listing title.",
        slug: "Enter a URL-safe slug, or use a title that can generate one.",
        summary: "Enter a short summary for cards and search.",
        category_id: "Choose a Category.",
        entity_id: "Choose an Entity.",
        status: "Choose Active or Inactive.",
      },
    });
  });

  it("generates a slug from the title when the slug is empty", () => {
    const result = parseListingInput(valid);

    expect(result).toEqual({
      data: {
        title: "Sample Listing",
        slug: "sample-listing",
        summary: "A short public summary of this listing.",
        description: "A longer operator-created description.",
        category_id: valid.category_id,
        entity_id: valid.entity_id,
        status: "active",
        is_featured: false,
        seo_title: "",
        seo_description: "",
      },
    });
  });

  it("normalises a typed slug", () => {
    const result = parseListingInput({
      ...valid,
      slug: "Intro Session Course",
    });

    expect("data" in result && result.data.slug).toBe("intro-session-course");
  });

  it("defaults Featured off unless the checkbox is submitted", () => {
    const off = parseListingInput(valid);
    expect("data" in off && off.data.is_featured).toBe(false);

    const on = parseListingInput({ ...valid, is_featured: "true" });
    expect("data" in on && on.data.is_featured).toBe(true);
  });
});

describe("listingRelationshipErrors", () => {
  it("rejects missing Category and Entity IDs after lookup", () => {
    expect(
      listingRelationshipErrors({
        categoryExists: false,
        entityExists: false,
      }),
    ).toEqual({
      category_id: "Choose a valid Category.",
      entity_id: "Choose a valid Entity.",
    });
  });
});

describe("listingPageMetadata", () => {
  it("falls back to title and summary when SEO fields are empty", () => {
    expect(
      listingPageMetadata({
        title: "Sample Listing",
        summary: "A short public summary of this listing.",
        seo_title: "",
        seo_description: "",
      }),
    ).toEqual({
      title: "Sample Listing",
      description: "A short public summary of this listing.",
    });
  });

  it("uses SEO fields when provided", () => {
    expect(
      listingPageMetadata({
        title: "Sample Listing",
        summary: "A short public summary of this listing.",
        seo_title: "Sample Listing in Town",
        seo_description: "A short public summary of this listing.",
      }),
    ).toEqual({
      title: "Sample Listing in Town",
      description: "A short public summary of this listing.",
    });
  });
});

describe("database error mapping", () => {
  it("detects unique slug violations", () => {
    expect(isUniqueSlugError({ code: "23505" })).toBe(true);
    expect(isUniqueSlugError({ code: "23503" })).toBe(false);
    expect(DUPLICATE_SLUG_MESSAGE).toContain("already used");
  });

  it("detects restrict-delete foreign key violations", () => {
    expect(isRestrictDeleteError({ code: "23503" })).toBe(true);
    expect(isRestrictDeleteError({ code: "23505" })).toBe(false);
    expect(isRestrictDeleteError(null)).toBe(false);
  });
});
