# Deals

Standing reference for operator-sourced promotional offers attached to a Listing.

## Why Deal is its own table

A Deal is temporary. A Listing is not.

```text
ENTITY
   │
   ▼
LISTING
   │
   ▼
 DEAL
```

Do not add `deal_title`, `deal_code`, or `deal_expiry` to `listings`. When the offer ends, the Listing continues unchanged. Historical Deal rows can remain for the operator.

Every Deal belongs to exactly one Listing (`deals.listing_id`). Deleting a Listing cascades its Deals. Deleting a Deal never deletes its Listing.

Do not attach Deals to Categories or Entities in V1.

## Current Deal

Stored state is small: `is_active`, optional `starts_at`, required `expires_at`.

Display state is derived in `lib/deals/current.ts`:

| Condition | State |
|---|---|
| `is_active = false` | Inactive |
| active, `starts_at` in the future | Scheduled |
| active, now is inside the window | Live |
| active, `expires_at` has passed | Expired |

A Deal is **current** only when it is Live.

```text
is_active = true
AND (starts_at is null OR starts_at <= now)
AND expires_at > now
```

No start date means the Deal is eligible immediately. Expiry is required so forgotten “special offers” cannot sit on the public site forever.

Public queries also require the parent Listing to be **active**. A Deal must never make an inactive Listing visible.

## Expiry does not use a cron job

Public pages decide current-ness at query time. When `expires_at` passes, the Deal stops appearing without anyone updating the row.

RLS for anonymous readers uses the same rule, so hiding expired Deals is not a UI-only check.

## One current Deal per Listing

The database allows multiple Deal rows per Listing so history is possible.

The application prevents two **active** Deals on the same Listing from having overlapping date windows. Adjacent windows that meet at expiry are allowed. Inactive Deals do not conflict.

This is validated server-side in `overlappingActiveDealError`. A PostgreSQL exclusion constraint was not added because the overlap rule is easier to read and test in TypeScript.

If two current Deals were ever present, public mapping would keep the one that expires soonest.

## Time

`starts_at` and `expires_at` are `timestamptz`.

The operator form uses `datetime-local`, so values are entered in the browser’s local timezone and stored as UTC. Dashboard and public expiry labels use `en-GB` formatting. That is enough for a UK-first clone. Do not add a timezone-picker product.

## Public projection

Anonymous readers must not receive arbitrary Deal rows.

`toPublicDeal()` exposes:

- `id`
- `headline`
- `description`
- `promo_code`
- `starts_at`
- `expires_at`

It does not expose operator-only fields. Promo code is public on purpose: visitors need it to claim the offer.

Public Listing cards and Listing detail pages attach the current Deal, if one exists. The generic master does not have a `/deals` page, homepage Deals section, or public Deals navigation. A Deal is discovered by browsing Listings.

## Promotion copy

`/dashboard/deals/[id]/promote` generates Facebook/general and short posts from structured Deal data.

Templates live in `lib/deals/promotion-templates.ts`. Copy is not stored. There is no AI and no social posting.

Public Listing URLs use `NEXT_PUBLIC_SITE_URL` from `lib/site-url.ts`. Set it to the public origin with no trailing slash, for example `http://localhost:3000`.

## What this is not

Deals are not coupons, checkout, Stripe, redemption tracking, analytics, targeting, or Entity-wide promotions.
