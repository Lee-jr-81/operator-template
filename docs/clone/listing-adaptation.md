# Listing adaptation

Practical steps for changing Listing data when cloning a niche.

The reusable Listing row stays small: title, slug, summary, description, Category, Entity, status, featured flag, SEO fields, timestamps.

Niche facts live on `listing_details` (1:1 with `listings.id`).

> **OperatorTemplate does not eliminate developer work. It localises and makes that work predictable.**

Standing rules: `docs/architecture/vertical-data-model.md`.

---

## 1. Identify the Listing concept

Write one sentence: what is a visitor actually browsing?

Examples: a boarding stay, a tractor, a wedding photography package, a job.

If that sentence is fuzzy, stop. Category → Entity → Listing may not fit.

---

## 2. Identify fields that remain generic

Keep on `listings`:

- title, slug, summary, description
- category_id, entity_id
- status (`active` / `inactive`)
- is_featured
- seo_title, seo_description

Do not put price, hours, breed, or package type on `listings`. Those shapes change per niche.

---

## 3. Define niche-specific fields

The starter `listing_details` columns shipped in the base migrations are:

- `service_format`
- `price_text`
- `duration_text`

Replace them with a **new** follow-on migration. Do not keep unused starter columns in a real platform.

Examples of other niches:

**Dog Services**

```text
duration
service_area
group_size
price
```

**Agricultural machinery**

```text
manufacturer
model
year
hours
price
condition
```

**Wedding services**

```text
package_type
coverage_hours
guest_capacity
price
```

Prefer ordinary columns and constraints over JSON.

---

## 4. Create a migration

Do not edit applied master migrations. Add a new SQL file under `supabase/migrations/` that:

- drops or replaces the starter `listing_details` columns
- adds the new columns and checks
- keeps `listing_details.listing_id` as PK with `ON DELETE CASCADE`

Apply it with the rest of the history. See `docs/clone/supabase-setup.md`.

---

## 5. Update TypeScript types

Change:

- `lib/listings/vertical.ts`
- `server/listings/types.ts` if the selected columns change
- query `select(...)` strings that name `listing_details` columns

---

## 6. Update validation

Two layers:

1. Generic Listing rules in `server/listings/validation.ts`
2. Vertical rules in `lib/listings/vertical-validation.ts`

Keep both as ordinary functions. Do not add a schema-driven form engine.

---

## 7. Update dashboard create/edit

Niche inputs live in `components/listings/vertical-fields.tsx`.

The shared form (`app/dashboard/listings/listing-form.tsx`) should keep calling that component. Do not scatter vertical fields across unrelated dashboard pages.

---

## 8. Update the public card

Extra card lines belong in `components/listings/vertical-card.tsx`.

The generic `ListingCard` already shows image, title, summary, Category, Entity, Added on date, and current Deal badge. Price and duration belong in `vertical-card.tsx` as the compact price/duration row.

---

## 9. Update Listing detail

Extra detail blocks belong in `components/listings/vertical-detail.tsx`.

Leave gallery, Entity block, map, Deal panel, and contact area in place unless the niche truly does not use them.

---

## 10. Update filters only if the niche needs them

There is no universal filter engine. Add a public filter only when visitors will actually use it.

There is currently no `lib/listings/vertical-filters.ts`. Create one in the clone if required. Do not add unused filter UI to the master.

---

## 11. Update seed/demo data

Replace starter example wording. See `docs/clone/seed-data.md`.

---

## 12. Test public/private behaviour

- Inactive Listings 404 on the public site
- Draft Articles stay private
- `listing_details` on a public page contains only what you intended to show
- Duplicate Listing still starts inactive and not featured
- Enquiry and WhatsApp still require an active Listing

---

## What should not normally change

Leave these unless the niche has a documented reason:

- Auth and dashboard shell
- Category / Entity / Listing relationship
- Listing media bucket and duplicate behaviour
- Deal table shape
- Enquiry `listing_id` ownership and privileged contact/enquiry RPCs
- Article model
- `entity_public` privacy rules
- RLS “anon cannot write”
