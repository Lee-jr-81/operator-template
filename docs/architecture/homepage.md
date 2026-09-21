# Homepage

The public homepage (`/`) is developer-controlled Next.js. It is not a page builder, JSON layout, or operator section-ordering screen.

Operator activity on Categories, Listings, and Articles keeps the homepage useful. Empty sections are omitted. There is no “nothing here yet” box on `/`.

## Sections

```text
Sticky Header
Photographic Hero (inset rounded photo)
Featured Listings
Categories
Static marketplace proof
Latest Listings
Homepage context (from `config/business.ts`)
Latest Articles
Pre-footer listing CTA
Dark Footer
```

CTAs only go to existing routes: `/listings`, `/categories`, `/articles`, `/login`. There is no public listing-submission form.

Limits live in `lib/homepage/limits.ts`. Selection helpers live in `lib/homepage/selection.ts`. Homepage context copy lives in `config/business.ts`. Queries stay in the domain modules (`server/categories`, `server/listings`, `server/articles`). Visual rules live in `docs/design/public-design-system.md`.

## Categories

Show Categories that currently have at least one public Listing (`status = active`). Sorted by name. Fetch 6, show 5. No section heading and no View all link; `/categories` remains in the footer. Category cards use `categories.image_path` when present, otherwise `BRANDING.media.categoryFallback`.

Do not cache Listing counts on Category rows.

## Featured Listings

`listings.is_featured` is an operator checkbox on Listing create/edit.

Public Featured requires `is_featured = true` **and** existing public Listing eligibility (`status = active`). Inactive Featured Listings keep the flag and stay off the homepage until they are active again.

Newest `created_at` first. Limit 3. Duplicate Listing resets Featured to false so a copy is not automatically merchandised.

There is no Featured management screen, featured date range, or slot number.

## Recently Added

Automatic. Public Listings ordered by `created_at` descending. Limit 3. No operator control. The section sits on one muted full-width band.

The same Listing may appear in Featured and Recently Added. That is acceptable.

## Latest Articles

Published Articles only, `published_at` descending, limit 3. Card fields only — no Markdown body. No Article `is_featured`.

## Why there is no Current Deals section

Public Deal display is attached to a Listing:

```text
Listing
   └── optional current Deal
```

The template has no `/deals` index, no homepage Deals block, and no public Deals navigation. A current Deal can still appear as the existing Listing card badge when that Listing is Featured or Recently Added.

## Public eligibility

Homepage queries reuse the same public rules as `/listings` and `/articles`. Featured does not bypass `status = active`. Articles still require published + `published_at <= now`.

Cards are the existing `ListingCard` and `ArticleCard` components.

## What this is not

Not a homepage builder, recommendation engine, personalization layer, or dashboard restyle. Browse and detail pages are not redesigned in Step 01, though they reuse the shared cards.
