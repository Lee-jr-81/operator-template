import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes the core public index routes and no Build Spec paths", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.some((url) => url.endsWith("/listings"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/articles"))).toBe(true);
    expect(urls.some((url) => url.includes("/build-specs"))).toBe(false);
  });
});
