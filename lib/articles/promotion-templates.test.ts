import { describe, expect, it } from "vitest";
import {
  buildFacebookArticlePost,
  buildInstagramArticlePost,
  buildLinkedInArticlePost,
  buildXArticlePost,
  canPromoteArticle,
  X_ARTICLE_POST_MAX,
  type ArticlePromotionSource,
} from "@/lib/articles/promotion-templates";

const source: ArticlePromotionSource = {
  title: "How to choose a reliable provider",
  excerpt:
    "A practical guide to experience, insurance, group sizes and the questions worth asking.",
  url: "http://localhost:3000/articles/how-to-choose-a-reliable-provider",
};

describe("canPromoteArticle", () => {
  it("allows published Articles and blocks Drafts", () => {
    expect(canPromoteArticle("published")).toBe(true);
    expect(canPromoteArticle("draft")).toBe(false);
  });
});

describe("article promotion templates", () => {
  it("builds a Facebook draft from title, excerpt, and URL", () => {
    const post = buildFacebookArticlePost(source);

    expect(post).toBe(
      [
        "How to choose a reliable provider",
        "A practical guide to experience, insurance, group sizes and the questions worth asking.",
        "Read the full article:\nhttp://localhost:3000/articles/how-to-choose-a-reliable-provider",
      ].join("\n\n"),
    );
    expect(post).not.toContain("undefined");
    expect(post).not.toContain("Sample Entity");
  });

  it("builds an Instagram draft from title, excerpt, and URL", () => {
    expect(buildInstagramArticlePost(source)).toBe(
      [
        "How to choose a reliable provider",
        "A practical guide to experience, insurance, group sizes and the questions worth asking.",
        "Read more via:\nhttp://localhost:3000/articles/how-to-choose-a-reliable-provider",
      ].join("\n\n"),
    );
  });

  it("builds a LinkedIn draft from title, excerpt, and URL", () => {
    const post = buildLinkedInArticlePost(source);

    expect(post).toContain("How to choose a reliable provider");
    expect(post).toContain(source.excerpt);
    expect(post).toContain(
      "We published this guide to help people understand the subject more clearly.",
    );
    expect(post).toContain(
      "Read the article:\nhttp://localhost:3000/articles/how-to-choose-a-reliable-provider",
    );
  });

  it("builds a short X draft that includes title and URL", () => {
    const post = buildXArticlePost(source);

    expect(post).toContain("How to choose a reliable provider");
    expect(post).toContain(source.url);
    expect(post.length).toBeLessThanOrEqual(X_ARTICLE_POST_MAX);
  });

  it("shortens a long excerpt on X instead of overflowing", () => {
    const post = buildXArticlePost({
      ...source,
      excerpt: "Helpful advice. ".repeat(40),
    });

    expect(post).toContain(source.title);
    expect(post).toContain(source.url);
    expect(post).toContain("…");
    expect(post.length).toBeLessThanOrEqual(X_ARTICLE_POST_MAX);
    expect(post).not.toContain("Helpful advice. ".repeat(40).trim());
  });

  it("keeps the URL when the title is very long on X", () => {
    const post = buildXArticlePost({
      title: "A".repeat(300),
      excerpt: "Summary.",
      url: source.url,
    });

    expect(post).toContain(source.url);
    expect(post.length).toBeLessThanOrEqual(X_ARTICLE_POST_MAX);
  });

  it("does not parse Article body or inject related Listings", () => {
    const posts = [
      buildFacebookArticlePost(source),
      buildInstagramArticlePost(source),
      buildLinkedInArticlePost(source),
      buildXArticlePost(source),
    ].join("\n");

    expect(posts).not.toContain("## Introduction");
    expect(posts).not.toContain("Sample Listing");
    expect(posts).not.toContain("listing");
  });

  it("omits blank title or excerpt rather than leaking empty lines", () => {
    const post = buildFacebookArticlePost({
      title: "  ",
      excerpt: "A short summary.",
      url: source.url,
    });

    expect(post.startsWith("\n")).toBe(false);
    expect(post).toContain("A short summary.");
    expect(post).toContain(source.url);
  });
});
