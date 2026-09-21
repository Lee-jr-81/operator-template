export type BuildSpecGroup = {
  heading: string;
  items: string[];
};

export type BuildSpec = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  groups: BuildSpecGroup[];
  priceText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  seoTitle?: string;
  seoDescription?: string;
  enabled: boolean;
};

export type BuildSpecsConfig = {
  enabled: boolean;
  pageTitle: string;
  pageIntro: string;
  items: BuildSpec[];
};

export type PublicBuildSpec = BuildSpec & {
  ctaLabel: string;
  ctaHref: string;
};
