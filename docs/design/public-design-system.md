# Public design system

Locked visual foundation from Public Styling Step 01. Clone by swapping `config/branding.ts`, `config/business.ts`, and `public/brand/` assets. Do not add a theme engine.

Standing rule:

> Premium modern marketplace, not SaaS.

Photography-led, spacious, restrained, commercially credible. One brand colour. Strict card rhythm. Generous whitespace. No pill controls, startup gradients, glowing cards, heavy shadows, or ornamental animation.

---

## Tokens

Defined in `app/globals.css`. Brand colours also inject from `config/branding.ts` onto `<html>`.

| Token | Role | Default |
|---|---|---|
| `--public-bg` | Public page background | `#ffffff` |
| `--public-surface` | Cards, header | `#ffffff` |
| `--public-muted` | Warm cream section | `#faf7f2` |
| `--public-text` | Primary text | `#252a2a` charcoal |
| `--public-text-muted` | Secondary text | `#5c6564` |
| `--public-text-subtle` | Supporting meta | `#7a8281` |
| `--public-border` | Card/header borders | `#e6e2da` |
| `--public-footer` | Dark footer | `#252a2a` charcoal |
| `--brand-primary` | Teal | `#176b68` |
| `--brand-primary-hover` | Dark teal | `#10504e` |
| `--brand-soft` | Sage | `#dce8e2` |
| `--radius-button` | Buttons | `8px` |
| `--radius-card` | Cards | `12px` |
| `--radius-panel` | Glass panel | `16px` |

Dashboard uses isolated `--dash-*` tokens under `.dashboard`. Do not restyle the public site with those tokens.

## Layout

- Content width: `1280px` (`components/ui/container.tsx`)
- Horizontal padding: 32 / 24 / 16 (desktop / tablet / mobile)
- Section spacing: ~96 / 72 / 56
- Card gap: 24 desktop / 16 mobile
- Public buttons: `lib/public-button.ts` — 48px height, 8px radius, not pills

## Type

- Hero H1: 56 / 46 / 38, weight 700, line-height ~1.05
- Section H2: 32 / 28, weight 700
- Listing card title: 20px, weight 600
- Listing card price: 26px, weight 700
- Article card title: 18px, weight 600
- Body: 16px, ~1.6
- Meta: 14px, ~1.45

## Motion

Hover 150–200ms. Card images scale to `1.02`. Borders strengthen. Titles shift to brand colour. Respect `prefers-reduced-motion` via `.public-media-zoom`.

---

## Chrome

**Header** — sticky, ~76px, quiet light surface, 10px blur, logo left, nav right, hamburger on small screens. Nav is Listings and Articles only. Scroll lock, Escape, close on navigate. Touch targets ≥48px.

**Footer** — charcoal surface (`--public-footer`), not the brand colour. Light logo (`BRANDING.logo.onDark`), tagline, Explore = Listings / Categories / Articles, plus Operator login styled as the same text link. Copyright. No Deals, social, newsletter, or invented legal pages. A `--public-bg` band (about 80–112px) sits above the footer.

---

## Cards

**Listing** (`ListingCard`) — whole card is one link to `/listings/[slug]`. Homepage uses the compact card: 3:2 image (~320px wide), 3 / 2 / 1 grid. `/listings` uses `layout="browse"`: stacked 3:2 photo below 768px, then a photo/content row (photo 60% / content 40%, 380px tall). From `lg`, a sticky right column keeps browse rows from going full-bleed: a photography-led Category panel (lead tile + photo rows) and a card inviting a supplier to get in touch. No map on the browse index.

**Listing detail** (`/listings/[slug]`) — Airbnb / LandSale layout using existing data only. Title and location sit above a photo mosaic (hero left, up to four thumbs right from `sm`). Clicking a photo or **Show all photos** / **View photo** opens a dark lightbox: counter, previous/next when there is more than one photo, Escape to close, swipe on a phone. One photo is still a gallery — it opens the viewer so the visitor can see the uncropped image. From `lg`, a sticky enquire card on the right holds price, duration, any current Deal, and contact. Summary, description, vertical details, map (only when coordinates exist), and the Provider block stay on the left. On smaller screens the enquire card sits under the gallery, before the long copy. Do not add reviews, calendars, save/share, or similar-listings carousels.

**Category** (`CategoryCard`) — square photography, dark bottom gradient, white title. Homepage shows every Category. Five cards fill the desktop row; further cards scroll sideways with arrow buttons on either side and no scrollbar. Below desktop the next card is cut off and the scrollbar stays hidden. No section heading and no View all link. One category is a single centred card, not a fake carousel. Image comes from the Category upload. With no photograph, the card shows `BRANDING.media.categoryIcon` on a muted background and the title stays dark.

**Article** (`ArticleCard`) — homepage uses the compact card (3:2 image, ~320px). `/articles` uses `layout="browse"`: stacked below 768px, then a photo/content row (60% / 40%, 380px tall) with the same sticky Category rail as `/listings`. 2-line title, excerpt (1 line compact, 2 lines browse), published date. Whole card is one link. Homepage heading is centred with a brand underline on “articles”, no View all. Max 3 on the homepage.

**Article detail** (`/articles/[slug]`) — Etsy Journal / The Modern House layout, not a listing-style sticky enquire column. Kicker (Articles · date), large title, then a wide rounded hero if one exists. The hero frame stays wide; the photo is shifted so the subject stays inside it. Under the hero, the Markdown body takes the left two thirds and the three latest active Listings for that Article’s Category take the right third. On smaller screens those Listings sit under the text. An Article with no Category, or a Category with no active Listings, keeps a single centred reading column. The excerpt is not printed under the title. No author byline, share bar, comments, reading time, or related-articles carousel.

---

## Homepage order

```text
Sticky Header
Photographic Hero
Featured Listings
Categories
Static Marketplace Proof
Latest Listings
Homepage context
Latest Articles
Pre-footer Listing CTA
Dark Footer
```

Omit empty optional sections. Latest Listings uses the existing omit-if-empty behaviour. Duplicate Featured/Latest cards are allowed. Proof is four static cards, no database. Each proof card is a small icon, a title, and one sentence from `config/business.ts`. Homepage context follows the LandSale “trusted platform” layout: centred heading with a brand underline, centred paragraphs, then two white action cards from `config/business.ts`. Blank heading or paragraphs omit the band. The closing band invites a supplier to get in touch at `/contact`.

Hero photography: `BRANDING.media.hero`. The photo is an inset rounded tile (same language as listing cards), not a full-bleed cover with a glass dock. The tagline sits bottom-left on a short photographic scrim. One action: Browse Listings. A supplier invitation sits in an inset rounded brand panel before the footer, not a full-bleed strip. It links to `/contact`. Categories stay in Explore and the footer. No search.

---

## Out of scope

Do not restyle the dashboard or maps in this step beyond what listing and article detail already reuses. Shared cards may look better on browse pages because they reuse `ListingCard` / `ArticleCard`. That is expected. Do not add public theme switching.
