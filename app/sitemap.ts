import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

const STATIC_PATHS = ["/", "/listings", "/categories", "/articles", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getPublicSiteUrl() ?? "http://localhost:3000";

  return STATIC_PATHS.map((path) => ({
    url: `${origin}${path === "/" ? "" : path}`,
  }));
}
