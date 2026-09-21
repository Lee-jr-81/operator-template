# Clone playbook

First document to open when turning OperatorTemplate into a new Operator Platform.

OperatorTemplate is a reusable starting point, not a multi-tenant SaaS product. One platform is one independent business with its own Git repo, Supabase project, domain, branding, listing details, and environment.

> **Use the template. Adapt the vertical deliberately. Do not turn this into a schema builder.**

Standing architecture: `docs/architecture/overview.md` and `docs/architecture/vertical-data-model.md`.

---

## Niche qualification

Before you copy, answer yes to these:

```text
Can the operator proactively seed supply?
Can Entities be identified and contacted directly?
Does Category → Entity → Listing represent the niche cleanly?
Can the operator add value through curation, Deals, content, or relationships?
Can the business begin without major capital or network effects?
```

If not, OperatorTemplate is probably the wrong foundation.

---

## Recommended sequence

```text
1. Copy OperatorTemplate into a new repository
2. Create a fresh Supabase project
3. Configure environment variables
4. Apply all base migrations
5. Disable public signup and create the operator user
6. Update business identity, branding, terminology, and SEO
7. Add a niche-specific listing_details migration
8. Update vertical types and listing UI
9. Replace brand assets
10. Seed Categories, Entities, Listings, and Articles
11. Test
12. Deploy
```

Identity values live in `config/` and `public/brand/`. See `docs/clone/configuration.md`.

Do not plan feature flags. Maps, Deals, WhatsApp, Enquiries, Articles, and homepage surfaces stay in the starter. If a niche does not need one, remove or adapt it in that clone.

Work through `docs/clone/checklist.md` as you go.

---

## Optional feature matrix

Developer planning only. There is no runtime settings screen for this.

| Capability | Typical default | How it is controlled |
|---|---|---|
| Categories | On | Core. A niche may have one Category. |
| Entities | On | Core |
| Listings | On | Core |
| Location | Depends | Attach to Entity, Listing, both, or neither in code |
| Maps | Depends | Listing detail map when coordinates exist |
| UK postcode geocoding | UK location niches | `lib/location/postcodes-io.ts`; replace or skip for non-UK |
| Deals | Optional | Omit dashboard/public Deal UI in the clone if unused |
| WhatsApp | Optional | Appears when the Entity has a usable phone |
| Enquiries | Optional | Appears when the Entity has a usable email |
| Articles | Usually useful | Keep unless the niche has no content motion |
| Build Specs | Unused | Config kept; no public routes |

Do not add feature flags for every row. Edit code and copy for that clone.

---

## Guides in this folder

| Document | Use it for |
|---|---|
| [configuration.md](configuration.md) | Business name, brand assets, colours, fonts, SEO, terminology |
| [listing-adaptation.md](listing-adaptation.md) | Changing Listing fields, forms, cards, detail |
| [terminology.md](terminology.md) | Public labels vs stable internal names |
| [location.md](location.md) | Entity vs Listing location, maps, geocoding |
| [features.md](features.md) | Categories, Entities, Deals, contact, CMS, homepage |
| [supabase-setup.md](supabase-setup.md) | New Supabase project, Auth, migrations, Storage |
| [deployment.md](deployment.md) | Vercel + production smoke test |
| [seed-data.md](seed-data.md) | First Categories, Entities, Listings, Articles |
| [checklist.md](checklist.md) | Repeatable clone QA |

---

## What you should not do

- Do not turn OperatorTemplate into a no-code schema builder
- Do not add multi-tenancy
- Do not reintroduce a public `/deals` index or homepage Deals section in the template
- Do not persist Build Spec enquiries
- Do not enable public signup
- Do not start post-V1 features (search, CRM, payments, accounts) unless evidence demands them
