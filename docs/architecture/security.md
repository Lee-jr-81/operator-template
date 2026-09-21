# Security

Standing reference for OperatorTemplate trust boundaries.

OperatorTemplate is a single-operator application. There is no public signup in the product. **Production must keep Supabase Auth public signup disabled.** Any `authenticated` session currently has operator-level RLS write access. The app gate is `requireOperator()`; the database gate is “authenticated”. Do not leave open registration.

## Authentication

- Dashboard routes are gated by `proxy.ts` and `app/dashboard/layout.tsx` (`requireOperator()`).
- Every operator server action calls `requireOperator()` before mutations.
- UI hiding is not authorization. RLS denies anonymous writes on all domain tables.

## Public vs private data

Anonymous readers use public-safe projections:

- Listings: `status = active` in both application queries and RLS
- Articles: `published` and `published_at <= now()`
- Entities: `entity_public` only, and only Entities that currently have at least one active Listing
- `entity_public` never includes `contact_name`, `operator_notes`, or street address lines
- Enquiries and WhatsApp clicks are not granted to `anon`

`listings.is_featured`, Article relationships, and Deals never override Listing public eligibility.

Build Specs are unused TypeScript config in the master. They are not mounted on public routes. Do not store secrets in `config/build-specs.ts`.

## Validation

Untrusted input is validated in server actions. Public enquiry `listing_id` must be a UUID. ID getters return `null` for malformed IDs instead of querying Postgres.

Public enquiry inserts go through `submit_public_enquiry()`. The function checks field lengths and a simple email shape, then that the Listing is active and the Entity has an email. Direct RPC callers cannot pick a recipient.

## Sanitisation

The only `dangerouslySetInnerHTML` use is Article body HTML from `renderArticleMarkdown()`. Markdown is sanitized with an allowlist. `javascript:` and `data:` URLs are not allowed.

Other operator copy is rendered as React text.

## Storage

Buckets `listing-media`, `article-media`, `category-media`, and `entity-logos` are public so Listing/Article/Category/Entity images can be served by URL. Uploads are operator-only. The server checks JPEG/PNG/WebP **magic bytes**, not the client MIME type alone. Buckets also set `allowed_mime_types` and `file_size_limit`.

Object URLs can outlive a draft Article or inactive Listing if the path is known. Paths are UUID-scoped. Delete replaced objects. Do not treat a public object URL as a private authorization check.

## Service-role key

`SUPABASE_SECRET_KEY` is server-only (`lib/supabase/admin.ts`). It is used only to load Entity email after an Enquiry is stored, because `anon` cannot SELECT `entities`. It is never imported into Client Components.

If the secret is unset, the Enquiry still stores; mail is skipped.

## Privileged RPCs

`submit_public_enquiry`, `record_whatsapp_click`, and `get_listing_contact_channels` are `SECURITY DEFINER` with `search_path = ''` and fully qualified names. They grant execute to `anon` because visitors have no accounts. They no-op or error unless the Listing is active.

Rate limiting and CAPTCHA are not in V1. Add them if abuse appears.

## Environment

Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` are public. `RESEND_API_KEY` and `SUPABASE_SECRET_KEY` must never use a `NEXT_PUBLIC_` prefix. `.env*` files are gitignored except `.env.example`.
