# UX improvements to bring back to OperatorTemplate

Written 24 September 2026, from the PuppySure clone.

These are the changes made on 24 September only. They are public and dashboard behaviour that every later clone should get. Yesterday’s work (the PuppySure data model, seed data, logos, and SEO) stays in this clone.

Give this file to the agent working on the OperatorTemplate master. Implement the behaviour there in generic names: Category, Listing, Entity, Article. Public labels still come from `config/terminology.ts`.

Do not copy PuppySure sentences, photos, or the paw icon into the master.

---

## What to build

1. Shrink large photos in the browser before they upload.
2. Let the operator add several Listing images in one go.
3. Let the operator drag an Article hero to choose the crop, without changing the frame.
4. On a public Article, show the three latest active Listings for that Article’s Category. Remove the manual “related listings” picker.
5. Keep the Article title and hero full width. Under the hero, put the text in the left two thirds and those Listings in the right third.
6. Remove the excerpt line under the Article title.
7. Homepage proof cards use a small icon, a title, and one sentence.
8. A Category with no photo shows a brand icon, not a photo of some other Category.

---

## Leave these in the clone

- The homepage line “Find the right puppy, from the right breeder.” The master already keeps the hero heading and the footer tagline as two separate config strings. Only the sentence is niche.
- The paw icon and the PuppySure hero photo.
- Breed, breeder, and litter fields, labels, and filters.
- Hiding boy and girl counts on homepage cards. That was yesterday, and it is niche.

---

## 1. Shrink photos before upload

Camera photos were failing because the Server Action body limit is 6MB. The fix is not to raise that limit.

In the browser, before the file is sent:

- Longest edge 2000 pixels.
- Encode as JPEG.
- Aim for about 1.5MB. Start at quality 0.82 and step down to 0.5.
- Paint a white background first, so transparent PNGs do not turn black.
- If the file is already at most 1.5MB, already within 2000 pixels, and already JPEG, PNG, or WebP, send it unchanged.
- If the browser cannot read it, show: “This image could not be prepared. Use a JPEG, PNG, or WebP.”

Use this for:

- Adding Listing images
- Replacing one Listing image
- Uploading or replacing an Article hero

The server still rejects a file over 5MB. Helper text should say large photos are reduced automatically, not “up to 5MB”.

Do not wrap a server action that redirects on success in try/catch. Listing replace and Article hero upload both redirect. Catch only the browser prepare step. If the action returns `{ formError }`, show that.

Category photos, Entity logos, and other single-file uploads were left as they are.

Lives in `lib/uploads/prepare-image.ts`.

---

## 2. Several Listing images at once

The Listing image input accepts `multiple`. The operator can pick several files. Each file is prepared, then sent on its own with `storeListingMedia`. One request per file stays under the body limit.

While they upload, the button reads “Uploading 2 of 5…”. Stop on the first failure and refresh, so images that already saved stay visible.

Alt text is collected only when one file is chosen. For several files, tell the operator to add a short description on each image after upload.

The first image is still the primary image. Reorder, replace, and delete stay as they are.

---

## 3. Article hero crop

Wide heroes were cutting off the subject. Do not change the hero’s shape to fix that. Shift the photo inside the existing frame.

### Saved choice

Add two nullable columns on `articles`:

- `hero_focal_x` smallint, null or 0–100
- `hero_focal_y` smallint, null or 0–100

Null means the page chooses a point from the photo. A number pair is the point the operator chose, in image coordinates, not CSS `object-position`. The same point can be reused in the hero, on cards, and in the dashboard preview, because each frame converts it.

Both values are null, or both are integers from 0 to 100. The operator-only action returns `{ formError }` and does not redirect.

Replacing or removing the hero clears both columns in the same update as the path.

Select the columns everywhere an Article card or Article page already selects `hero_image_path`.

### Automatic point

When nothing is saved, detect a point from the image:

- Shrink the longest edge to 48 pixels and read the pixels.
- Strong edges usually belong to the subject.
- Prefer a point near the top of that region.
- A flat or very busy photo falls back to 50% across and 32% down.
- This is a heuristic, not a face detector.

Use `next/image` for the dashboard preview so the canvas read is same-origin. A raw storage URL will taint the canvas and the detection will fail closed to the fallback.

### Operator control

On the Article edit screen, under the hero, show the photo in a wide frame (`aspect-5/2`).

- Drag to move what stays in the frame. Save when the pointer goes up, and only if the point changed.
- Arrow keys nudge by 4 and save each press.
- “Use automatic crop” clears the saved point.
- Copy: “Drag the photo to choose what stays in the frame. Arrow keys work too.”

