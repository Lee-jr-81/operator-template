# Engineering standards

Permanent reference for OperatorTemplate. `AGENTS.md` is the full constitution. This document summarises the engineering bar.

## Architecture rule

Choose the simplest secure production-grade solution that an intermediate React / Next.js developer can understand and maintain.

The codebase should feel like a well-built professional application, not an architecture demonstration.

## Simplicity

Prefer explicit functions, clear file names, conventional Next.js and React patterns, and direct data flow.

Do not introduce microservices, CQRS, generic repositories, form/schema builders, configuration-driven architecture, or abstractions created only to remove a small amount of readable duplication.

Niche Listing data is adapted in local files and a 1:1 `listing_details` table. Follow `docs/architecture/vertical-data-model.md`. Do not add custom-field builders or dynamic schemas.

## Security

- Keep secrets and privileged database access on the server.
- Never put `SUPABASE_SECRET_KEY` (or any `sb_secret_...` value) in a `NEXT_PUBLIC_` variable or Client Component.
- Dashboard protection must happen on the server. UI hiding is not authorization.
- Validate untrusted input at a trusted boundary.
- Failed authentication must not leak whether an email exists or expose raw Auth errors.
- Do not weaken RLS or Auth to make development easier.
- Do not invent RLS policies before domain tables exist.
- Keep Supabase Auth public signup disabled in production. Authenticated sessions currently have operator write access.
- Standing security boundaries: `docs/architecture/security.md`.

## TypeScript

Use strict TypeScript. Prefer simple domain types. Avoid `any` unless unavoidable and explained. Avoid type-level programming that makes the code harder to read.

## Server and client

Use Server Components and server actions where they simplify security and data access. Add `"use client"` only when browser interactivity requires it.

Supabase browser and server clients are separate on purpose. Create a new server client per request.

## Validation and errors

Client-side validation is for UX only. User-facing errors should be clear, safe, and useful. Do not expose stack traces, secrets, or raw database errors. Do not build a custom global error framework unless Next.js conventions require a simple boundary.

## Dependencies

Do not add a dependency because it is popular. Prefer the framework, then a small local helper, then a maintained production library. Document any dependency that changes architecture.

## Testing

Protect meaningful behaviour: security-sensitive paths, validation, and important operator workflows. Do not chase coverage percentages or build large mock frameworks.

## Documentation

Update docs when a change affects architecture, security, vertical adaptation, data modelling, workflow, or deployment. Document why a decision exists.
