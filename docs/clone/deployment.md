# Deployment

Straightforward production baseline:

```text
Git repository
     ↓
Vercel
     ↓
Supabase
```

Do not add extra deployment automation unless this clone already has a simple reason.

---

## Environment variables

Set every variable from `.env.example` in Vercel.

| Variable | Browser? | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes in production (canonical origin, no trailing slash) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Yes |
| `SUPABASE_SECRET_KEY` | No | Needed to email the Entity after an Enquiry |
| `RESEND_API_KEY` | No | Optional; skip mail if empty |
| `MAIL_FROM` | No | Required if sending mail |
| `OPERATOR_NOTIFICATION_EMAIL` | No | Operator copy of each Enquiry |
| `PLATFORM_NAME` | No | Optional override of `config/business.ts` on Entity Enquiry email |

Never put `SUPABASE_SECRET_KEY` or `RESEND_API_KEY` in `NEXT_PUBLIC_*` names.

`NEXT_PUBLIC_SITE_URL` must be the public origin, for example `https://example.com`.

---

## Supabase Auth in production

- Disable public signup
- Add the production Site URL and redirect URLs
- Create the operator user before launch

---

## Domain

Point the domain at Vercel. Keep `NEXT_PUBLIC_SITE_URL` in sync with that origin so promotion copy, enquiry mail, sitemap, and robots stay correct.

---

## Maps and geocoding

Listing detail maps use stored coordinates. UK postcode lookup calls Postcodes.io from the server. A non-UK clone should replace or skip that lookup. No extra map API key is required for the current MapLibre/OpenFreeMap setup.

---

## Production smoke test

After deploy:

- `/` loads
- `/listings` and one active Listing detail load
- Inactive Listing slug 404s
- `/articles` hides drafts
- Enquiry submit on an active Listing stores a row
- `/dashboard` rejects anonymous users
- `/sitemap.xml` has public index URLs and no `/dashboard`
- `/build-specs` is not a public page
- Signup remains disabled in Supabase
