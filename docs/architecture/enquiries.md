# Enquiries

Standing reference for visitor leads generated from a Listing.

Contact channels (WhatsApp vs Enquiry, mail after persist) are documented in `docs/architecture/contact.md`. This file is the Enquiry table itself.

## Why Enquiry belongs to Listing

```text
ENTITY
   ↓
LISTING
   ↓
ENQUIRY
```

A visitor is interested in a specific Listing. Entity context is `enquiry.listing_id → listings.entity_id`.

Do not store `entity_id` on `enquiries`. Duplicating it would drift when a Listing is moved between Entities.

Do not attach Enquiries to Deals. A Deal is a temporary offer on a Listing. The Enquiry is still about the Listing.

Do not attach Enquiries to Build Specs. Build Specs are unused config in the master, not inventory, and have no public pages. See `docs/architecture/build-specs.md`.

## Status

Stored values are only:

- `new` (default) — operator has not reviewed it
- `reviewed` — operator has acknowledged it
- `closed` — no further operator attention is required

This is not a CRM pipeline and does not record whether the Entity contacted the buyer. The status field was renamed because the Entity now receives the Enquiry automatically.

## Public submission

Visitors have no accounts. They submit from the Listing detail page, and only when the owning Entity has a usable email.

Anonymous users cannot `SELECT`, `UPDATE`, or `DELETE` `enquiries`. The table is not granted to `anon`.

Inserts go through `submit_public_enquiry()`, a `SECURITY DEFINER` function (`search_path = ''`) that:

1. checks name/email/message lengths and a simple email shape
2. checks the Listing is `active` and the Entity has an email
3. inserts `status = new`
4. returns the new row id to the server action only

The Next.js server action still validates fields (including UUID `listing_id`), rejects inactive/unknown Listings and Entities without email, and discards honeypot submissions before calling the function. The visitor success state does not include that id.

Authenticated operators may `UPDATE` `enquiries.status` only. They cannot rewrite visitor fields through PostgREST.

Do not grant anonymous `INSERT` on the table. The function is the trusted write path.

## Mail after persist

After a successful insert, the server attempts Entity email then operator notification. Mail is secondary. Failure must not delete, roll back, or fail the stored Enquiry. See `docs/architecture/contact.md`.

## Anti-spam

V1 uses:

- a hidden honeypot field (`company`)
- server-side validation and length limits
- the submit button disabled while pending

A filled honeypot returns the same success state without inserting and without sending mail.

CAPTCHA and Redis rate limiting are not in V1. Add them later if abuse appears.

## Personal data

Enquiries contain names, emails, phone numbers, and messages.

Do not:

- expose Enquiry rows on public pages or public queries
- put Enquiry fields on Listing cards, Deal projections, or map markers
- log email, phone, or message text
- return the inserted row to the browser after submit

The dashboard is the only read surface. Listing deletion is blocked while Enquiries exist (`ON DELETE RESTRICT`) so lead history is not dropped by accident. Mark the Listing inactive instead.

## What this is not

Enquiries are not visitor accounts, Entity inboxes, chat, CRM, booking, or checkout. OperatorTemplate stores the lead, emails the Entity, and notifies the operator. The conversation continues outside OperatorTemplate.
