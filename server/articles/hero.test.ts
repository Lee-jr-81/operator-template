import { describe, expect, it } from "vitest";
import { articleHeroPath, validateArticleHeroFile } from "@/server/articles/hero";
import { articlePageMetadata } from "@/server/articles/metadata";
import type { PublicArticleCard } from "@/server/articles/types";

describe("validateArticleHeroFile", () => {
  it("accepts a JPEG under 5MB", async () => {
    const bytes = new Uint8Array(12);
    bytes[0] = 0xff;
    bytes[1] = 0xd8;
    bytes[2] = 0xff;
    const file = new File([bytes], "hero.jpg", {
      type: "image/jpeg",
    });

    await expect(validateArticleHeroFile(file)).resolves.toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects an empty file and unsupported type", async () => {
    const empty = new File([], "empty.jpg", { type: "image/jpeg" });
    const gif = new File([new Uint8Array(12)], "hero.gif", {
      type: "image/gif",
    });

    await expect(validateArticleHeroFile(empty)).resolves.toEqual({
      error: "Choose an image to upload.",
    });
    await expect(validateArticleHeroFile(gif)).resolves.toEqual({
      error: "Use a JPEG, PNG, or WebP image.",
    });
  });
});

describe("articleHeroPath", () => {
  it("stores the file under the Article id", () => {
    expect(articleHeroPath("article-1", "media-1", "webp")).toBe(
      "article-1/media-1.webp",
    );
  });
});

describe("articlePageMetadata", () => {
  it("falls back to title and excerpt", () => {
    expect(
      articlePageMetadata({
        title: "How to choose the right provider",
        excerpt: "A practical checklist for choosing a provider.",
        seo_title: "",
        seo_description: "",
      }),
    ).toEqual({
      title: "How to choose the right provider",
      description: "A practical checklist for choosing a provider.",
    });
  });

  it("prefers explicit SEO fields", () => {
    expect(
      articlePageMetadata({
        title: "How to choose the right provider",
        excerpt: "A practical checklist for choosing a provider.",
        seo_title: "Provider checklist",
        seo_description: "What to ask before you book.",
      }),
    ).toEqual({
      title: "Provider checklist",
      description: "What to ask before you book.",
    });
  });
});

describe("public article projection", () => {
  it("does not put draft status or body HTML on cards", () => {
    const card: PublicArticleCard = {
      id: "article-1",
      title: "How to choose the right provider",
      slug: "how-to-choose-the-right-provider",
      excerpt: "A practical checklist for choosing a provider.",
      published_at: "2026-08-21T12:00:00.000Z",
      hero_image_url: null,
    };

    expect(card).not.toHaveProperty("status");
    expect(card).not.toHaveProperty("body");
    expect(card).not.toHaveProperty("seo_title");
  });
});
