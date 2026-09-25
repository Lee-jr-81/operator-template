# Colour pass to bring back to OperatorTemplate

Written 24 September 2026, from the PuppySure clone.

This is a colour-only change. Apply it in the OperatorTemplate master so later clones start from this system.

Do not change layouts, spacing, type sizes, border radii, component structure, or behaviour. Do not rewrite copy. Do not restyle photographs.

A later niche still replaces its own brand colours in `config/branding.ts`. Components should keep using the tokens below, so that swap recolours buttons, links, and accents without another styling pass.

---

## Palette

| Role | Token | Value | Use |
|---|---|---|---|
| Primary | `--brand-primary` | `#176B68` | Buttons, current nav, important links, focus, small icons |
| Dark | `--brand-secondary` and `--brand-primary-hover` | `#10504E` | Button hover, link hover, stronger brand text |
| Soft | `--brand-accent` and `--brand-soft` | `#DCE8E2` | Selected controls, light badges, active dashboard item text |
| Cream | `--public-muted` | `#FAF7F2` | One quiet supporting band, soft wells |
| Charcoal | `--public-text`, `--public-footer`, `--foreground` | `#252A2A` | Text, footer, dashboard sidebar |
| White | `--public-bg`, `--public-surface` | `#FFFFFF` | Page, cards, header, forms |

Muted text is `#5C6564`. Subtle text is `#7A8281`. Borders are `#E6E2DA`.

White and charcoal do the structure. The primary colour is for interaction and brand. Cream and soft are occasional. Do not paint large areas in the primary colour just because a section needs a background.

---

## Where the values live

`config/branding.ts`:

```text
primary:   #176B68
secondary: #10504E
accent:    #DCE8E2
```

Those three are injected on `<html>` by `brandCssVars()` and override `:root`.

In `app/globals.css`, also set:

- `--brand-primary-hover` to `#10504E` exactly. Do not derive it with `color-mix` against black.
- `--brand-soft` to `#DCE8E2`.
- `--foreground` to `#252A2A`.

`--foreground` must not follow `--brand-primary`. If it does, default body text becomes the brand colour.

`:root` `--dash-*` tokens are the light controls used by login and the public enquiry form. Move those off Tailwind slate onto the same white, charcoal, cream, and border values. Leave destructive, success, warning, and info colours as they are.

---

## Public site

**Header.** Stay light. The current item is primary-coloured text. Other items stay muted and turn primary on hover. Do not fill the bar with the brand colour.

**Hero button.** Keep the white button with primary-coloured text. It sits on a photograph. Do not fill the hero with the brand colour.

**Buttons.** Primary: brand background, white text, dark hover. Secondary: existing outline, brand border and text on hover. A button that already sits on a brand-coloured band stays white with brand text. Do not make every button the brand colour.

**One brand band.** The existing closing call-to-action block may stay brand-coloured. Do not add more full-width brand sections.

**Footer.** Background charcoal `#252A2A`. Primary text white. Secondary text a muted white. Links stay light, hovering to white. Do not use the dark brand colour as the footer background.

**Supporting band.** The homepage proof row already uses `--public-muted`. That token becomes cream, so this is the one warm band. Do not alternate every section between cream and brand.

**Cards.** Stay white. Titles may shift to the brand colour on hover, as they already do. The small name chip on a Listing card uses `--brand-soft` with `--brand-secondary` text. Do not give cards a brand or soft background.

**Links.** Important links use the primary colour and darken on hover: article text links, “view the category”, breadcrumbs, entity name, website, map title, and not-found links. Ordinary paragraphs stay charcoal.

**Filters.** An empty control stays white with the normal border. A control that has a value gets a primary border and a soft background. The apply button is primary, white text, dark hover.

**Icons.** Proof icons and the small homepage context icons use the primary colour. The round arrow on those context cards is already a primary disc. Leave it.

**Extra contact button.** The filled WhatsApp-style button is charcoal, not a second primary button. Hover may use the dark brand colour.

**Leftover slate.** Replace Tailwind `slate-*` on public pages with the tokens: muted text, charcoal headings, public border, cream or white surfaces. A lightbox ring offset that was `#1a1916` becomes `#252A2A`.

---

## Dashboard

Keep it quieter than the public site.

- Primary button: brand background, white text, hover `#10504E`. Replace `hover:opacity-90` on the primary variant only. Danger stays red and keeps its own hover.
- `dashLink` and `dashMutedLink` use the primary colour, and the dark colour on hover. Inline copies of those classes should match. Danger links stay on `--dash-destructive`.
- Sidebar background is charcoal `#252A2A`. Do not mix the brand colour into the sidebar. The active item is a teal tint (`color-mix` of `#176B68` at about 42% into `#252A2A`) with soft-coloured text.
- Dark mode sidebar stays near-black `#161513`. Its active item can take a similar teal tint. Do not turn the dark workspace teal.
- Workspace background `#F7F5F2`, cards white, muted wells `#F3EFE8`, text charcoal. “Return to site” stays muted and turns primary on hover.
- Focus rings already use the brand colour. Checkboxes already use `--dash-primary`.
- Status badges keep success, warning, danger, and info. Do not recolour those with the brand.

---

## Docs to update

- `docs/design/public-design-system.md` token table, and the footer line. The footer is charcoal, not the brand colour.
- `docs/design/dashboard-design-system.md` sidebar line. The sidebar is charcoal, with a brand tint only on the active item.
- `docs/clone/configuration.md` colour paragraph. Brand hexes come from `BRANDING.colours`. Neutrals live in `app/globals.css`. Primary buttons, focus, and important links use the brand colour. Semantic colours stay separate.

---

## Checks

- Primary buttons are `#176B68` with white text. Hover is `#10504E`.
- The current public nav item is `#176B68`. Other items are not.
- The footer computes to `#252A2A`, not the dark brand colour.
- The proof band computes to `#FAF7F2`. Cards stay white.
- A filter with a value has a sage background `#DCE8E2`.
- Body text is charcoal. It is not the brand colour.
- Delete and error actions are still red.
- Nothing about spacing, type, or layout changed.
