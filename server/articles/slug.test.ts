import { describe, expect, it } from "vitest";
import {
  generateArticleSlug,
  isValidArticleSlug,
} from "@/server/articles/slug";

describe("generateArticleSlug", () => {
  it("builds a URL-safe slug from a title", () => {
    expect(generateArticleSlug("How to choose the right provider")).toBe(
      "how-to-choose-the-right-provider",
    );
  });

  it("strips punctuation and trims hyphens", () => {
    expect(generateArticleSlug("  Intro Session!  ")).toBe("intro-session");
  });
});

describe("isValidArticleSlug", () => {
  it("accepts lowercase words and numbers separated by hyphens", () => {
    expect(isValidArticleSlug("how-to-choose-the-right-provider")).toBe(true);
  });

  it("rejects spaces and leading hyphens", () => {
    expect(isValidArticleSlug("Not A Slug")).toBe(false);
    expect(isValidArticleSlug("-guide")).toBe(false);
  });
});
