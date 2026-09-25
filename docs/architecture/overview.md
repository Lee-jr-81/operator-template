# Architecture overview

OperatorTemplate is a reusable application foundation for small, operator-led vertical marketplace and discovery businesses.

## What this is

- One deployed clone represents **one independent niche business**.
- OperatorTemplate is **not** a multi-tenant SaaS platform.
- One authenticated operator/admin manages the application. That user is created in Supabase Auth. There is no public signup in V1.
- Domain features include Categories, Entities, Listings, Listing media, Entity Location, a public Listing map, Deals, Enquiries, Listing contact (WhatsApp + Enquiry mail), and Articles. Build Spec config remains in the repo but is not mounted on the public site.
- The public site and the operator dashboard are separate surfaces.
- Supabase provides Auth, PostgreSQL, and Storage.
- Security and readability are first-class requirements. Prefer the simplest secure production-grade solution an intermediate Next.js developer can maintain.
- Niche Listing data is adapted in code. The standing reference is `docs/architecture/vertical-data-model.md`.

## Current surfaces

| Route | Access |
|---|---|
| `/` | Public homepage: Categories, Featured Listings, Recently Added, Latest Articles when data exists |
| `/listings` | Public Listing index (active only) |
| `/listings/[slug]` | Public Listing detail (active only) |
| `/categories` | Public Category index |
| `/categories/[slug]` | Public Category page with its active Listings |
| `/articles` | Public Article index (published only) |
| `/articles/[slug]` | Public Article detail (published only) |
| `/login` | Public. Signed-in operators are redirected to `/dashboard`. |
| `/dashboard` | Operator only |
| `/dashboard/categories` | Operator Category management |
| `/dashboard/entities` | Operator Entity management |
| `/dashboard/listings` | Operator Listing management |
| `/dashboard/deals` | Operator Deal management |
| `/dashboard/enquiries` | Operator Enquiry management |
| `/dashboard/articles` | Operator Article management |

## Where code belongs

```text
app/(public)/          Public routes, login, Category, Listing, and Article pages
app/dashboard/         Protected operator dashboard
components/            Shared UI, public shell, homepage sections, Listing vertical UI, and Article UI
lib/supabase/          Browser client, server client, session refresh, secret-key admin client (mail only)
lib/auth/              Operator session helpers and login validation
lib/env.ts             Required public Supabase environment variables
lib/site-url.ts        Public site origin for Deal and Article promotion URLs and enquiry mail
lib/listings/          Starter listing_details types and validation
lib/deals/             Current-Deal rules and promotion templates
lib/enquiries/         Enquiry status labels and received-date formatting
lib/contact/           WhatsApp number normalization and contact-channel helpers
lib/mail/              Transactional mail config, enquiry templates, and Resend send
lib/articles/          Article status, Markdown, writing-prompt helper, related-Listing helpers, promotion templates, and date formatting
lib/homepage/          Homepage section limits and public selection helpers
lib/build-specs/       Dormant Build Spec accessors (not mounted on public routes)
config/build-specs.ts  Dormant Build Spec content (kept for a possible future clone)
lib/uploads/           Image magic-byte checks for operator uploads
lib/uuid.ts            UUID shape checks before database ID lookups
lib/location/          UK postcode geocoding (Postcodes.io) and clone flag
server/categories/     Category queries, actions, and validation
server/entities/       Entity queries, actions, validation, and public projection
server/listings/       Generic Listing queries, actions, media, map markers, and validation
server/deals/          Deal queries, actions, validation, and public projection
server/enquiries/      Enquiry queries, actions, validation, and post-persist mail
server/contact/        Listing contact channels and WhatsApp click recording
server/articles/       Article queries, actions, validation, hero image, and related Listings
server/locations/      Location queries, validation, and public formatting
proxy.ts               Next.js 16 request proxy: session refresh and route gates
docs/                  Clone, architecture, and design documentation
supabase/migrations/   SQL migrations
```

## Vertical data

Category → Listing ← Entity is the reusable core.

Detailed Listing fields are niche-specific. They belong on a 1:1 `listing_details` table, not on a dynamic schema or generic field builder.

Follow `docs/architecture/vertical-data-model.md` before adding Listing columns, forms, cards, or filters.

## Entity privacy

`entities` is operator-only. Anonymous readers cannot SELECT that table.

Public Listing pages load `entity_public` (or `getPublicEntityById` / `getPublicEntitiesByIds`) which contains only:

- name, slug, logo, public description
- email / phone / website **only if** the operator marked them as public
- concise Location (label, town, county, postcode, country, coordinates) when the Entity has one

It never contains `contact_name`, `operator_notes`, or street address lines. There is no public Entity profile in V1. `entity_public` only includes Entities that currently have at least one active Listing.

Raw `locations` is operator-only. Anonymous readers use `entity_public`, not the `locations` table. The standing Location reference is `docs/architecture/location.md`.

