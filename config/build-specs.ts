import type { BuildSpecsConfig } from "@/lib/build-specs/types";

/**
 * Dormant developer-managed predefined offerings.
 * The template does not mount Build Spec routes, nav, or sitemap entries.
 * Keep this file and `lib/build-specs/` if a clone wants to wire pages again.
 * Operators do not edit this from the dashboard.
 */
export const BUILD_SPECS: BuildSpecsConfig = {
  enabled: false,
  pageTitle: "Build Specs",
  pageIntro:
    "Predefined packages for this marketplace. These are not live inventory Listings. Browse Listings when you want current availability.",
  items: [],
};
