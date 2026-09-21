# Terminology

Internal code should generally keep:

```text
Category
Entity
Listing
Deal
Enquiry
Article
```

Public and operator-facing copy can change per niche.

## Why internal names stay stable

A clone that renames `entities` to `dealers` in SQL, TypeScript, and routes makes later master fixes expensive. Keep the domain vocabulary in code. Change labels in UI strings.

## Examples

```text
Entity → Dealer
Listing → Machine
```

```text
Entity → Provider
Listing → Service
```

```text
Article → Guide
```

Places to change copy:

- `config/terminology.ts` for Category, Entity, and Listing labels
- public nav and homepage intro
- remaining helper text and empty-state prose that still reads awkwardly
- email templates in `lib/mail/` if a sentence needs niche wording
- record-driven metadata still comes from Listing and Article fields

Terminology config is presentation-only. It does not rename database tables, TypeScript types, or routes such as `/listings` and `/dashboard/entities`.

A human wording pass is still required. The config will not fix `a`/`an`, possessives, or awkward sentences.

Avoid mass-renaming internal domain concepts unless the niche benefit is large enough to justify a painful upgrade path.
