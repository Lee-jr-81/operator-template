# CMS Lite

Standing reference for OperatorTemplate Articles.

Articles are useful niche content the operator writes and publishes. They are not Listings, Deals, or a page builder.

```text
ARTICLE
  title, slug, excerpt, body
  optional hero image
  draft | published
  published_at
  optional SEO fields
```

## Why this stays small

The operator needs somewhere to create and publish an Article. Writing help is optional create-time UX, not extra columns. Article ↔ Listing links are editorial many-to-many rows.

Do not add:

- tags, Article categories, or authors
- comments, revisions, or approvals
- persisted social-copy fields
- a generic CMS/content-type engine
- an `article_topic` column
- a Guided Article writing system
- automatic Listing matching

Public wording can change per niche (`Articles` → `Guides`). Do not build a terminology config for that.

## Status and publication

Stored status is only `draft` or `published`.

An Article is **public** when:

```text
status = published
AND published_at is not null
AND published_at <= now
```

RLS enforces that for anonymous `SELECT`. Public queries filter the same way, including when an operator is signed in.

The first time an Article is published with a blank date, the server sets `published_at` to now. Returning it to Draft **keeps** `published_at` so republishing does not pretend it is a new piece. There is no scheduler: a future `published_at` simply stays off the public site until that time.

## Body

The operator writes Markdown in a textarea. The public page parses it with `marked` and sanitizes the HTML with `sanitize-html`.

Allowed output is headings, paragraphs, lists, links, emphasis, blockquotes, and code. Raw HTML, scripts, and `javascript:` URLs are stripped. External links open with `rel="noopener noreferrer"`.

Do not introduce a WYSIWYG or block editor unless a later slice has a real reason.

## Hero image

One optional image per Article. Path is `articles.hero_image_path`. Storage bucket: `article-media`, path `{articleId}/{mediaId}.{jpg|png|webp}`.

JPEG, PNG, or WebP, up to 5MB — the same limit as Listing images. This is not a gallery and not a shared media library. Replacing or deleting the Article removes the old Storage object when practical.

Hero upload stays on the edit screen after the Article exists.

## SEO

```text
title:       seo_title || title
description: seo_description || excerpt
```

Canonical URL is `/articles/{slug}`. Advanced Open Graph and structured data belong to a later metadata slice.

## Public and dashboard surfaces

| Route | Access |
|---|---|
| `/articles` | Published Articles, newest `published_at` first |
| `/articles/[slug]` | One published Article, or 404 |
| `/dashboard/articles` | Operator list |
| `/dashboard/articles/new` | Create |
| `/dashboard/articles/[id]` | Edit, hero image, related Listings, publish |
| `/dashboard/articles/[id]/promote` | Promote published Article |
| `/dashboard/articles/[id]/delete` | Confirmed delete |

Drafts and unknown slugs are not public. The homepage may show a Latest Articles section of up to three published cards. It does not fetch Article bodies.

## AI Writing Helper

Create Article includes an optional helper. It does not change the Article model.

```text
Article topic
    ↓
Copy AI writing prompt
    ↓
Preferred external AI assistant
    ↓
Operator pastes TITLE / EXCERPT / BODY / SEO fields by hand
```

The topic exists only in local UI state. It is not saved. There is no `article_topic` column.

**Copy AI writing prompt** builds the prompt in the browser and copies it with the Clipboard API. OperatorTemplate does not call OpenAI, Anthropic, Gemini, or any other AI API. There are no AI keys, no streaming, no usage tracking, and no parser that fills the form.

The prompt asks the external assistant to return exactly:

```text
TITLE           → Title
EXCERPT         → Excerpt
BODY            → Body (Markdown, no H1 title)
SEO TITLE       → SEO Title
SEO DESCRIPTION → SEO Description
```

Prompt construction lives in `lib/articles/writing-prompt.ts`. The helper is provider-neutral. Supporting copy may mention ChatGPT, Claude or Gemini as examples.

Manual transfer is intentional. Do not auto-fill fields from an AI response.

## Originality guidance

Originality belongs in the CMS, not in the copied prompt.

The prompt’s only job is a structured draft. A separate **Make this article yours** panel explains that AI is a starting point, and that the operator should add experience, examples, research, local knowledge or specialist insight before publishing. That original material is what makes the platform more useful than repeating generic AI text.

The panel appears on create and on edit, because edit is where the operator reviews before publish.

## Related Listings

Articles can point at marketplace Listings through an explicit junction table:

```text
article_listings
  article_id
  listing_id
  sort_order
  created_at
```

The relationship is many-to-many and editorial. The operator chooses Listings on `/dashboard/articles/[id]`. OperatorTemplate does not infer matches from Category, keywords, Entity, geography, or AI.

Public Article detail (`/articles/[slug]`) may show a listing band after the body. Operator-selected **Related Listings** appear first, in dashboard order, using the same public Listing eligibility (`status = active`). If the operator linked none, or fewer than three remain public, the band fills from the latest public Listings. An empty fallback is labelled **Latest available listings**, not Related Listings. OperatorTemplate still does not infer matches from Category, keywords, Entity, geography, or AI. The Article index, Listing detail pages, and homepage do not show this relationship.

A linked inactive Listing stays in `article_listings` so the operator can prepare content in advance. It is omitted from the public section until the Listing is active again. Deleting an Article or Listing cascades the junction rows. Removing a relationship never deletes the Article or Listing.

The Article body is not rewritten when relationships change. There is no Article ↔ Deal or Article ↔ Entity table. Current Deals still appear through the Listing card.

## Social promotion

Published Articles can be promoted from `/dashboard/articles/[id]/promote`.

Copy is built in `lib/articles/promotion-templates.ts` from title, excerpt, and the canonical public URL (`NEXT_PUBLIC_SITE_URL` + `/articles/{slug}`). Facebook, Instagram, LinkedIn, and X each have an explicit function. Drafts are editable in the browser and copied with the Clipboard API. Refreshing regenerates the original text. Nothing is stored.

Do not parse the Markdown body. Do not inject related Listing names. The post sends readers to the Article; related Listings on that page handle marketplace discovery.

This is not a social-media product. There is no OAuth, posting API, scheduler, hashtag engine, or click tracking. Do not use the AI writing helper to write these posts.

Draft Articles cannot be promoted. They do not have a public destination worth sharing.

## How to trace it

```text
/dashboard/articles/new
        ↓
optional: topic → buildArticleWritingPrompt() → clipboard
        ↓
operator pastes sections into ArticleForm
        ↓
createArticle() → articles row
        ↓
Edit: originality reminder, related Listings, hero, publish
        ↓
Public /articles query (published + published_at <= now)
        ↓
Markdown → sanitize → Article detail
        ↓
article_listings → public Listing cards (active only; latest listings fill if needed)
        ↓
optional: Promote Article → clipboard drafts (title, excerpt, URL)
```
