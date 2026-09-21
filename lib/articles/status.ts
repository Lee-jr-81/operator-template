export const ARTICLE_STATUSES = ["draft", "published"] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Draft",
  published: "Published",
};

export function isArticleStatus(value: string): value is ArticleStatus {
  return ARTICLE_STATUSES.includes(value as ArticleStatus);
}

export function asArticleStatus(value: string): ArticleStatus {
  return isArticleStatus(value) ? value : "draft";
}

export function isPubliclyVisibleArticle(
  article: { status: string; published_at: string | null },
  now: Date = new Date(),
) {
  if (article.status !== "published" || !article.published_at) {
    return false;
  }

  const publishedAt = new Date(article.published_at);
  if (Number.isNaN(publishedAt.getTime())) {
    return false;
  }

  return publishedAt.getTime() <= now.getTime();
}

export function resolvePublishedAt(input: {
  status: ArticleStatus;
  submittedPublishedAt: Date | null;
  existingPublishedAt: string | null;
  now?: Date;
}) {
  if (input.status === "published") {
    if (input.submittedPublishedAt) {
      return input.submittedPublishedAt.toISOString();
    }

    if (input.existingPublishedAt) {
      return input.existingPublishedAt;
    }

    return (input.now ?? new Date()).toISOString();
  }

  if (input.submittedPublishedAt) {
    return input.submittedPublishedAt.toISOString();
  }

  return input.existingPublishedAt;
}
