# Supabase setup

How to stand up a new clone’s database, Auth, and Storage.

Do not reconstruct the schema by hand. Apply the migration files in `supabase/migrations/` in filename order.

---

## Sequence

```text
Create Supabase project
      ↓
Configure Auth (disable public signup)
      ↓
Apply migrations in order
      ↓
Confirm Storage buckets
      ↓
Create the operator user
      ↓
Add environment variables
      ↓
Verify public vs private access
```

---

## 1. Create the project

Create a new Supabase project for this clone only. Do not share a database across niches.

Copy the project URL and keys from **Settings → API Keys**:

- Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Secret key → `SUPABASE_SECRET_KEY` (server only)

---

## 2. Auth

OperatorTemplate has no registration UI.

In production:

1. Authentication → Providers / sign-ups
2. Disable public signup

Create the operator under **Authentication → Users**.

Any authenticated session currently has operator-level RLS writes. Signup must stay off.

---

## 3. Apply migrations

Files in `supabase/migrations/` are the schema source of truth. Current order:

```text
20260816143000_create_categories.sql
20260816150000_create_entities.sql
20260816160000_create_listings.sql
20260816170000_create_listing_media.sql
20260816180000_create_locations.sql
20260818190000_create_deals.sql
20260819160000_create_enquiries.sql
20260820120000_contact_flow.sql
20260821153000_create_articles.sql
20260821180000_create_article_listings.sql
20260821190000_listings_is_featured.sql
20260821200000_production_hardening.sql
20260824183000_category_images.sql
```

Apply with the linked CLI (`npx supabase db push`) or paste them in order in the SQL editor.

Later clones add new timestamped files. Do not rewrite history on a live project.

Production hardening is already in `20260821200000_production_hardening.sql`. It must run. It tightens `entity_public`, privileged RPC `search_path`, enquiry field checks, storage MIME/size, and enquiry UPDATE grants.

---

## 4. Storage

Migrations create the public image buckets (`listing-media`, entity logo, `article-media`, `category-media`) with operator-only writes and public reads.

Confirm those buckets exist after migrate. Do not add a Build Specs bucket.

---

## 5. Environment variables

See `.env.example`. After migrate, copy `.env.example` to `.env.local` and fill values.

---

## 6. Verify access

Signed out:

- Active Listings and published Articles load
- Inactive Listings and draft Articles 404
- Dashboard redirects to login
- `entity_public` does not expose street address, `contact_name`, or `operator_notes`

Signed in as the operator:

- Dashboard CRUD works
- Public pages still hide drafts and inactive Listings
