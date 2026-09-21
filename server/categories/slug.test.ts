import { describe, expect, it } from "vitest";
import { generateCategorySlug, isValidCategorySlug } from "@/server/categories/slug";

describe("generateCategorySlug", () => {
  it("creates a URL-safe slug from a Category name", () => {
    expect(generateCategorySlug("BMS Commissioning")).toBe("bms-commissioning");
  });

  it("trims punctuation and extra hyphens", () => {
    expect(generateCategorySlug("  Hello---World!! ")).toBe("hello-world");
  });

  it("returns an empty string when nothing URL-safe remains", () => {
    expect(generateCategorySlug("!!!")).toBe("");
  });
});

describe("isValidCategorySlug", () => {
  it("accepts lowercase letters, numbers, and internal hyphens", () => {
    expect(isValidCategorySlug("bms-commissioning")).toBe(true);
    expect(isValidCategorySlug("tractors")).toBe(true);
  });

  it("rejects uppercase, spaces, and edge hyphens", () => {
    expect(isValidCategorySlug("BMS")).toBe(false);
    expect(isValidCategorySlug("bms commissioning")).toBe(false);
    expect(isValidCategorySlug("-bms")).toBe(false);
    expect(isValidCategorySlug("bms-")).toBe(false);
  });
});
