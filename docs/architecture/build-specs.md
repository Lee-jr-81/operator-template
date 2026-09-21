# Build Specs

Standing reference for a **dormant** developer-managed offering type.

Build Specs describe stable packages or models in TypeScript config. They are not marketplace inventory and are **not mounted** on the master public site.

```text
Listings   → operator-managed inventory (database)
Build Specs → unused config + helpers (kept for a future clone)
```

The public app has no `/build-specs` routes, no nav item, and no sitemap entries. Config remains at `config/build-specs.ts`. Accessors remain at `lib/build-specs/public.ts`.

Do not add dashboard CRUD, a database table, or Build Spec enquiries.

To use this later in a clone: add public pages that call `listPublicBuildSpecs()`, then add nav and sitemap only if that niche needs them.

## Configuration

Source: `config/build-specs.ts`

Helpers: `lib/build-specs/public.ts`

Shape:

- feature `enabled` (unused by the current public app)
- overview title and intro
- items with `slug`, `title`, `summary`, `description`, optional hero image, specification groups, optional display `priceText`, optional CTA, optional SEO fields, and per-item `enabled`

There is no operator toggle.

## Assets

Optional `heroImageSrc` would be a path under `public/`. There is no upload UI and no Supabase bucket.

## Enquiry

Enquiries belong to a Listing (`enquiries.listing_id`). Do not add a Build Spec enquiry target.

## Security

- Config is compile-time public copy. Do not put secrets in `config/build-specs.ts`.
- The master public app does not render this config.
- No RLS, RPCs, or storage policies for Build Specs.
