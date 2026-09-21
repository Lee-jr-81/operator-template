# Vertical data model

Standing reference for how OperatorTemplate separates reusable core data from niche-specific Listing data.

Read this before adding Listing fields, forms, cards, filters, or a new niche clone.

> **OperatorTemplate is not designed to remove developer work when creating a niche marketplace. It is designed to make that work predictable, localised and fast.**

> **Stable core. Deliberate vertical adaptation. No magic.**

---

## 1. The question this document answers

**What belongs in the reusable OperatorTemplate core, and what should deliberately change when a new niche is built?**

OperatorTemplate can later support agricultural machinery, dog services, dog breeders, weddings, track days, specialist job boards, and other product, service, asset, event, package, job, or opportunity verticals.

Those businesses share a relationship. They do not share a detailed Listing schema.

Do not pretend they do. Do not build a dynamic schema system so a developer never has to touch the code.

---

## 2. Core relationship

This relationship is reusable across verticals:

```text
             CATEGORY
                 │
                 ▼
ENTITY ─────► LISTING
                 │
                 ▼
              MEDIA
```

- **Category** classifies a Listing and supports public discovery.
- **Entity** is the supply-side party responsible for the Listing.
- **Listing** is the main public thing people discover.

Every Listing belongs to one Category and one Entity.

Public labels may change per niche (`Dealer`, `Breeder`, `Employer`). Internal names stay `Category`, `Entity`, and `Listing`. Do not build a dynamic terminology engine.

Later relationships hang off Listing. They must not force Listing into a universal field set:

```text
Listing
  ├── listing_details     (1:1, niche-specific — this clone only)
  ├── listing_media       (1:many images; generic)
  ├── deals               (1:many; at most one current Deal is public)
  ├── enquiries           (1:many visitor leads; generic)
  └── article_listings    (many-to-many with Articles; editorial)
```

Those tables now exist. This document remains the ownership map so a clone does not paint Listing into a universal field set.

---

## 3. Niche qualification

OperatorTemplate is for operator-led verticals, not every conceivable marketplace.

A niche is a strong fit when:

1. Categories make sense (one or many).
2. There are identifiable Entities the operator can contact.
3. Those Entities can provide concrete Listings.
4. The operator can proactively seed supply.
5. Location and/or discovery add value.
6. Deals or other operator-created value are plausible.
7. The audience has a realistic low-capital distribution route.

If a proposed niche fails this test, it probably should not be built from OperatorTemplate.

---

## 4. What stays reusable

These concepts belong to the OperatorTemplate master. Implement them once, then keep them as the clone's operating system.

These are implemented in the V1 master except where the table says later.

| Area | Why it stays core |
|---|---|
| Authentication and dashboard shell | One operator per clone |
| Categories | Generic discovery structure |
| Entities | Generic supply-side party |
| Generic Listing core | Identity, relationships, status, timestamps |
| Listing media infrastructure | Upload, order, primary image |
| Deals | Operator-sourced offers on a Listing |
| Enquiries | Demand captured against a Listing |
| CMS Lite and article↔Listing links | Content supporting discovery |
| Social promotion tooling | Copy generated from Deal or Article data; no social APIs |
| Location engine | Reusable geography; this clone attaches it to Entity |
| Maps used through that engine | Listing detail map when coordinates exist |
| Analytics / dashboard metrics | Operator command centre — later |
| SEO / metadata foundations | Page titles, descriptions, canonicals, sitemap |
| Public shell / layout | Surfaces stay; content is data-driven |
| Generic status handling | Active/inactive and similar |
| Common UI primitives | Button, Input, Card, layout |

A clone should not fork these unless the niche has a real, documented reason.

---

## 5. What changes per niche

A developer adapting a clone should not have to search the whole application.

Keep niche-specific work in a small, obvious set of places:

