import { afterEach, describe, expect, it } from "vitest";
import { BUSINESS } from "@/config/business";
import { SEO } from "@/config/seo";
import { getPlatformName } from "@/lib/mail/config";
import { rootSiteMetadata } from "@/lib/site-metadata";
import { articlePageMetadata } from "@/server/articles/metadata";
import { listingPageMetadata } from "@/server/listings/metadata";

const originalPlatformName = process.env.PLATFORM_NAME;

afterEach(() => {
  if (originalPlatformName === undefined) {
    delete process.env.PLATFORM_NAME;
  } else {
    process.env.PLATFORM_NAME = originalPlatformName;
  }
});

describe("root site metadata", () => {
  it("uses the configured business name and SEO defaults", () => {
    const metadata = rootSiteMetadata();

    expect(metadata.applicationName).toBe(BUSINESS.name);
    expect(metadata.title).toEqual({
      default: SEO.defaultTitle,
      template: SEO.titleTemplate,
    });
    expect(metadata.description).toBe(SEO.description);
    expect(metadata.openGraph?.siteName).toBe(BUSINESS.name);
    expect(metadata.openGraph?.images).toEqual([{ url: SEO.defaultImage }]);
  });
});

describe("record-driven page metadata", () => {
  it("builds Listing metadata from the Listing, not site SEO defaults", () => {
    const metadata = listingPageMetadata({
      title: "Sample Listing",
      summary: "A short public summary of this listing.",
      seo_title: "",
      seo_description: "",
    });

    expect(metadata.title).toBe("Sample Listing");
    expect(metadata.description).toBe("A short public summary of this listing.");
    expect(metadata.title).not.toBe(SEO.defaultTitle);
  });

  it("builds Article metadata from the Article, not site SEO defaults", () => {
    const metadata = articlePageMetadata({
      title: "How to choose a provider",
      excerpt: "What to ask before you book.",
      seo_title: "",
      seo_description: "",
    });

    expect(metadata.title).toBe("How to choose a provider");
    expect(metadata.description).toBe("What to ask before you book.");
    expect(metadata.title).not.toBe(SEO.defaultTitle);
  });
});

describe("getPlatformName", () => {
  it("falls back to the configured business name", () => {
    delete process.env.PLATFORM_NAME;
    expect(getPlatformName()).toBe(BUSINESS.name);
  });

  it("uses PLATFORM_NAME when set", () => {
    process.env.PLATFORM_NAME = "Sample Platform";
    expect(getPlatformName()).toBe("Sample Platform");
  });
});
