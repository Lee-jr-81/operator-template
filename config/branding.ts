// Colours become --brand-primary, --brand-secondary, and --brand-accent on <html>.
// Heading/body names are documented here. Load the fonts in app/layout.tsx and
// point --font-heading / --font-body at them in app/globals.css.

export const BRANDING = {
  logo: {
    primary: "/brand/logo.svg",
    mark: "/brand/mark.svg",
    favicon: "/brand/favicon.svg",
    onDark: "/brand/logo-on-dark.svg",
  },
  media: {
    hero: "/brand/hero.jpg",
    categoryIcon: "/brand/mark.svg",
  },
  colours: {
    primary: "#176B68",
    secondary: "#10504E",
    accent: "#DCE8E2",
  },
  typography: {
    heading: "Geist",
    body: "Geist",
  },
} as const;
