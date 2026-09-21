import { describe, expect, it } from "vitest";
import {
  ARTICLE_BODY_MAX,
  ARTICLE_EXCERPT_MAX,
  ARTICLE_TITLE_MAX,
} from "@/server/articles/slug";
import {
  DUPLICATE_SLUG_MESSAGE,
  isUniqueSlugError,
  parseArticleInput,
} from "@/server/articles/validation";

const valid = {
  title: "How to choose the right provider",
  slug: "how-to-choose-the-right-provider",
  excerpt: "A practical checklist for choosing a reliable local provider.",
  body: "Look for insurance, references, and a clear walk routine before you book.",
  status: "draft",
  published_at: "",
  seo_title: "",
  seo_description: "",
};

describe("parseArticleInput", () => {
  it("requires title, excerpt, and body", () => {
    const result = parseArticleInput({
      ...valid,
      title: "",
      excerpt: "",
      body: "",
    });

    expect(result).toEqual({
      fieldErrors: {
        title: "Enter an Article title.",
        excerpt: "Enter a short excerpt for cards and search.",
        body: "Enter the Article body.",
      },
    });
  });

  it("generates a slug from the title when slug is blank", () => {
    const result = parseArticleInput({ ...valid, slug: "  " });

    expect("data" in result && result.data.slug).toBe(
      "how-to-choose-the-right-provider",
    );
  });

  it("normalizes a messy slug and rejects one that cannot be made URL-safe", () => {
    const normalized = parseArticleInput({ ...valid, slug: "Not Valid" });
    expect("data" in normalized && normalized.data.slug).toBe("not-valid");

    const result = parseArticleInput({
      ...valid,
      title: "!!!",
      slug: "???",
    });

    expect(result).toEqual({
      fieldErrors: {
        slug: "Enter a URL-safe slug, or use a title that can generate one.",
      },
    });
  });

  it("rejects fields that are too long", () => {
    const result = parseArticleInput({
      ...valid,
      title: "x".repeat(ARTICLE_TITLE_MAX + 1),
      excerpt: "x".repeat(ARTICLE_EXCERPT_MAX + 1),
      body: "x".repeat(ARTICLE_BODY_MAX + 1),
    });

    expect(result).toEqual({
      fieldErrors: {
        title: `Use ${ARTICLE_TITLE_MAX} characters or fewer.`,
        excerpt: `Use ${ARTICLE_EXCERPT_MAX} characters or fewer.`,
        body: `Use ${ARTICLE_BODY_MAX} characters or fewer.`,
      },
    });
  });

  it("rejects an unknown status", () => {
    const result = parseArticleInput({ ...valid, status: "scheduled" });

    expect(result).toEqual({
      fieldErrors: { status: "Choose Draft or Published." },
    });
  });

  it("sets published_at when publishing a new Article", () => {
    const result = parseArticleInput({ ...valid, status: "published" });

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.published_at).toBeTruthy();
      expect(result.data.status).toBe("published");
    }
  });
});

describe("duplicate slug errors", () => {
  it("recognises a Postgres unique-violation code", () => {
    expect(isUniqueSlugError({ code: "23505" })).toBe(true);
    expect(isUniqueSlugError({ code: "23503" })).toBe(false);
    expect(DUPLICATE_SLUG_MESSAGE).toContain("slug");
  });
});
