import { describe, expect, it } from "vitest";
import {
  DUPLICATE_SLUG_MESSAGE,
  isRestrictDeleteError,
  isUniqueSlugError,
  parseCategoryInput,
} from "@/server/categories/validation";

describe("parseCategoryInput", () => {
  it("requires a name, slug, and description", () => {
    const result = parseCategoryInput({
      name: "  ",
      slug: "",
      description: "",
    });

    expect(result).toEqual({
      fieldErrors: {
        name: "Enter a Category name.",
        slug: "Enter a URL-safe slug, or use a name that can generate one.",
        description: "Enter a short description for the public Category page.",
      },
    });
  });

  it("generates a slug from the name when the slug is empty", () => {
    const result = parseCategoryInput({
      name: "Sample Category",
      slug: "",
      description: "Professional walking services.",
    });

    expect(result).toEqual({
      data: {
        name: "Sample Category",
        slug: "sample-category",
        description: "Professional walking services.",
      },
    });
  });

  it("normalises a typed slug", () => {
    const result = parseCategoryInput({
      name: "Training",
      slug: "Intro Session",
      description: "Training packages for new owners.",
    });

    expect(result).toEqual({
      data: {
        name: "Training",
        slug: "intro-session",
        description: "Training packages for new owners.",
      },
    });
  });
});

describe("isUniqueSlugError", () => {
  it("detects Postgres unique violations", () => {
    expect(isUniqueSlugError({ code: "23505" })).toBe(true);
    expect(isUniqueSlugError({ code: "42501" })).toBe(false);
    expect(isUniqueSlugError(null)).toBe(false);
    expect(DUPLICATE_SLUG_MESSAGE).toContain("already used");
  });
});

describe("isRestrictDeleteError", () => {
  it("detects foreign-key restrict violations", () => {
    expect(isRestrictDeleteError({ code: "23503" })).toBe(true);
    expect(isRestrictDeleteError({ code: "23505" })).toBe(false);
    expect(isRestrictDeleteError(null)).toBe(false);
  });
});