### Public display

`CoverImage` measures the frame and sets `object-position` from the focal point and the two aspect ratios. If `focalX` and `focalY` are both numbers, skip detection. Use it on the public Article hero and on Article cards.

Do not change the public hero height (`h-72`, `sm:h-112`) or the card frame.

---

## 4. Latest Listings on an Article

The operator used to pick related Listings while editing an Article. Remove that picker from the dashboard.

If the Article has a Category, the public page loads the three latest active Listings in that Category.

- Latest means newest `created_at`.
- Inactive Listings stay off the page.
- No Category means no Listing column. Do not fill it with unrelated recent Listings.
- The Article index, Listing pages, and homepage do not show this column.

Heading: `Latest {category name} {listing plural}`, via terminology. Example shape: “Latest Labrador listings”. A link under the list goes to that Category: “View the {category singular}”.

Dashboard help on the Category field:

> Choose the {category} this guide is about. The public article shows the three latest {listings} for that {category}. Leave blank if it is not a {category} guide.

Leave the `article_listings` table in the database. Do not drop it unless asked. Do not keep a second manual picker.

Query: active listings, matching `category_id`, `created_at` descending, limit 3. Keep the existing “all listings in this category” query for the Category page. That one can stay ordered by `updated_at`.

---

## 5. Article page layout

Title, date, and hero stay full width. Do not put them in a side column.

Under the hero, when there are Listings:

- One grid: one column on small screens, three columns from the `lg` breakpoint.
- Article text spans two columns.
- The Listing list is the third column.
- The list scrolls with the page. It is not sticky.
- On a phone the list sits under the text.

When there are no Listings, the text stays centred at `max-w-2xl`.

Do not use CSS multi-column text. The right column is for Listings, not a second text column.

### Phone overflow

The small-screen grid must set `grid-cols-1`. Without it, the column grows to the width of the text and the page scrolls sideways.

Also set `min-w-0` on the grid, the article body, the aside, and the text next to each thumbnail. Truncated lines need that, or they force a horizontal scrollbar.

Check at 390, 360, and 320 pixels wide: `scrollWidth` equals `clientWidth`.

The Listing rows are compact: thumbnail, title (two lines), then stage, timing, and price on one truncated line. Empty list renders nothing.

---

## 6. No excerpt under the title

The public Article page does not print the excerpt under the H1.

The excerpt still shows on Article cards, and it is still the SEO description when no SEO description is set.

---

## 7. Proof cards

Under the Category cards, the homepage proof row used four huge words. Replace the word with a small icon. Keep the title and the sentence.

Each item in `BUSINESS.homepage.proof` is:

- `icon`: a short key the component knows how to draw
- `title`
- `copy`: one sentence

PuppySure uses `location`, `paw`, `message`, and `guide`. The master should ship simple line icons and let a clone pick keys and sentences in config. Do not hard-code puppy copy. A paw is fine as one available icon. It is not required.

Cards stay a responsive grid: one column, two from 400px, four from `lg`. No tall empty space where the giant word used to be.

---

## 8. Category image fallback

If a Category has no photo, do not reuse some other Category’s photo. Show a brand icon from config.

`BRANDING.media.categoryIcon` is a path the clone replaces. PuppySure points it at a paw. The master should point it at the template mark.

The icon sits centred on a muted background, about a third of the card height, contained, not cropped as a photo.

---

## Suggested order

1. Browser image prepare, then Listing multi-upload, then Article hero upload.
2. Focal columns and migration, then CoverImage, then the drag control.
3. Latest-three query, then remove the picker from the Article editor, then the public column.
4. Layout, including the phone overflow rules, and remove the excerpt under the title.
5. Proof icons and the Category fallback icon.

Update the CMS and homepage docs in the same change: hero compression, saved crop, automatic Listings, and the two-column article text. Update `docs/clone/configuration.md` so proof cards are documented as icon, title, and sentence.

---

## Checks

- A photo larger than 6MB uploads after the browser reduces it. The Server Action limit stays 6MB.
- Several Listing images upload together. A failure part-way through keeps the ones already saved.
- Dragging an Article hero changes the public hero and the Article card. “Use automatic crop” returns to detection. Replacing the photo clears the saved point.
- An Article with a Category shows three active Listings, newest first. An Article with no Category has no Listing column. Inactive Listings are absent.
- The Listing column is not sticky.
- At 320px wide, the Article page does not scroll sideways.
- The excerpt is gone under the title and still present on cards and in the meta description.
- A Category with no photo shows the configured icon.
