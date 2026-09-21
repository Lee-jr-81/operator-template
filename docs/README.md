# OperatorTemplate documentation

Standing documentation for creating and adapting an Operator Platform from this template.

## Layout

```text
docs/
  README.md                 This map
  clone/                    How to create a new platform
  architecture/             How the current system works
  design/                   Public and dashboard design systems
  tests/
    dashboard-styling-qa.md Operator dashboard visual QA
```

## Start here

1. Root [`README.md`](../README.md) — bootstrap sequence
2. [`clone/README.md`](clone/README.md) — clone playbook
3. [`architecture/overview.md`](architecture/overview.md) — current system
4. [`architecture/vertical-data-model.md`](architecture/vertical-data-model.md) — Listing adaptation rules
5. [`AGENTS.md`](../AGENTS.md) — engineering rules

## Clone playbook

| Document | Use it for |
|---|---|
| [clone/README.md](clone/README.md) | Sequence and what not to do |
| [clone/configuration.md](clone/configuration.md) | Name, brand, colours, fonts, SEO, terminology |
| [clone/listing-adaptation.md](clone/listing-adaptation.md) | `listing_details` follow-on migration and UI |
| [clone/terminology.md](clone/terminology.md) | Public labels vs stable internal names |
| [clone/location.md](clone/location.md) | Entity vs Listing location, maps, UK postcode toggle |
| [clone/features.md](clone/features.md) | Categories, Entities, Deals, contact, CMS, homepage |
| [clone/supabase-setup.md](clone/supabase-setup.md) | New Supabase project, Auth, migrations, Storage |
| [clone/deployment.md](clone/deployment.md) | Vercel + production smoke test |
| [clone/seed-data.md](clone/seed-data.md) | First Categories, Entities, Listings, Articles |
| [clone/checklist.md](clone/checklist.md) | Repeatable platform QA |

## Architecture

| Document | Use it for |
|---|---|
| [architecture/overview.md](architecture/overview.md) | Surfaces, folders, trust boundaries |
| [architecture/engineering-standards.md](architecture/engineering-standards.md) | Production bar |
| [architecture/vertical-data-model.md](architecture/vertical-data-model.md) | Category → Entity → Listing |
| [architecture/location.md](architecture/location.md) | Locations and maps |
| [architecture/deals.md](architecture/deals.md) | Deals |
| [architecture/enquiries.md](architecture/enquiries.md) | Enquiries |
| [architecture/contact.md](architecture/contact.md) | WhatsApp and enquiry mail |
| [architecture/cms.md](architecture/cms.md) | Articles |
| [architecture/homepage.md](architecture/homepage.md) | Public homepage |
| [architecture/build-specs.md](architecture/build-specs.md) | Dormant Build Specs |
| [architecture/security.md](architecture/security.md) | Auth, RLS, public exposure |

## Design

| Document | Use it for |
|---|---|
| [design/public-design-system.md](design/public-design-system.md) | Public site tokens and components |
| [design/dashboard-design-system.md](design/dashboard-design-system.md) | Operator dashboard |

Do not reconstruct the schema from these documents. Migrations in `supabase/migrations/` are the source of truth.
