# OperatorTemplate

Clean production starting point for an independent operator-led niche marketplace.

Copy this repository into a **new** Git repo, connect a **fresh** Supabase project, configure identity and listing details, then deploy. One platform is one business. This is not a multi-tenant SaaS product.

OperatorTemplate is not a no-code factory. Each platform is expected to adapt a small amount of SQL and code for its niche.

## Create a new Operator Platform

1. Copy OperatorTemplate into a new repository (do not reuse this Git history as product history if you are forking for a client).
2. Rename the `package.json` name if you want the platform named in tooling.
3. Create an empty Supabase project. Do not restore another platform’s backup.
4. Copy `.env.example` to `.env.local` and fill in that project’s values only.
5. Apply all base SQL migrations in `supabase/migrations/` in timestamp order.
6. Disable public Auth signup. Any authenticated user currently has operator access.
7. Create the operator user in Supabase Auth. Sign in at `/login`.
8. Edit `config/business.ts`, `config/branding.ts`, `config/terminology.ts`, and `config/seo.ts`.
9. Add a **new** niche migration that adapts `listing_details`. Do not rewrite the 13 base migrations.
10. Update `lib/listings/vertical.ts` and the listing form/card/detail UI to match those columns.
11. Replace files in `public/brand/`.
12. Run tests, then add Categories, Entities, and Listings from the dashboard.
13. Deploy (Vercel or equivalent). Set the same env vars in the host. Confirm Auth site URL and redirects.

Deeper playbook: [`docs/clone/README.md`](docs/clone/README.md).

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase (Postgres, Auth, Storage, RLS)
- Resend for Enquiry mail (optional)

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from **Supabase → Settings → API Keys**.
3. Create the operator user in **Supabase → Authentication → Users**. There is no public signup.
4. Apply SQL migrations from `supabase/migrations/` in filename order (SQL editor or `npx supabase db push` if the CLI is linked).
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` to reach the protected dashboard.

## Scripts

```bash
npm run test
npm run lint
npm run typecheck
npm run build
npm audit
```

## Documentation

| Document | Purpose |
|---|---|
| `docs/clone/README.md` | Playbook for creating a new Operator Platform |
| `docs/architecture/overview.md` | Current architecture |
| `docs/architecture/vertical-data-model.md` | What stays generic vs what you adapt |
| `docs/README.md` | Full documentation map |
| `AGENTS.md` | Engineering rules for humans and coding agents |

Migrations live in `supabase/migrations/` and apply in timestamp order. Do not reconstruct the schema from prose.

## Environment

Supply platform-specific values. Never copy credentials from another project.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `PLATFORM_NAME`
- `OPERATOR_NOTIFICATION_EMAIL`
