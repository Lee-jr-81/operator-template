import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { SEO } from "@/config/seo";
import { getPublicSiteUrl } from "@/lib/site-url";

export function rootSiteMetadata(): Metadata {
  return {
    metadataBase: new URL(getPublicSiteUrl() ?? "http://localhost:3000"),
    title: {
      default: SEO.defaultTitle,
      template: SEO.titleTemplate,
    },
    description: SEO.description,
    applicationName: BUSINESS.name,
    openGraph: {
      type: "website",
      siteName: BUSINESS.name,
      locale: BUSINESS.locale.language.replace("-", "_"),
      images: [{ url: SEO.defaultImage }],
    },
    icons: {
      icon: BRANDING.logo.favicon,
    },
  };
}

export function brandCssVars(): CSSProperties {
  return {
    "--brand-primary": BRANDING.colours.primary,
    "--brand-secondary": BRANDING.colours.secondary,
    "--brand-accent": BRANDING.colours.accent,
  } as CSSProperties;
}
