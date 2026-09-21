# AGENTS.md — OperatorTemplate

## Purpose

This file defines the non-negotiable engineering rules for any coding agent working on OperatorTemplate.

Read this file before making changes.

OperatorTemplate is a reusable foundation for building independent, operator-led vertical marketplace and discovery businesses.

The goal is **not** to build the most technically sophisticated architecture possible.

The goal is to build a secure, modern, production-grade application that an intermediate React / Next.js developer can understand, maintain, debug and adapt.

---

# 1. Primary Engineering Rule

For every implementation decision, prefer:

> **The simplest secure production-grade solution that an intermediate developer can understand and maintain.**

over:

> **The most sophisticated, abstract or theoretically elegant solution available.**

OperatorTemplate should feel like a well-built professional application, not an architecture demonstration.

The standard is:

> **Production grade. Secure. Modern. Fast. Readable. Boring where boring is better.**

---

# 2. Primary Maintainer

Assume the primary maintainer is an intermediate developer familiar with:

- React
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- SQL fundamentals
- modern frontend development

Do not assume expert-level knowledge of advanced architecture patterns.

The maintainer must be able to:

- trace data from database to server to UI
- understand authentication and authorization boundaries
- find where a feature is implemented
- modify existing behaviour safely
- adapt Listing data for a new niche
- debug ordinary application problems
- understand why security-sensitive code exists
- extend the application without first learning a custom internal framework

If your implementation makes those tasks unnecessarily difficult, simplify it.

---

# 3. Explicit Over Clever

Prefer:

- straightforward functions
- clear file names
- obvious variable names
- conventional Next.js patterns
- conventional React patterns
- strongly typed TypeScript
- small focused modules
- readable Supabase queries
- explicit validation
- explicit error handling
- direct data flow
- normal framework conventions
- comments where architectural intent would otherwise be unclear

Avoid clever code whose behaviour is difficult to discover by reading it.

Code should optimise for the next developer understanding it, not for impressing another engineer.

---

# 4. Production Quality Is Mandatory

Simplicity must never be achieved by weakening security, reliability or production standards.

Follow current production best practices for:

- authentication
- authorization
- Supabase Row Level Security
- server/client boundaries
- input validation
- environment variables and secrets
- file uploads
- public/private data exposure
- database access
- safe migrations
- dependency security
- error handling
- accessibility
- responsive behaviour
- SEO
- performance
- database indexing where justified
- production deployment

Security-sensitive behaviour should be explicit and easy to audit.

Never expose secrets to client-side code.

Never rely on client-side UI hiding as authorization.

Never weaken RLS or authentication merely to make development easier.

---

# 5. Avoid Unnecessary Architecture

Do not introduce advanced architectural patterns unless an actual requirement clearly justifies them.

Avoid by default:

- microservices
- event-driven architecture
- CQRS
- domain-driven design ceremony
- dependency injection frameworks
- generic repository patterns
- elaborate service layers
- complex state machines
- metaprogramming
- excessive custom hooks
- deeply generic utilities
- complicated generic TypeScript
- custom application frameworks
- dynamic schema engines
- generic form builders
- configuration-driven application architecture
- unnecessary global state
- complex caching strategies
- premature optimisation

Do not create abstractions for hypothetical future requirements.

A small amount of readable duplication is preferable to an abstraction that makes behaviour harder to trace.

---

# 6. Abstraction Must Earn Its Place

Create reusable abstractions only when there is a real repeated problem.

Before creating an abstraction, ask:

1. Is the same meaningful behaviour already repeated?
2. Does the abstraction make the code easier to understand?
3. Will the primary maintainer understand why it exists?
4. Does it reduce genuine maintenance risk?
5. Could straightforward code solve the problem more clearly?

If the abstraction exists mainly because it *might* be useful later, do not create it.

---

# 7. Stay Within the Current Need

OperatorTemplate is a production starting point, not a development backlog.

Before making changes:

1. understand the requested change
2. implement only what is required
3. test it
4. update relevant documentation
5. stop

Do not silently implement speculative future features.

Do not expand scope because another feature seems convenient to build at the same time.

Do not create placeholder architecture for features that do not yet exist.

---

# 8. No Speculative Features

Do not add features merely because a typical marketplace, SaaS application or admin dashboard commonly contains them.

In particular, do not introduce unless explicitly required for this platform:

- user registration
- buyer accounts
- seller/provider accounts
- teams
- organisations
- role systems
- complex permissions
- multi-tenancy
- page builders
- dashboard search
- CRM functionality
- sales pipelines
- exports
- imports
- internal messaging
- payments
- commissions
- workflow automation
- generic Settings screens
- custom-field systems
- generic integrations frameworks

OperatorTemplate deliberately excludes many common SaaS features.

---

# 9. OperatorTemplate Is Not SaaS

One OperatorTemplate clone represents one independent niche business.

Do not design the master application as a multi-tenant hosted platform.

Do not introduce:

- tenant IDs
- organisation switching
- account workspaces
- per-tenant configuration architecture
- tenant-aware database abstractions

unless the product direction is explicitly changed in future documentation.

