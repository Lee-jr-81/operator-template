import { BUSINESS } from "@/config/business";

export const SEO = {
  defaultTitle: BUSINESS.name,
  titleTemplate: `%s · ${BUSINESS.name}`,
  description:
    "Browse listings, categories, and published articles on this marketplace.",
  defaultImage: "/brand/og-default.svg",
} as const;
