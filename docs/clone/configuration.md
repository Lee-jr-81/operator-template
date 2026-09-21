# Clone identity configuration

Change identity here. Do not add feature flags.

> **Configuration is for identity, not architecture.**

```text
config/business.ts      Name, short name, tagline, locale, homepage context and proof
config/branding.ts      Logo paths, colours, font names
config/seo.ts           Site-wide title, description, default image
config/terminology.ts   Category / Entity / Listing labels
config/build-specs.ts   Dormant optional specs; leave unused unless a clone remounts them
public/brand/           logo.svg, mark.svg, favicon.svg, og-default.svg
```

Secrets stay in environment variables. A public business name belongs in `config/business.ts`.

---

## Business

Edit `config/business.ts`.

Used for:

- public header and footer
- dashboard brand text
- default site name in metadata
- enquiry email attribution (`getPlatformName()` falls back to `BUSINESS.name`)
- `html lang` (`BUSINESS.locale.language`)
- date formatting (`BUSINESS.locale.language`)
- optional price prefix (`BUSINESS.locale.currencyPrefix`, empty by default)
- homepage context band (`BUSINESS.homepage.context`) between latest listings and articles
- homepage proof stats (`BUSINESS.homepage.proof`) — replace with numbers that are true for the platform

`PLATFORM_NAME` remains an optional env override for email attribution only.

Leave `heading` or `paragraphs` empty to omit that band. Rewrite `underline` and `actions` with the clone. Do not add unused fields such as VAT numbers or opening hours.

---

## Branding

Replace the files in `public/brand/`. Point `config/branding.ts` at them if the filenames change.

Expected assets:

```text
public/brand/logo.svg
public/brand/logo-on-dark.svg
public/brand/mark.svg
public/brand/favicon.svg
public/brand/og-default.svg
public/brand/hero.jpg
public/brand/category-fallback.jpg
```

`logo.svg` is for light surfaces (header). `logo-on-dark.svg` is for the dark footer. `hero.jpg` is the homepage photograph. `category-fallback.jpg` is used on Category cards when a Category has no uploaded image.

Colours from `BRANDING.colours` are applied as `--brand-primary`, `--brand-secondary`, and `--brand-accent` on `<html>`. Public surfaces also use `--public-*` tokens in `app/globals.css`. Primary buttons and `:focus-visible` use the brand tokens. Dashboard chrome is unchanged by this styling step.

Typography:

1. Put the heading and body names in `config/branding.ts`.
2. Import the fonts with `next/font` in `app/layout.tsx`.
3. Point `--font-heading` and `--font-body` at those CSS variables in `app/globals.css`.

Do not add runtime font loading.

---

## SEO

Edit `config/seo.ts` for site-wide defaults: title, title template, description, default Open Graph image.

Listing and Article detail metadata stay record-driven (`seo_title` / `seo_description`, then title/summary or excerpt). The SEO config can supply a fallback image when a Listing has no media.

---

## Terminology

Edit `config/terminology.ts` for Category, Entity, and Listing singular/plural labels.

Used on:

- public and dashboard nav
- page titles and headings
- primary create/add/save buttons
- obvious table headings

Not used for:

- database tables or columns
- migrations
- TypeScript domain types
- routes (`/listings`, `/dashboard/entities`, …)
- every sentence in helper copy

Examples (documentation only; do not seed these into the master):

```text
Dog services:        Entity → Provider, Listing → Service
Agricultural:        Entity → Dealer,  Listing → Machine
Specialist jobs:     Entity → Employer, Listing → Vacancy, Category → Sector
```

A human wording pass is still required after you change labels.

---

## Build Specs

`config/build-specs.ts` is a special dormant file. The master does not mount public routes, nav, or sitemap entries. Do not treat it as a model for `config/features.ts`. That file must not exist.

If a clone does not need maps, Deals, WhatsApp, Enquiries, or Articles, remove or adapt that code in the clone.