Each niche implementation is expected to have its own application and infrastructure.

---

# 10. Vertical Adaptation Philosophy

OperatorTemplate provides a reusable core, but each niche is deliberately adapted by a developer.

Do not attempt to eliminate developer involvement through:

- dynamic Listing schemas
- custom-field builders
- no-code form builders
- generic data-definition interfaces
- universal filter engines
- universal marketplace configuration systems

The Listing data model is intentionally expected to change between niches.

The goal is:

> **Make vertical adaptation predictable and localised, not automatic.**

Once created, follow:

`docs/architecture/vertical-data-model.md`

as the primary reference for niche data adaptation.

---

# 11. Core Domain Direction

The fundamental OperatorTemplate model is:

```text
             CATEGORY
                 │
                 ▼
ENTITY ─────► LISTING
```

Categories organise Listings.

Entities represent the businesses, people or organisations responsible for Listings.

Listings represent the niche-specific product, service, asset, job, event, package, opportunity or other discoverable item.

Additional domain concepts are introduced only through their relevant slices.

Do not prematurely expand this model.

---

# 12. Generic Terminology

The master codebase should favour generic internal terminology where appropriate:

- Category
- Entity
- Listing
- Deal
- Enquiry
- Article

Public terminology may be changed during a niche implementation.

Do not add complexity purely to support every possible public label dynamically.

Developer adaptation is expected.

---

# 13. Data Access

Keep data access straightforward and traceable.

Prefer:

- direct, readable Supabase queries
- server-side access where appropriate
- clear query functions where reuse genuinely helps
- strongly typed inputs and outputs
- explicit error handling

Avoid creating repository/service/data-access layers simply because enterprise applications sometimes use them.

A developer should be able to trace:

```text
Database
   ↓
Server/query code
   ↓
Page/component
   ↓
UI
```

without navigating unnecessary layers.

---

# 14. Server and Client Boundaries

Use Next.js server capabilities where they simplify security and data access.

Client Components should be used when browser interactivity genuinely requires them.

Do not add `"use client"` unnecessarily.

Keep secrets, privileged database access and authorization decisions on the server.

Make server/client boundaries obvious from the file structure and code.

---

# 15. TypeScript

Use strict TypeScript.

Types should make the application easier to understand.

Avoid:

- `any` unless genuinely unavoidable
- unnecessarily complex generics
- type-level programming for its own sake
- types that require significant effort to decipher

Prefer simple domain types with descriptive names.

If `any` is unavoidable, explain why.

---

# 16. React

Prefer ordinary React composition.

Use:

- clear components
- props
- local state where appropriate
- server-rendered data where appropriate
- small focused interactive Client Components

Avoid:

- unnecessary global state
- excessive Context
- giant custom hooks
- render-prop abstractions without need
- premature memoisation
- complicated state-management libraries without a real requirement

Use the framework before adding another framework.

---

# 17. Next.js

Follow current supported App Router conventions.

Prefer framework-native functionality where it provides a clear, maintainable solution.

Do not use deprecated patterns.

Do not introduce framework tricks that make routing, caching or rendering behaviour difficult for the maintainer to understand.

If using behaviour with important Next.js caching/rendering implications, document the reason.

---

# 18. Supabase

Use Supabase deliberately and transparently.

Expected responsibilities include:

- PostgreSQL
- Auth
- Storage
- Row Level Security

Database migrations are the schema source of truth.

Do not make important production schema changes only through the Supabase dashboard without recording them in migrations.

RLS should follow least-privilege principles.

Do not use the service-role key in browser/client code.

Do not bypass RLS as a convenience.

---

# 19. Database Design

Prefer simple relational database design.

Use:

- clear table names
- explicit foreign keys
- appropriate constraints
- sensible indexes where justified
- timestamps where operationally useful
- migrations that can be reviewed

Avoid:

- over-normalisation without benefit
- JSON blobs for ordinary relational data
- polymorphic systems where normal relationships work
- generic entity-attribute-value models
- database abstractions designed for unknown future niches

The database should remain understandable from its schema.

---

# 20. Validation

All untrusted input must be validated at an appropriate trusted boundary.

Client-side validation is useful for UX but must not be the only protection.

Validation rules should be easy to find and understand.

Do not build an elaborate validation framework.

Use a conventional well-supported validation library where justified by the project.

---

# 21. Error Handling

Errors should be handled deliberately.

User-facing errors should be:

- clear
- safe
- useful

Do not expose:

- raw database errors
- stack traces
- secrets
- internal implementation details

Avoid building a large custom error architecture unless the application genuinely develops a need for one.

---

# 22. Dependencies

Dependencies must earn their place.

Before adding one, consider:

1. Can the framework already do this clearly?
2. Can it be implemented simply without another dependency?
3. Does the dependency materially improve reliability or maintainability?
4. Is it actively maintained?
5. Is it appropriate for production?

Do not add dependencies simply because they are popular or convenient.

Do not silently add major dependencies.

If a new dependency materially affects architecture, document why it was chosen.

---

# 23. Performance

Build to modern production standards, but do not prematurely optimise.

Prefer obvious wins:

