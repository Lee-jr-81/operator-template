import { describe, expect, it } from "vitest";
import { BUILD_SPECS } from "@/config/build-specs";
import type { BuildSpecsConfig } from "@/lib/build-specs/types";
import {
  DEFAULT_BUILD_SPEC_CTA_HREF,
  DEFAULT_BUILD_SPEC_CTA_LABEL,
  buildSpecDetailMetadata,
  buildSpecSitemapPaths,
  descriptionParagraphs,
  getPublicBuildSpecBySlug,
  isBuildSpecsEnabled,
  listPublicBuildSpecs,
} from "@/lib/build-specs/public";

const config: BuildSpecsConfig = {
  enabled: true,
  pageTitle: "Build Specs",
  pageIntro: "Predefined packages.",
  items: [
    {
      slug: "starter-package",
      title: "Starter Package",
      summary: "Essentials included.",
      description: "First paragraph.\n\nSecond paragraph.",
      groups: [{ heading: "Included", items: ["Core window"] }],
      priceText: "From £49",
      enabled: true,
    },
    {
      slug: "professional-package",
      title: "Professional Package",
      summary: "More cover.",
      description: "Professional description.",
      groups: [{ heading: "Included", items: ["Named contact"] }],
      seoTitle: "Professional Package spec",
      seoDescription: "Professional SEO description.",
      enabled: true,
    },
    {
      slug: "legacy-package",
      title: "Legacy Package",
      summary: "Hidden.",
      description: "Should not be public.",
      groups: [{ heading: "Included", items: ["Hidden"] }],
      enabled: false,
    },
  ],
};

describe("Build Spec public accessors", () => {
  it("keeps the reusable master feature disabled", () => {
    expect(BUILD_SPECS.enabled).toBe(false);
    expect(isBuildSpecsEnabled()).toBe(false);
    expect(buildSpecSitemapPaths()).toEqual([]);
  });

  it("returns only enabled specs when the feature is on", () => {
    expect(isBuildSpecsEnabled(config)).toBe(true);
    expect(listPublicBuildSpecs(config).map((spec) => spec.slug)).toEqual([
      "starter-package",
      "professional-package",
    ]);
  });

  it("looks up an enabled spec by slug and ignores disabled or unknown slugs", () => {
    expect(getPublicBuildSpecBySlug("starter-package", config)?.title).toBe(
      "Starter Package",
    );
    expect(getPublicBuildSpecBySlug("legacy-package", config)).toBeNull();
    expect(getPublicBuildSpecBySlug("missing-package", config)).toBeNull();
  });

  it("returns nothing when the feature is disabled", () => {
    const disabled = { ...config, enabled: false };

    expect(isBuildSpecsEnabled(disabled)).toBe(false);
    expect(listPublicBuildSpecs(disabled)).toEqual([]);
    expect(getPublicBuildSpecBySlug("starter-package", disabled)).toBeNull();
    expect(buildSpecSitemapPaths(disabled)).toEqual([]);
  });

  it("applies the Listing browse CTA by default", () => {
    const spec = getPublicBuildSpecBySlug("starter-package", config);

    expect(spec?.ctaLabel).toBe(DEFAULT_BUILD_SPEC_CTA_LABEL);
    expect(spec?.ctaHref).toBe(DEFAULT_BUILD_SPEC_CTA_HREF);
  });

  it("uses configured SEO fields with title/summary fallbacks", () => {
    const starter = getPublicBuildSpecBySlug("starter-package", config);
    const professional = getPublicBuildSpecBySlug(
      "professional-package",
      config,
    );

    expect(starter && buildSpecDetailMetadata(starter)).toEqual({
      title: "Starter Package",
      description: "Essentials included.",
      canonicalPath: "/build-specs/starter-package",
      imageSrc: undefined,
    });
    expect(professional && buildSpecDetailMetadata(professional)).toEqual({
      title: "Professional Package spec",
      description: "Professional SEO description.",
      canonicalPath: "/build-specs/professional-package",
      imageSrc: undefined,
    });
  });

  it("includes only the overview and enabled detail paths in the sitemap list", () => {
    expect(buildSpecSitemapPaths(config)).toEqual([
      "/build-specs",
      "/build-specs/starter-package",
      "/build-specs/professional-package",
    ]);
  });

  it("splits description copy into paragraphs", () => {
    expect(descriptionParagraphs("First paragraph.\n\nSecond paragraph.")).toEqual(
      ["First paragraph.", "Second paragraph."],
    );
  });
});
