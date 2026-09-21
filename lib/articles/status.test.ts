import { describe, expect, it } from "vitest";
import {
  isArticleStatus,
  isPubliclyVisibleArticle,
  resolvePublishedAt,
} from "@/lib/articles/status";

const now = new Date("2026-08-21T12:00:00.000Z");

describe("article status", () => {
  it("allows only draft and published", () => {
    expect(isArticleStatus("draft")).toBe(true);
    expect(isArticleStatus("published")).toBe(true);
    expect(isArticleStatus("archived")).toBe(false);
    expect(isArticleStatus("scheduled")).toBe(false);
  });
});

describe("isPubliclyVisibleArticle", () => {
  it("hides drafts even when a published_at exists", () => {
    expect(
      isPubliclyVisibleArticle(
        { status: "draft", published_at: "2026-08-01T12:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });

  it("hides published Articles with no published_at", () => {
    expect(
      isPubliclyVisibleArticle({ status: "published", published_at: null }, now),
    ).toBe(false);
  });

  it("hides published Articles dated in the future", () => {
    expect(
      isPubliclyVisibleArticle(
        { status: "published", published_at: "2026-09-01T12:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });

  it("shows published Articles dated now or in the past", () => {
    expect(
      isPubliclyVisibleArticle(
        { status: "published", published_at: "2026-08-21T12:00:00.000Z" },
        now,
      ),
    ).toBe(true);
    expect(
      isPubliclyVisibleArticle(
        { status: "published", published_at: "2026-08-01T12:00:00.000Z" },
        now,
      ),
    ).toBe(true);
  });
});

describe("resolvePublishedAt", () => {
  it("sets now when publishing for the first time with a blank date", () => {
    expect(
      resolvePublishedAt({
        status: "published",
        submittedPublishedAt: null,
        existingPublishedAt: null,
        now,
      }),
    ).toBe(now.toISOString());
  });

  it("keeps the previous date when returning to Draft", () => {
    expect(
      resolvePublishedAt({
        status: "draft",
        submittedPublishedAt: null,
        existingPublishedAt: "2026-08-01T12:00:00.000Z",
        now,
      }),
    ).toBe("2026-08-01T12:00:00.000Z");
  });

  it("keeps the previous date when republishing with a blank date", () => {
    expect(
      resolvePublishedAt({
        status: "published",
        submittedPublishedAt: null,
        existingPublishedAt: "2026-08-01T12:00:00.000Z",
        now,
      }),
    ).toBe("2026-08-01T12:00:00.000Z");
  });
});
