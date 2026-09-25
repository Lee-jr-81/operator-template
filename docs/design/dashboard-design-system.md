# Dashboard design system

Operator workspace visual foundation. Clone identity comes from `config/branding.ts` and `config/business.ts`. Do not add a theme editor.

Standing rule:

> The public site sells and presents. The dashboard helps an operator work.

Compact, calm, information-dense without feeling cramped. One brand colour. Borders over shadows. Light and dark mode. Isolated from public `--public-*` tokens.

---

## Tokens

Defined in `app/globals.css` under `.dashboard`. Dark values apply when `html[data-dash-theme="dark"]`.

`:root` also holds light `--dash-*` defaults so shared controls (`Button`, `Input`, `Card`) still look correct on `/login` and the public enquiry form. Dashboard overrides those variables inside `.dashboard`, so public pages never inherit dark mode.

| Token | Role |
|---|---|
| `--dash-bg` | Workspace background |
| `--dash-fg` | Primary text |
| `--dash-card` | Surfaces |
| `--dash-muted` | Table headers, muted wells |
| `--dash-muted-fg` | Secondary text |
| `--dash-subtle-fg` | Placeholders / tertiary |
| `--dash-border` | Borders |
| `--dash-input` | Form control fill |
| `--dash-primary` | Brand primary (`--brand-primary`) |
| `--dash-destructive` / `--dash-success` / `--dash-warning` / `--dash-info` | Status only |
| `--dash-sidebar*` | Dark sidebar, independent of workspace theme |

Native form controls follow `color-scheme` on `.dashboard`.

## Shell

- Charcoal sidebar (`#252A2A`), ~248px, fixed. The active item uses a teal tint and soft-coloured text. Logo: `BRANDING.logo.onDark`. Dark mode sidebar stays near-black (`#161513`) with the same kind of tint on the active item.
- Sticky top bar ~64px: return to site, mobile menu, sun/moon theme toggle, user icon + email.
- Sign out sits at the bottom of the sidebar.
- Content: fluid up to 1600px. Padding 32 / 24 / 16.
- Permanent sidebar from `lg` (1024px). Below that: drawer, overlay, scroll lock, Escape, close on navigate. Touch targets ≥44px.
- No desktop collapse.

## Type

- Page title: 28px desktop / 24px mobile, weight 700
- Section: ~18px, 600/700
- Metric: 32px, 700
- Table body: 14px
- Table header: 12px uppercase muted
- Help copy: 14px, muted

## Geometry

- Controls: 8px radius, ~42px height
- Cards: 10px radius, 20–24px padding, 1px border, no shadow
- Badges: compact pill, tinted surface + semantic text

## Buttons

`components/ui/button.tsx` — `buttonClass.primary|secondary|ghost|danger`. Compact. Brand primary for the main action. Destructive stays red.

Public marketing CTAs stay on `lib/public-button.ts` (48px). Do not use those in the dashboard.

## Shared dashboard pieces

- `PageHeader` — title, optional context, primary action
- `DataTable` — bordered surface, compact rows, hover
- `StatusBadge` — meaningful states only
- `MetricCard` — neutral counts, optional link
- `EmptyState` — short title + next action
- `BackLink` — return to the index

Do not invent a page-config engine.

## Tables

Horizontal scroll on small screens. Actions right-aligned: Edit as the primary text link, Delete in destructive colour. No ellipsis menus — those actions are used often enough to stay visible.

## Forms

Grouped with fieldsets where the form already had natural sections. Width ~768px (`max-w-3xl`); Articles ~896px (`max-w-4xl`). Labels stay visible. Validation sits next to the field.

## Theme

Preference: Light or Dark, stored in `localStorage` as `operatortemplate-dashboard-theme`. The top bar uses sun and moon icon buttons, not a dropdown. A blocking script in the root layout sets `data-dash-theme` on `<html>` before paint. Only `.dashboard` consumes that attribute. Older `system` values are treated as light.

Sidebar stays dark in both themes. Use `onDark` against the sidebar, never a CSS filter.

## What this system is not

Not a public redesign. Not shadcn. Not Lucide. Not an analytics product. Not a theme marketplace.
