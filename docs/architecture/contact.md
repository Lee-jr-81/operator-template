# Contact flow

Standing reference for how visitors contact an Entity from a Listing.

```text
                         LISTING
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
              WHATSAPP             ENQUIRY
                  │                   │
                  ▼                   ▼
          record click            save to DB
                  │                   │
                  ▼             ┌─────┴─────┐
               ENTITY           ▼           ▼
                              ENTITY     OPERATOR
                               email    notification
```

Immediate contact is WhatsApp. Low-pressure contact is an Enquiry.

The Entity owns the phone and email. The Listing is only the context. OperatorTemplate introduces the visitor and then stops. Buyer and Entity continue outside the application.

Do not build chat, an Entity inbox, CRM, conversation threads, or operator forwarding.

## Adaptive public contact

Active Listing detail loads contact channels through `get_listing_contact_channels()`. That `SECURITY DEFINER` function (`search_path = ''`) returns:

- the stored Entity **phone** (for a dynamic WhatsApp URL)
- **whether** an Entity email exists (`has_email`)

It does not return the email address to the browser.

Render only routes that can complete:

| Entity phone | Entity email | Public controls |
|---|---|---|
| usable | yes | WhatsApp + Enquiry |
| usable | no | WhatsApp only |
| unusable | yes | Enquiry only |
| unusable | no | neither |

Do not show disabled buttons. Copy stays generic: **WhatsApp Provider**, **Send an Enquiry**.

`show_phone` / `show_email` only control whether contact details appear as **text** on the public Entity block. WhatsApp and Enquiry can still appear when those flags are off, because the visitor is contacting the Entity, not reading a published directory listing of their details. A `wa.me` URL will still expose the number; that is unavoidable.

## WhatsApp

The destination is built at request time from the Entity phone. Do not store a constructed WhatsApp URL.

UK-first normalization lives in `lib/contact/whatsapp.ts` (`WHATSAPP_DEFAULT_DIAL_CODE = "44"`). A non-UK clone changes that constant. Do not pre-fill a WhatsApp message.

### WhatsApp clicks

`whatsapp_clicks` stores only:

- `id`
- `listing_id`
- `created_at`

That is a click metric, not a lead. Call it **WhatsApp clicks**. Do not call it WhatsApp enquiries, messages, or conversions.

Do not add a generic `contact_events` table. Do not store visitor identity, IP, user agent, session, referrer, or UTM.

The public button records a click, then opens WhatsApp. Recording goes through `record_whatsapp_click()`. If tracking fails, WhatsApp still opens. Public users cannot `SELECT` click rows. Listing delete cascades clicks (they are not personal data).

## Enquiries

Enquiries remain the `enquiries` table. `enquiries.created_at` is the received event. Do not write a second analytics row when an Enquiry is stored.

Show **Send an Enquiry** only when the Entity has a usable email. The server action and `submit_public_enquiry()` both refuse Enquiry when that email is missing.

The database write is the source of truth:

```text
validate
   ↓
store Enquiry
   ↓
attempt Entity email
   ↓
attempt operator notification
```

Mail failure must not roll back or fail the visitor success state. A filled honeypot still returns success and must not send mail.

Entity email lookup after insert uses a server-only Supabase secret-key client. Anonymous users cannot `SELECT` `entities`. If `SUPABASE_SECRET_KEY` or Resend is unset, skip mail; the Enquiry is still stored.

Do not return the Enquiry id to the browser.

The standing Enquiry table rules are in `docs/architecture/enquiries.md`.

## Mail

Resend sends plain-text transactional mail. Configuration is environment/build, not a dashboard Settings screen:

- `PLATFORM_NAME` (optional override of `config/business.ts`; identity belongs in config)
- `NEXT_PUBLIC_SITE_URL`
- `OPERATOR_NOTIFICATION_EMAIL`
- `MAIL_FROM`
- `RESEND_API_KEY`
- `SUPABASE_SECRET_KEY`

The Entity email must make the platform source obvious and tell them to contact the customer directly.

The operator notification is informational. It links to `/dashboard/enquiries/[id]` and should not dump visitor PII. The operator does not forward the Enquiry.

## Future analytics

Count `whatsapp_clicks` and `enquiries` directly. Do not denormalize counters onto Listing or Entity rows. Do not build funnels in this layer.
