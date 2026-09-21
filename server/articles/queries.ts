import "server-only";

import { getSupabasePublicEnv } from "@/lib/env";
import { asArticleStatus, isPubliclyVisibleArticle } from "@/lib/articles/status";
import { PUBLIC_ARTICLE_CARD_COLUMNS } from "@/lib/homepage/selection";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import { ARTICLE_MEDIA_BUCKET } from "@/server/articles/hero";
import type {
  Article,
  ArticleInput,
  ArticleListItem,
  PublicArticle,
  PublicArticleCard,
} from "@/server/articles/types";

const ARTICLE_COLUMNS =
  "id, title, slug, excerpt, body, hero_image_path, status, published_at, seo_title, seo_description, created_at, updated_at" as const;

function asArticle(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  hero_image_path: string | null;
  status: string;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    hero_image_path: row.hero_image_path,
    status: asArticleStatus(String(row.status)),
    published_at: row.published_at,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function getArticleHeroPublicUrl(storagePath: string) {
  const { url } = getSupabasePublicEnv();
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${ARTICLE_MEDIA_BUCKET}/${storagePath}`;
}

export async function listOperatorArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list articles", { code: error.code });
    throw new Error("Unable to load Articles.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: asArticleStatus(String(row.status)),
    published_at: row.published_at,
    updated_at: row.updated_at,
  })) as ArticleListItem[];
}

export async function getArticleById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load article", { code: error.code });
    throw new Error("Unable to load that Article.");
  }

  return data ? asArticle(data) : null;
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load article by slug", { code: error.code });
    throw new Error("Unable to load that Article.");
  }

  return data ? asArticle(data) : null;
}

export async function insertArticle(input: ArticleInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      body: input.body,
      status: input.status,
      published_at: input.published_at,
      seo_title: input.seo_title,
      seo_description: input.seo_description,
    })
    .select(ARTICLE_COLUMNS)
    .maybeSingle();

  return { data: data ? asArticle(data) : null, error };
}

export async function updateArticleRecord(id: string, input: ArticleInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .update({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      body: input.body,
      status: input.status,
      published_at: input.published_at,
      seo_title: input.seo_title,
      seo_description: input.seo_description,
    })
    .eq("id", id)
    .select(ARTICLE_COLUMNS)
    .maybeSingle();

  return { data: data ? asArticle(data) : null, error };
}

export async function updateArticleHeroPath(
  id: string,
  heroImagePath: string | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ hero_image_path: heroImagePath })
    .eq("id", id);

  return { error };
}

export async function deleteArticleRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  return { error };
}

function toPublicCard(article: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  hero_image_path: string | null;
  status: string;
  published_at: string | null;
}): PublicArticleCard | null {
  if (!isPubliclyVisibleArticle(article) || !article.published_at) {
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    published_at: article.published_at,
    hero_image_url: article.hero_image_path
      ? getArticleHeroPublicUrl(article.hero_image_path)
      : null,
  };
}

async function queryPublicArticleCards(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(PUBLIC_ARTICLE_CARD_COLUMNS)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to list public articles", { code: error.code });
    throw new Error("Unable to load Articles.");
  }

  return (data ?? [])
    .map((row) => toPublicCard(row))
    .filter((card): card is PublicArticleCard => Boolean(card));
}

export async function listPublicArticles() {
  return queryPublicArticleCards();
}

export async function listLatestPublicArticles(limit: number) {
  return queryPublicArticleCards(limit);
}

export async function getPublicArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("Failed to load public article", { code: error.code });
    throw new Error("Unable to load that Article.");
  }

  if (!data) {
    return null;
  }

  const article = asArticle(data);
  if (!isPubliclyVisibleArticle(article) || !article.published_at) {
    return null;
  }

  const publicArticle: PublicArticle = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    published_at: article.published_at,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    hero_image_url: article.hero_image_path
      ? getArticleHeroPublicUrl(article.hero_image_path)
      : null,
  };

  return publicArticle;
}
