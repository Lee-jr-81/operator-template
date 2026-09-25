import {
  isArticleStatus,
  resolvePublishedAt,
  type ArticleStatus,
} from "@/lib/articles/status";
import { isUuid } from "@/lib/uuid";
import {
  ARTICLE_BODY_MAX,
  ARTICLE_EXCERPT_MAX,
  ARTICLE_SEO_DESCRIPTION_MAX,
  ARTICLE_SEO_TITLE_MAX,
  ARTICLE_TITLE_MAX,
  generateArticleSlug,
  isValidArticleSlug,
} from "@/server/articles/slug";
import type { ArticleFieldErrors, ArticleInput } from "@/server/articles/types";

export function hasArticleFieldErrors(fieldErrors: ArticleFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

function parseTimestamp(value: string): Date | null | "invalid" {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return "invalid";
  }

  return date;
}

export function parseArticleInput(
  raw: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    status: string;
    published_at: string;
    seo_title: string;
    seo_description: string;
    category_id?: string;
  },
  existing?: {
    status: ArticleStatus;
    published_at: string | null;
  },
): { data: ArticleInput } | { fieldErrors: ArticleFieldErrors } {
  const title = raw.title.trim();
  const excerpt = raw.excerpt.trim();
  const body = raw.body.trim();
  const seoTitle = raw.seo_title.trim();
  const seoDescription = raw.seo_description.trim();
  const categoryId = raw.category_id?.trim() ?? "";
  const slug = generateArticleSlug(raw.slug) || generateArticleSlug(title);
  const publishedAt = parseTimestamp(raw.published_at);
  const fieldErrors: ArticleFieldErrors = {};

  if (!title) {
    fieldErrors.title = "Enter an Article title.";
  } else if (title.length > ARTICLE_TITLE_MAX) {
    fieldErrors.title = `Use ${ARTICLE_TITLE_MAX} characters or fewer.`;
  }

  if (!slug) {
    fieldErrors.slug =
      "Enter a URL-safe slug, or use a title that can generate one.";
  } else if (!isValidArticleSlug(slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and hyphens only. Do not start or end with a hyphen.";
  }

  if (!excerpt) {
    fieldErrors.excerpt = "Enter a short excerpt for cards and search.";
  } else if (excerpt.length > ARTICLE_EXCERPT_MAX) {
    fieldErrors.excerpt = `Use ${ARTICLE_EXCERPT_MAX} characters or fewer.`;
  }

  if (!body) {
    fieldErrors.body = "Enter the Article body.";
  } else if (body.length > ARTICLE_BODY_MAX) {
    fieldErrors.body = `Use ${ARTICLE_BODY_MAX} characters or fewer.`;
  }

  if (!isArticleStatus(raw.status)) {
    fieldErrors.status = "Choose Draft or Published.";
  }

  if (publishedAt === "invalid") {
    fieldErrors.published_at = "Enter a valid publication date and time.";
  }

  if (seoTitle.length > ARTICLE_SEO_TITLE_MAX) {
    fieldErrors.seo_title = `Use ${ARTICLE_SEO_TITLE_MAX} characters or fewer.`;
  }

  if (seoDescription.length > ARTICLE_SEO_DESCRIPTION_MAX) {
    fieldErrors.seo_description = `Use ${ARTICLE_SEO_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (categoryId && !isUuid(categoryId)) {
    fieldErrors.category_id = "Choose a Category from the list.";
  }

  if (hasArticleFieldErrors(fieldErrors) || !isArticleStatus(raw.status)) {
    return { fieldErrors };
  }

  const submittedPublishedAt = publishedAt instanceof Date ? publishedAt : null;

  return {
    data: {
      title,
      slug,
      excerpt,
      body,
      status: raw.status,
      published_at: resolvePublishedAt({
        status: raw.status,
        submittedPublishedAt,
        existingPublishedAt: existing?.published_at ?? null,
      }),
      seo_title: seoTitle,
      seo_description: seoDescription,
      category_id: categoryId || null,
    },
  };
}

export function isUniqueSlugError(error: { code?: string } | null) {
  return error?.code === "23505";
}

export const DUPLICATE_SLUG_MESSAGE =
  "That slug is already used by another Article. Choose a different one.";

export const ARTICLE_SAVE_FAILED_MESSAGE =
  "The Article could not be saved. Please try again.";
