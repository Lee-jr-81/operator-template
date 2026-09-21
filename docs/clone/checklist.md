# Clone checklist

Use this on every future niche build.

## Business / niche

- [ ] Niche qualified (operator can seed supply)
- [ ] Seed-supply route identified
- [ ] Domain and branding decided
- [ ] `config/business.ts`, `config/branding.ts`, `config/seo.ts`, and `config/terminology.ts` updated
- [ ] Files in `public/brand/` replaced
- [ ] Public labels for Entity / Listing / Article decided

## Data

- [ ] Categories defined
- [ ] Entity terminology decided (copy only)
- [ ] Listing schema adapted (`listing_details` + vertical files)
- [ ] Location attachment decided (Entity, Listing, both, neither)
- [ ] Starter `listing_details` columns removed or replaced

## Feature decisions

Starter capabilities stay in the codebase. There is no feature-flag file. If this clone will not use one, remove or hide it in code.

- [ ] Deals kept or omitted in this clone
- [ ] Maps / geocoding kept or omitted
- [ ] Contact channels (WhatsApp, Enquiry) reviewed
- [ ] Articles kept or omitted
- [ ] Leave Build Specs dormant (no public routes; config may remain unused)

## Infrastructure

- [ ] New Supabase project
- [ ] Migrations applied in order, including hardening
- [ ] Auth public signup disabled
- [ ] Operator user created
- [ ] Storage buckets present
- [ ] `.env` / Vercel env complete
- [ ] Mail configured or deliberately skipped
- [ ] Vercel project + production URL
- [ ] Domain DNS

## QA

- [ ] Dashboard CRUD for Category, Entity, Listing, Deal, Article, Enquiry
- [ ] Public marketplace: homepage, listings, categories, articles
- [ ] Inactive Listing and draft Article 404
- [ ] Contact: WhatsApp and/or Enquiry on an active Listing
- [ ] Related Listings on a published Article
- [ ] Social promotion copy copies to clipboard
- [ ] Mobile: public nav, cards, Listing detail, dashboard nav, forms
- [ ] Keyboard: skip link, forms, dialogs, focus visible
- [ ] Security: no public signup, no secrets in client, no draft leakage
- [ ] `npm run test`, `lint`, `typecheck`, `build`
- [ ] `npm audit` reviewed