- server rendering where appropriate
- sensible image handling
- appropriate database queries
- avoiding unnecessary client JavaScript
- avoiding obvious N+1 query patterns
- pagination when data volume actually requires it
- database indexes when queries justify them

Do not introduce complex caching or optimisation architecture before a measurable need exists.

---

# 24. Accessibility

Accessibility is part of production quality.

Use:

- semantic HTML
- associated labels
- keyboard-accessible controls
- visible focus states
- appropriate button/link semantics
- useful alt text
- sufficient interaction feedback

Do not postpone basic accessibility until a final polish stage.

---

# 25. Responsive Behaviour

Public and dashboard interfaces must remain usable across common viewport sizes.

The dashboard may use a conventional:

- left navigation on desktop
- collapsed/drawer navigation on smaller screens

Do not create unnecessary custom responsive systems when normal CSS/Tailwind patterns are sufficient.

---

# 26. Public Styling vs Dashboard Styling

The dashboard should use a clean, conventional modern admin style.

Its purpose is operational clarity rather than distinctive branding.

The public site will receive a dedicated visual design/polish stage later.

Do not prematurely impose a strong public visual design while building functional slices unless the current slice specifically requires it.

Functionality and semantic structure should make later visual styling straightforward.

---

# 27. Guided Operator UX

OperatorTemplate is intended to be usable by operators who may have little experience running an online marketplace.

A core UX principle is:

> **The operator should never have to wonder what they are supposed to do next.**

Where relevant, use:

- helper text
- examples
- sensible defaults
- instructional empty states
- clear actions
- useful success states
- guided forms

Do not leave unexplained blank screens.

However, do not build intrusive tutorial systems or unnecessary onboarding machinery.

---

# 28. Testing

Tests should protect meaningful behaviour.

Do not chase arbitrary coverage percentages.

Prioritise:

- security-sensitive behaviour
- domain rules
- important transformations
- validation
- critical operator workflows
- regressions likely to matter

Tests should remain readable.

Avoid enormous mocking frameworks that are harder to understand than the code being tested.

Each change should include appropriate automated tests and a clear manual test checklist where useful.

---

# 29. Documentation

Project documentation lives in `docs/`. See `docs/README.md` for the folder layout.

When a platform-level change is made, update the standing clone, architecture, or design document that a future maintainer will actually open.

Documentation is part of the codebase.

Update documentation when a change affects:

- architecture
- security
- vertical adaptation
- data modelling
- development workflow
- deployment
- clone/bootstrap assumptions

Do not document every trivial implementation detail.

Document **why** important decisions exist.

The documentation should help the primary maintainer understand and safely modify OperatorTemplate months later.

---

# 30. Do Not Rewrite Unrelated Code

When implementing a slice or fixing an issue:

- change the smallest reasonable surface
- preserve working behaviour outside scope
- do not perform unrelated refactors
- do not rename large parts of the project without need
- do not replace working patterns merely because you prefer another approach

If an unrelated architectural problem is discovered, report it rather than silently expanding scope.

---

# 31. Security Review Rule

Before completing security-sensitive work, verify:

- who can call it
- where authorization occurs
- whether input is validated
- whether secrets remain server-side
- whether RLS supports the intended access
- whether public data exposure is intentional
- whether errors leak sensitive information

Never assume a UI restriction is a security boundary.

---

# 32. Feature Completion Test

Before declaring a feature complete, ask:

1. Does it satisfy the current slice?
2. Is it secure?
3. Is it production appropriate?
4. Can an intermediate developer understand it?
5. Can its data flow be traced easily?
6. Is every abstraction solving a real problem?
7. Could it be simpler without reducing security or reliability?
8. Have relevant tests been added?
9. Has relevant documentation been updated?
10. Did we avoid building anything the slice did not request?

If not, the work is not complete.

---

# 33. OperatorTemplate Product Filter

For generic OperatorTemplate features, ask:

> **Does this help the operator acquire supply, organise supply, create value, distribute value, generate demand, or understand what to do next?**

If not, it probably does not belong in the reusable master.

For niche-specific requirements, prefer implementing them in the niche build rather than bloating OperatorTemplate for every future clone.

---

# 34. Final Instruction to Coding Agents

Do not use your ability to produce advanced software as justification for producing advanced architecture.

OperatorTemplate deliberately values maintainability over cleverness.

When two solutions are equally secure and production-ready, choose the one that:

- uses fewer concepts
- has fewer layers
- is easier to trace
- uses familiar framework conventions
- requires less specialist knowledge
- will be easier for the primary maintainer to modify six months from now

Build software that is **easy to own**, not merely impressive to generate.

---

# 35. Clone playbook

When turning OperatorTemplate into a new niche business, start at:

`docs/clone/README.md`

Adapt Listing data in the documented local files. Do not invent a configuration engine, schema builder, or multi-tenant layer to avoid that work.

---

# 36. After V1

OperatorTemplate is the reusable starting point. Do not add speculative marketplace features because the template feels “finished”.

Dashboard search, CRM, payments, accounts, booking, imports/exports, and similar work wait for real operator feedback, a repeated niche need, or paid client development.
