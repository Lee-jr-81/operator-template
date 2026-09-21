import type { ArticleStatus } from "@/lib/articles/status";
import type { ListingStatus } from "@/server/listings/status";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  hero_image_path: string | null;
  status: ArticleStatus;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: ArticleStatus;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
};

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  published_at: string | null;
  updated_at: string;
};

export type PublicArticleCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  hero_image_url: string | null;
};

export type PublicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  hero_image_url: string | null;
};

export type ArticleFieldErrors = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
};

export type ArticleListing = {
  article_id: string;
  listing_id: string;
  sort_order: number;
  created_at: string;
};

export type ArticleRelatedListing = {
  listing_id: string;
  sort_order: number;
  title: string;
  entity_name: string;
  category_name: string;
  status: ListingStatus;
};
