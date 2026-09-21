import { BUILD_SPECS } from "@/config/build-specs";
import type {
  BuildSpec,
  BuildSpecsConfig,
  PublicBuildSpec,
} from "@/lib/build-specs/types";

export const DEFAULT_BUILD_SPEC_CTA_LABEL = "Browse current Listings";
export const DEFAULT_BUILD_SPEC_CTA_HREF = "/listings";

export function isBuildSpecsEnabled(config: BuildSpecsConfig = BUILD_SPECS) {
  return config.enabled;
}

function toPublicBuildSpec(spec: BuildSpec): PublicBuildSpec {
  return {
    ...spec,
    ctaLabel: spec.ctaLabel?.trim() || DEFAULT_BUILD_SPEC_CTA_LABEL,
    ctaHref: spec.ctaHref?.trim() || DEFAULT_BUILD_SPEC_CTA_HREF,
  };
}

export function listPublicBuildSpecs(
  config: BuildSpecsConfig = BUILD_SPECS,
): PublicBuildSpec[] {
  if (!config.enabled) {
    return [];
  }

  return config.items.filter((item) => item.enabled).map(toPublicBuildSpec);
}

export function getPublicBuildSpecBySlug(
  slug: string,
  config: BuildSpecsConfig = BUILD_SPECS,
): PublicBuildSpec | null {
  if (!config.enabled || !slug) {
    return null;
  }

  const spec = config.items.find((item) => item.slug === slug && item.enabled);
  return spec ? toPublicBuildSpec(spec) : null;
}

export function buildSpecSitemapPaths(
  config: BuildSpecsConfig = BUILD_SPECS,
): string[] {
  if (!config.enabled) {
    return [];
  }

  return [
    "/build-specs",
    ...listPublicBuildSpecs(config).map((spec) => `/build-specs/${spec.slug}`),
  ];
}

export function buildSpecDetailMetadata(spec: PublicBuildSpec) {
  return {
    title: spec.seoTitle?.trim() || spec.title,
    description: spec.seoDescription?.trim() || spec.summary,
    canonicalPath: `/build-specs/${spec.slug}`,
    imageSrc: spec.heroImageSrc,
  };
}

export function buildSpecsIndexMetadata(config: BuildSpecsConfig = BUILD_SPECS) {
  return {
    title: config.pageTitle,
    description: config.pageIntro,
    canonicalPath: "/build-specs",
  };
}

export function descriptionParagraphs(description: string) {
  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
