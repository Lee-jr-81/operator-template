# Feature adaptation

How the existing capabilities should be used or left alone in a clone.

---

## Categories

Categories organise **Listings**, not Entities.

Examples:

```text
Dog Services     → Walkers / Groomers / Trainers
Track days       → Training / Tyres / Transport / Track Days
Agricultural     → Tractors / Harvesters / Attachments
```

A niche may have one Category. That is fine. Do not add Category hierarchy unless a later niche genuinely needs it.

Homepage Browse Categories only shows Categories that currently have at least one active Listing.

There is no public Entity directory.

---

## Entities

An Entity is the business, person, or organisation responsible for Listings.

Examples: dealer, provider, breeder, trainer, employer, venue, specialist business.

Usually stable fields:

- name, slug
- contact details (email, phone, website, WhatsApp source number)
- public/hide flags for published contact text
- location, when the niche uses it
- operator notes (never public)

Change public labels in copy. Do not add Entity Types to solve terminology.

`entity_public` is the only anonymous Entity projection. It only includes Entities that currently have an active Listing. It never includes `contact_name`, `operator_notes`, or street lines.

---

## Deals

```text
Deal → Listing
```

A Deal is optional promotional value on a Listing. It is not a second catalogue.

Generic public behaviour:

- current Deal can show as a Listing card badge and a detail panel
- no `/deals` page
- no homepage Deals section
- no public Deals nav item

A niche that wants Deal-first browsing can add that later in the clone. Do not put it back on the master.

If a niche will not use Deals, you may hide dashboard Deal nav in that clone. Do not delete the table from the master.

---

## Contact

```text
Listing
   ↓
Entity contact details
   ↓
WhatsApp and/or Enquiry
```

### WhatsApp

- Direct visitor → Entity
- Button only when a usable phone exists
- Click is recorded as Listing + timestamp
- A click is not an Enquiry

### Enquiry

- Stored first against `enquiries.listing_id`
- Emailed to the Entity when mail is configured
- Operator receives a notification
- Operator does not relay messages by hand

If a niche needs a different model (phone-only, no WhatsApp, booking forms), change that clone explicitly. Do not add polymorphic enquiry targets. Build Specs stay off that table.

Standing references: `docs/architecture/contact.md`, `docs/architecture/enquiries.md`.

---

## CMS (Articles)

- Markdown body, draft/published
- AI Writing Helper copies a prompt; OperatorTemplate never calls an AI API
- The public Article shows the three latest active Listings for its Category
- Social promotion drafts are clipboard copy, not posting
- Public label can become Guides / Journal in the clone

Do not restore Guided Article Creation. That flow was rejected.

Standing reference: `docs/architecture/cms.md`.

---

## Homepage

The homepage is developer-controlled Next.js. The operator controls records, not layout.

Current data-driven sections (omitted when empty):

1. Browse Categories
2. Featured Listings (`listings.is_featured` and active)
3. Recently Added
4. Latest Articles

There is no homepage builder and no Current Deals section. Featured Listing is the small merchandising control.

A niche clone restyles or recomposes `/` in code.

Standing reference: `docs/architecture/homepage.md`.

---

## Build Specs

Unused in the master. Config and helpers remain in the repo; there are no public routes or nav. Leave them dormant unless a future niche explicitly needs that surface.

Standing reference: `docs/architecture/build-specs.md`.
