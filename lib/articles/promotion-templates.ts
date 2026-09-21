export const X_ARTICLE_POST_MAX = 280;

export type ArticlePromotionSource = {
  title: string;
  excerpt: string;
  url: string;
};

export function canPromoteArticle(status: string) {
  return status === "published";
}

function joinSections(sections: Array<string | null>) {
  return sections.filter((section): section is string => Boolean(section)).join("\n\n");
}

function trimmed(value: string) {
  const text = value.trim();
  return text || null;
}

export function truncatePromotionText(text: string, max: number) {
  const value = text.trim();
  if (value.length <= max) {
    return value;
  }

  if (max <= 1) {
    return "…".slice(0, Math.max(0, max));
  }

  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function buildFacebookArticlePost(data: ArticlePromotionSource) {
  return joinSections([
    trimmed(data.title),
    trimmed(data.excerpt),
    trimmed(data.url) ? `Read the full article:\n${data.url.trim()}` : null,
  ]);
}

export function buildInstagramArticlePost(data: ArticlePromotionSource) {
  return joinSections([
    trimmed(data.title),
    trimmed(data.excerpt),
    trimmed(data.url) ? `Read more via:\n${data.url.trim()}` : null,
  ]);
}

export function buildLinkedInArticlePost(data: ArticlePromotionSource) {
  return joinSections([
    trimmed(data.title),
    trimmed(data.excerpt),
    "We published this guide to help people understand the subject more clearly.",
    trimmed(data.url) ? `Read the article:\n${data.url.trim()}` : null,
  ]);
}

export function buildXArticlePost(data: ArticlePromotionSource) {
  const title = data.title.trim();
  const excerpt = data.excerpt.trim();
  const url = data.url.trim();

  const full = joinSections([title, excerpt, url].map((part) => part || null));
  if (full.length <= X_ARTICLE_POST_MAX) {
    return full;
  }

  const titleAndUrl = joinSections([title, url].map((part) => part || null));
  const excerptBudget = X_ARTICLE_POST_MAX - titleAndUrl.length - 2;
  if (titleAndUrl.length <= X_ARTICLE_POST_MAX && excerptBudget >= 8) {
    return joinSections([title, truncatePromotionText(excerpt, excerptBudget), url]);
  }

  if (titleAndUrl.length <= X_ARTICLE_POST_MAX) {
    return titleAndUrl;
  }

  const urlBlock = url ? `\n\n${url}` : "";
  const titleBudget = X_ARTICLE_POST_MAX - urlBlock.length;
  if (titleBudget >= 1 && url) {
    return `${truncatePromotionText(title, titleBudget)}${urlBlock}`;
  }

  return truncatePromotionText(full, X_ARTICLE_POST_MAX);
}