## Listing media

Images belong to a Listing through `listing_media`, not columns on `listings`.

- Storage bucket: `listing-media`, path `{listingId}/{mediaId}.{jpg|png|webp}`
- At most one primary image per Listing (unique partial index)
- First upload becomes primary; deleting the primary promotes the next image by sort order
- Public cards use the primary image, or a fallback if none exists
- Deleting a Listing cascades media rows; application code then removes Storage files
- Duplicate Listing copies generic fields and `listing_details`, starts **inactive**, and does **not** copy images

## Category images

A Category has one photograph. Path is `categories.image_path`. Storage bucket: `category-media`, path `{categoryId}/{mediaId}.{jpg|png|webp}`. The operator uploads it on the create form. The same file is the public card image and can later be the Category page hero. Categories without an upload show `BRANDING.media.categoryIcon`.

## Public map

`/listings` shows Listing cards. A Listing detail page shows a compact map when the Entity has usable coordinates.

The template maps **Entity Location**. The map itself only understands `ListingMapMarker`. Follow `docs/architecture/location.md`.

UK operators fill coordinates with **Find location** on the Entity form (Postcodes.io). The map still only reads stored latitude/longitude.

## Homepage

`/` is a data-driven homepage, not a page builder. Layout lives in Next.js. Empty sections are omitted.

Current sections: Browse Categories, Featured Listings, Recently Added, Latest Articles.

There is no Current Deals homepage section. A current Deal can still appear as a badge on a Listing card in Featured or Recently Added. Standing rules: `docs/architecture/homepage.md`.

## Deals

A Deal is a separate row on a Listing, not promotional columns on `listings`.

In the generic public UI a current Deal is an optional layer on that Listing: a card badge and a detail panel. There is no `/deals` index and no homepage Deals section. A niche clone can add Deal-first discovery later if the niche needs it.

Only one **current** Deal (active, started, not expired) can affect a Listing at a time. Public Listing pages hide expired, scheduled, and inactive Deals at query time — no cron job. An inactive Listing never becomes public because it has a Deal.

Promotion copy is generated from Deal fields. It is not posted anywhere. The standing Deal reference is `docs/architecture/deals.md`.

## Enquiries

An Enquiry is a visitor lead on a Listing. Entity context comes through the Listing. Anonymous users cannot read Enquiry rows. Public submit uses a database function that only inserts for active Listings whose Entity has an email. The server action does not return the stored row to the browser.

After persist, the server emails the Entity and notifies the operator. Mail failure does not invalidate the stored Enquiry. Status is `new` / `reviewed` / `closed`.

Listing deletion is blocked while Enquiries exist so lead history is not dropped. The standing Enquiry reference is `docs/architecture/enquiries.md`.

## Listing contact

Active Listing detail shows WhatsApp when the Entity has a usable phone, and Enquiry when the Entity has a usable email. WhatsApp URLs are built at request time. Clicks are stored as Listing + timestamp only. Public users cannot read click rows.

Contact details belong to the Entity. `show_phone` / `show_email` still gate published contact **text**. They do not hide WhatsApp/Enquiry when a usable destination exists.

The standing contact reference is `docs/architecture/contact.md`.

## Articles

An Article is operator-written niche content, not a Listing. Status is `draft` or `published`. Public pages show only published Articles whose `published_at` is present and not in the future.

Body is Markdown, sanitized before HTML is rendered. One optional hero image lives in the `article-media` bucket. SEO title and description fall back to the Article title and excerpt.

Create Article is the Markdown form, plus an optional AI Writing Helper. The helper copies a local prompt to the clipboard; OperatorTemplate does not call an AI API. The operator pastes returned sections by hand and adds original material before publishing. There is no Guided writing mode and no template table.

Published Article detail shows the three latest active Listings for the Article’s Category when one is set. The `article_listings` table remains, and the dashboard does not ask the operator to pick Listings by hand. Listing pages do not show Related Articles yet.

Published Articles can be promoted with deterministic Facebook, Instagram, LinkedIn, and X drafts built from title, excerpt, and the public URL. Copy is not stored and is not posted anywhere. The standing CMS reference is `docs/architecture/cms.md`.

## Clone identity

Business name, brand assets, colours, fonts, SEO defaults, and Category/Entity/Listing labels live in `config/` plus `public/brand/`. This is identity, not a feature-flag layer. Standing guide: `docs/clone/configuration.md`.

## Build Specs

Build Specs remain as unused TypeScript config in `config/build-specs.ts` and helpers in `lib/build-specs/`. The master public app does not mount routes, nav, or sitemap entries. Do not add dashboard CRUD or a second enquiry target. Standing reference: `docs/architecture/build-specs.md`.

## Security

Trust boundaries (auth, RLS, public projections, storage, enquiry RPCs, secrets) are documented in `docs/architecture/security.md`.