```text
supabase/migrations/*_listing_details*.sql   (add a new file; do not rewrite history)
lib/listings/vertical.ts
lib/listings/vertical-validation.ts
components/listings/vertical-fields.tsx      dashboard create/edit fields
components/listings/vertical-card.tsx        extra card metadata
components/listings/vertical-detail.tsx      extra public detail blocks
```

Public filters/search extras are optional. Add them in the clone only when the niche needs them.

Clone steps: `docs/clone/listing-adaptation.md`.

Change these during a niche build:

- niche `listing_details` migration and types
- Listing create/edit form fields
- Listing validation
- dashboard table columns that show vertical data
- public Listing card metadata
- public Listing detail blocks
- search fields beyond title
- filters the niche actually needs
- public terminology and helper copy
- whether location attaches to Entity, Listing, or both

If a change does not fit one of those places, stop and ask whether it is really niche-specific or a missing core feature.

### Clone question

> **Where do I go to change this marketplace from Track Days to Agricultural Machinery?**

1. Replace `listing_details` columns and `lib/listings/vertical*`.
2. Replace the vertical form, card, detail, and filter UI.
3. Decide location attachment for that niche.
4. Change public labels and helper text.
5. Leave Category, Entity, auth, dashboard shell, Deals, Enquiries, and CMS structure in place.

---

## 6. Category

Category is generic and first-class. It belongs in the reusable master.

Every Listing belongs to a Category. A niche may use one Category, several, or many. Do not add complexity when a niche only needs one.

Category also supports filtering, homepage Browse Categories, and further SEO landing-page work.

The `categories` table is implemented. Public URLs use slugs, not IDs: `/categories` and `/categories/[slug]`. There is no Category hierarchy, imagery, or ordering system.

`listings.category_id` uses `ON DELETE RESTRICT`, so a Category that still has Listings cannot be deleted. The operator sees a safe message and must move or delete those Listings first.

Examples:

| Niche | Example Categories |
|---|---|
| Agricultural machinery | Tractors, Telehandlers, Implements |
| Dog services | Walking, Boarding, Training |
| Dog breeders | Labrador, Cocker Spaniel (or a single “Litters” category) |
| Weddings | Photography, Venues, Catering |
| Specialist jobs | BMS Commissioning, Controls Engineering |

---

## 7. Entity

Entity is generic and first-class. It belongs in the reusable master.

Every Listing belongs to an Entity. OperatorTemplate does not use a generic Entity Type system. If a niche later needs extra classification, add it in that niche build.

Internal name stays `Entity`. Public labels are ordinary copy changes:

| Niche | Public label examples |
|---|---|
| Agricultural machinery | Dealer |
| Dog services | Provider |
| Dog breeders | Breeder |
| Weddings | Supplier |
| Specialist jobs | Employer |

The `entities` table is implemented. There is no Entity Type system, no public Entity directory, and no location columns.

`listings.entity_id` uses `ON DELETE RESTRICT`. An Entity that still has Listings cannot be deleted until those Listings are moved or deleted.

Private vs public:

- Operator-only: `contact_name`, `operator_notes`, and any email/phone/website not marked public.
- Anonymous access uses the `entity_public` view / `getPublicEntityById()`, never a full `entities` row. The view only includes Entities that currently have at least one active Listing.
- `show_email`, `show_phone`, and `show_website` are explicit booleans. Default is hidden.

Slug exists as a stable identifier. There is no `/entities/[slug]` public page in this slice.

---

## 8. Generic Listing core

The reusable `listings` table is implemented and stays small. Most niche fields do not belong on it.

Current core columns:

| Field | Why it is core |
|---|---|
| `id` | Identity |
| `title` | Every Listing needs a public name |
| `slug` | Public URL |
| `summary` | Short card/search text |
| `description` | Longer generic body; vertical tables hold structured facts |
| `category_id` | Required relationship (`ON DELETE RESTRICT`) |
| `entity_id` | Required relationship (`ON DELETE RESTRICT`) |
| `status` | Operational state: `active` or `inactive` |
| `is_featured` | Operator merchandising flag for homepage Featured Listings. Default false. Does not bypass `status = active`. |
| `seo_title` | Optional; empty falls back to title |
| `seo_description` | Optional; empty falls back to summary |
| `created_at`, `updated_at` | Operational timestamps |

