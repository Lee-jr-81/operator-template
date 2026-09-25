# OperatorTemplate handoff: public UX

Instructions for the OperatorTemplate agent. Apply these as generic template behaviour. Use Category, Listing, Entity, and Article. Public sentences should use `TERMINOLOGY` and `BUSINESS.name`.

Do not copy niche wording, photographs, icons, or brand assets from the clone this report came from.

This report starts at “remove Operator login from the header” and covers only the public UX after that. It does not repeat the earlier image, article-layout, or colour handoffs.

---

## 1. Operator login lives in the footer

The public header is for visitors. Operator login was useful in development and does not belong in the header in production.

- Remove `/login` from the desktop header and from the mobile menu.
- Header links stay Listings (`TERMINOLOGY.listing.plural` → `/listings`) and Articles (`/articles`).
- Add `{ href: "/login", label: "Operator login" }` to the footer Explore list, after Listings, Categories, and Articles.
- Use the same size, colour, and hover as the other Explore links. Do not style it as a button or a muted legal line.
- The href stays `/login`. A signed-in operator is still redirected to `/dashboard`. Do not add a separate `/dashboard` link.
- If the header marks the current item with `usePathname()`, guard a null pathname before calling `startsWith`. Tests can render the header without a router.

## 2. Dashboard logo sits slightly clear of the nav

In the dashboard sidebar, the logo block should be:

`mb-4 flex items-center gap-2.5 px-2 py-3`

Keep the existing vertical padding. `mb-3` is too small to see. `mb-12` is too large.

## 3. The closing call to action invites a supplier, and it does not open the dashboard

The homepage band at the bottom, and the matching card in the listings browse aside, must not go to `/login`. A signed-in operator experiences `/login` as the dashboard. The action is for someone who wants to supply listings, not for a visitor listing goods and not for the operator.

Both places link to `/contact` with the label “Get in touch” and the existing on-brand button (light button on the brand background).

Template copy, using terminology:

- Homepage heading: “Are you a {entity singular}?” Underline the entity word only.
- Homepage body: “{platform} lists {listing plural} from {entity plural}. Tell us about yours and we will be in touch.”
- Aside heading: “Are you a {entity singular}?”
- Aside body: “Tell us about your {listing plural} and we will be in touch.”

A clone rewrites these sentences. The destination and the meaning stay.

## 4. Public contact page

There was no public page for that invitation. Add `/contact`.

- Canonical `/contact`. Include it in the sitemap static paths.
- Narrow column, same public page padding as other indexes.
- Heading: “List your {listing plural}”.
- Short intro: the platform lists {listing plural} from {entity plural}, and the operator will reply by email.
- Fields: name, email, optional phone, message.
- Hidden honeypot named `company` (`tabIndex={-1}`, `autoComplete="off"`, visually hidden). Reuse the existing enquiry honeypot check. A filled honeypot returns success and sends nothing.
- Limits match enquiries: name 80, email 254, phone optional 6–40 and digits plus common symbols, message 10–2000.
- Validate on the server. Client limits are for the inputs only.
- Success state: “Message sent”, then “Thanks. We have your message and will reply by email.”
- Send one email to the existing operator notification address. Subject: “A {entity singular} would like to join {platform}”. Body includes name, email, phone when present, and the message.
- Do not insert a row into `enquiries`. That table requires a listing.
- If the operator notification email or the mail provider is missing, show “That message could not be sent. Please try again.” Log the reason on the server. Do not show provider errors.

## 5. Category page sections

On `/categories/[slug]`:

- Keep the photograph (when there is one), the category name, and the description.
- Guides heading, only when that category has public articles: “{category name} guides”. `text-2xl font-semibold tracking-tight`.
- Listings heading, only when that category has public listings: “{category name} {listing plural lowercase}”, same heading style.
- Hide the listings section when it is empty. Do not show “none published yet”. This matches the guides section.
- Space before each section: `mt-16 sm:mt-20 lg:mt-24`.
- Lay cards out with `mt-6 flex flex-wrap gap-4`. Each `li` is `w-full max-w-[320px]`.
- Cards pack from the left. Do not put them in a 2-column grid that centres a card inside a wide cell.

## 6. Homepage categories

Show every category, sorted by name, including categories that do not yet have a public listing. This list is for the homepage row only.

Do not change the listings or articles browse filters. Those still list categories that have at least one active listing.

No section heading and no “View all” link. The categories index stays in the footer. Each card still links to `/categories/[slug]`.

`HOMEPAGE_CATEGORY_VISIBLE` is 5. That is how many cards fill the desktop row. It is not a cap on how many categories are loaded.

- One category: a single centred card. No carousel and no arrows.
- Two to five on desktop (`lg`): one row, five columns, extra columns left empty so fewer than five pack from the left. No arrows.
- More than five on desktop: the same card width as one of those five columns, `lg:w-[calc((100%-4rem)/5)]` with `lg:gap-4`. Further cards stay in that row and scroll. The page itself must not gain a horizontal scrollbar.
- Below `lg`: no arrows. The scrollbar stays hidden. The next card is cut off so the row is obviously scrollable.
  - Default: `w-[calc(100%-4.5rem)]` (one card, the next one peeking).
  - From `sm`: `sm:w-[calc((100%-4.5rem)/2)]` (two cards, the next one peeking).
- Hide the scrollbar on the scroller with `scrollbar-width: none` and `::-webkit-scrollbar { display: none }`. A class such as `no-scrollbar` is enough. Do not leave `overflow` visible on desktop once there are more than five cards.

Desktop arrows, only when there are more than five categories, and only from `lg`:

- One round button on each side, vertically centred, half outside the row (`translate: -50% -50%` on the left, `50% -50%` on the right). In Tailwind v4, set both axes in one `translate` utility so they do not override each other.
- White fill, public border, small shadow, public text, hover uses the soft brand background. About 44px.
- Labels: “Previous {category plural lowercase}” and “Next {category plural lowercase}”.
- At the start, the previous button is disabled and `opacity-0`. After scrolling, it appears. At the end, the next button hides the same way.
- Each click scrolls one card plus the row gap. Use smooth scrolling, and `auto` when `prefers-reduced-motion: reduce`.
- Update the enabled state on scroll and when the row resizes. Guard `ResizeObserver` if it is missing.

## Tests to update

- Header has no `/login` link. Footer Explore link “Operator login” points at `/login`.
- Homepage and listings-aside supply actions point at `/contact` and do not point at `/login`.
- Sitemap includes `/contact`.
- Join validation: required fields, phone optional, honeypot, and the safe failure message.
- Category scroller: five categories produce a five-column desktop row and no arrow buttons; six categories render every card, hide the scrollbar, and render the next button with the previous button disabled.
