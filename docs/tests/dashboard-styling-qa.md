# Dashboard styling — manual QA

Sign in as the operator. Check light, then dark. Repeat key screens at ~1440, ~1024, ~768, and ~390.

Theme must persist after refresh. Public homepage must stay light and unchanged.

## Shell

- [ ] Dark sidebar, light-on-dark logo (`BRANDING.logo.onDark`)
- [ ] Sticky top bar with Return to site, sun/moon theme toggle, user icon + email
- [ ] Sign out at the bottom of the sidebar
- [ ] Desktop (`lg+`): sidebar always visible
- [ ] Below `lg`: menu button, drawer, overlay, Escape closes, body scroll locked, navigate closes
- [ ] Skip to content works
- [ ] Focus rings visible in both themes

## Routes

For each route: shell, header, spacing, empty and populated data, long titles, light + dark.

| Route | Light | Dark | Tablet | Mobile | Notes |
|---|---|---|---|---|---|
| `/dashboard` | | | | | Metrics are real counts only |
| `/dashboard/categories` | | | | | |
| `/dashboard/categories/new` | | | | | Validation error |
| `/dashboard/categories/[id]` | | | | | |
| `/dashboard/categories/[id]/delete` | | | | | Destructive vs Cancel |
| `/dashboard/entities` | | | | | |
| `/dashboard/entities/new` | | | | | |
| `/dashboard/entities/[id]` | | | | | Location / logo |
| `/dashboard/entities/[id]/delete` | | | | | |
| `/dashboard/listings` | | | | | Status badges |
| `/dashboard/listings/new` | | | | | Missing Category/Entity gate |
| `/dashboard/listings/[id]` | | | | | Media + form |
| `/dashboard/listings/[id]/delete` | | | | | |
| `/dashboard/deals` | | | | | |
| `/dashboard/deals/new` | | | | | |
| `/dashboard/deals/[id]` | | | | | |
| `/dashboard/deals/[id]/promote` | | | | | Copy drafts |
| `/dashboard/deals/[id]/delete` | | | | | |
| `/dashboard/enquiries` | | | | | New rows slightly emphasised |
| `/dashboard/enquiries/[id]` | | | | | Status buttons |
| `/dashboard/articles` | | | | | |
| `/dashboard/articles/new` | | | | | ChatGPT helper is secondary |
| `/dashboard/articles/[id]` | | | | | Hero, related Listings, body |
| `/dashboard/articles/[id]/promote` | | | | | |
| `/dashboard/articles/[id]/delete` | | | | | |
| Unknown dashboard URL | | | | | Not found |

## Public regression

- [ ] `/` homepage unchanged
- [ ] `/listings` and listing detail unchanged
- [ ] `/login` still usable (shared Button/Input/Card)
- [ ] Public enquiry form still usable

## Theme

- [ ] Light / Dark icon toggle works
- [ ] Preference survives refresh
- [ ] No public dark mode
- [ ] Native selects readable in dark mode (`color-scheme`)