Do not add price or location to `listings`. Public queries also filter `status = 'active'` in application code, in addition to RLS.

### Decision rule for new Listing columns

Put a field on `listings` only if **all** of the following are true:

1. Most niches need it in roughly the same shape.
2. Core workflows (dashboard table, public card, SEO, Deals, Enquiries) need it without understanding the niche.
3. It is not really a location, price-shape, or other vertical fact wearing a generic name.

Otherwise it belongs on `listing_details`.

Common is not the same as universal. **Price** is common, but the shape is not: asking price, package price, salary band, POA, and “from £X per night” are different. Keep commercial fields on `listing_details`. If a later slice proves a shared display hint is needed, add an optional core column then — do not invent it now.

**Location** is common, but the attachment point is not. See [Location](#11-location). Do not put location columns on `listings` by default.

---

## 9. Vertical extension pattern

Use one explicit 1:1 table per clone:

```text
listings
   └── listing_details     (1:1 on listings.id)
```

`listing_details` is the table name in every clone. The **columns** change per niche. One OperatorTemplate clone is one vertical, so there is no need for `agricultural_machinery_details` vs `job_details` as separate tables in the same app.

Name the niche in the migration comment and in `lib/listings/vertical.ts` so a reader knows which vertical this clone is.

The base migrations ship **starter listing_details columns**. Replace them with a follow-on migration when cloning a real niche:

- `service_format`
- `price_text`
- `duration_text`

They are optional free-text fields. Price lives here on purpose: it is not a generic `listings` column.

```text
listings.id  =  listing_details.listing_id
```

Listing images are generic, not vertical. They live in `listing_media` (`listing_id` → `listings.id`, `ON DELETE CASCADE`). Path convention: `{listingId}/{mediaId}.jpg|png|webp` in the `listing-media` bucket. At most one `is_primary` row per Listing. Duplicate Listing copies the generic row and `listing_details`, starts inactive, and does not copy media.

Principles:

- Generic fields stay on `listings`.
- Niche fields live on `listing_details`.
- The join is a normal foreign key, easy to trace.
- A developer adapts the extension table and the files in section 5.
- Do not use entity-attribute-value.
- Do not store ordinary structured niche data in untyped JSON just to avoid a migration.
- Do not build a second Listing type system.

If a future niche genuinely needs two different Listing shapes in one clone, stop and design that clone explicitly. Do not solve it in the master with polymorphism.

---

## 10. Why Listing detail stays vertical

These niches do not share a useful detailed schema. That is expected.

### Agricultural machinery

`listing_details` might include manufacturer, model, year, hours, power, condition, attachments, and machine-specific notes. Location often belongs on both the dealer (Entity) and the machine (Listing).

### Dog services

The starter vertical uses `service_format`, `price_text`, and `duration_text`. A real clone should replace these with fields that match the niche. Location often belongs on the provider (Entity).

### Dog breeders

`listing_details` might include breed, date of birth, ready date, number available, parent details, and health-testing notes. Location often belongs on the breeder (Entity).

### Weddings

`listing_details` might include package type, included services, capacity, pricing, and lead time. Location may be the supplier base (Entity), a venue on the Listing, or both.

### Specialist job boards

`listing_details` might include salary/rate, employment type, remote/hybrid/on-site, experience requirements, closing date, and application route. Location usually belongs on the Listing (the job), not only the employer.

---

## 11. Location

Location is a first-class reusable capability. Its **attachment point is niche-dependent**.

A niche may attach location to:

- Entity
- Listing
- both

| Niche | Typical attachment |
|---|---|
| Dog services / kennel | Entity |
| Dog breeders | Entity |
| Track day | Listing |
| Specialist job | Listing |
| Agricultural machinery | Often both (dealer and machine) |
| Wedding photographer | Entity base; service area may come later |

Do not hard-wire location to one domain object in the template. The Location engine is implemented. This template attaches it to **Entity** (`entities.location_id`). See `docs/architecture/location.md`.

---

## 12. Deals, enquiries, and articles

**Deals** belong to a Listing and are implemented. See `docs/architecture/deals.md`.

```text
Listing
   └── Deal
```

A Listing may have no current Deal. Do not put Deal fields on `listings`.

**Enquiries** belong to a Listing, and reach the Entity through that Listing. They are implemented. See `docs/architecture/enquiries.md`.

```text
Enquiry → Listing → Entity
```

**Articles** may reference selected Listings through `article_listings`. The operator chooses the links. Public Article pages show only active Listings. See `docs/architecture/cms.md`.

```text
Article ↔ Listings
```

---

## 13. Validation

Two explicit layers. Do not merge them into one universal schema.

**Generic Listing validation** (reusable):

- title required
- slug valid and unique where applicable
- Category required
- Entity required
- status valid
- summary/description length limits as needed

**Vertical validation** (this clone only), for example:

- machinery year is a plausible year
- job closing date is a valid date
- litter ready date is present
- service duration is present
- event date is present

Keep both layers as ordinary functions next to the data they validate. Do not build a schema-driven validator.

---

## 14. UI

Some Listing UI is reusable. The rest is adapted in code.

**Reusable:**

- page shell
- title / identity
- Category selection
- Entity selection
- status control
- generic summary/description
- media section
- save/update actions

**Adapted per niche:**

- `listing_details` form fields
- extra dashboard table columns
- extra card metadata
- extra detail-page blocks
- niche filters
- niche search fields

Do not create a schema-driven form renderer, card builder, or detail-page builder.

---

## 15. Search and filters

Do not design a universal filter engine.

- Generic search may cover universal fields such as title (and later Category).
- Niche-specific searchable fields are added during adaptation.
- Niche-specific filters are built for that niche's users.
- Category and Location may later provide reusable filter foundations.
- A niche should have exactly the filters it needs, not a generic super-filter.

---

## 16. Relational design

Favour normal PostgreSQL:

- ordinary tables
- explicit foreign keys
- 1:1 for `listing_details`, 1:many for media, deals, enquiries
- migrations as the schema source of truth
- readable constraints
- indexes when queries justify them

Avoid:

- JSON blobs for ordinary structured niche data
- generic key/value stores
- EAV
- polymorphic “this id might be anything” designs unless a later slice proves a real need

A developer should understand the niche by reading `listings` plus `listing_details` in the migrations.

---

## 17. Rejected approaches

Do not introduce:

- custom-field builders
- dynamic database columns
- entity-attribute-value models
- admin-configurable Listing schemas
- no-code form builders
- generic filter / card / detail-page builders
- untyped JSON as a substitute for `listing_details`

Those fight the maintainability standard. Developer adaptation is expected and preferred.

---

## 18. Adaptation checklist

When cloning OperatorTemplate into a new niche:

1. Confirm the niche passes the [qualification test](#3-niche-qualification).
2. Keep Category, Entity, and the generic Listing core.
3. Design `listing_details` columns for that niche only.
4. Adapt vertical types, validation, forms, cards, detail, and filters.
5. Choose location attachment: Entity, Listing, or both.
6. Change public labels and helper text. Do not add a terminology engine.
7. Leave auth, dashboard shell, Deals, Enquiries, CMS, and media infrastructure in place unless a real niche requirement says otherwise.

---

## 19. Scope of this document

The ownership model above is implemented. Follow this document when adapting a platform; do not treat older planning notes as a backlog.

Practical clone steps live in `docs/clone/`.

Practical clone steps live in `docs/clone/`.
