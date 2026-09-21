import { describe, expect, it } from "vitest";
import { generateListingSlug, isValidListingSlug } from "@/server/listings/slug";

describe("generateListingSlug", () => {
  it("builds a URL-safe slug from a title", () => {
    expect(generateListingSlug("Sample Listing")).toBe(
      "sample-listing",
    );
  });

  it("strips punctuation and trims hyphens", () => {
    expect(generateListingSlug("  Intro Session!  ")).toBe("intro-session");
  });
});

describe("isValidListingSlug", () => {
  it("accepts lowercase words and numbers separated by hyphens", () => {
    expect(isValidListingSlug("sample-listing")).toBe(true);
  });

  it("rejects spaces and leading hyphens", () => {
    expect(isValidListingSlug("Sample Title")).toBe(false);
    expect(isValidListingSlug("-walk")).toBe(false);
  });
});
