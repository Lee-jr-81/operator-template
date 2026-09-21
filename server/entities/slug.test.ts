import { describe, expect, it } from "vitest";
import { generateEntitySlug, isValidEntitySlug } from "@/server/entities/slug";

describe("generateEntitySlug", () => {
  it("creates a URL-safe slug from an Entity name", () => {
    expect(generateEntitySlug("Sample Entity")).toBe(
      "sample-entity",
    );
  });
});

describe("isValidEntitySlug", () => {
  it("accepts lowercase letters, numbers, and internal hyphens", () => {
    expect(isValidEntitySlug("sample-entity")).toBe(true);
  });

  it("rejects uppercase and spaces", () => {
    expect(isValidEntitySlug("Sample Name")).toBe(false);
  });
});
