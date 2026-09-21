import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/app/dashboard/articles/article-form";
import { ArticleHeroPanel } from "@/app/dashboard/articles/hero-panel";
import { OriginalityPanel } from "@/app/dashboard/articles/originality-panel";
import { RelatedListingsPanel } from "@/app/dashboard/articles/related-listings-panel";
import { ArticleStatusBanner } from "@/app/dashboard/articles/status-banner";
import { Card } from "@/components/ui/card";
import { canPromoteArticle } from "@/lib/articles/promotion-templates";
import {
  getArticleById,
  getArticleHeroPublicUrl,
} from "@/server/articles/queries";
import { listArticleRelatedListings } from "@/server/articles/related-queries";
import { listOperatorListings } from "@/server/listings/queries";

export const metadata: Metadata = {
  title: "Edit Article",
};

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const [article, selected, listings] = await Promise.all([
    getArticleById(id),
    listArticleRelatedListings(id),
    listOperatorListings(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/articles"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to Articles
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Edit Article
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Draft Articles stay off the public site. Publishing makes the Article
          available at its slug when the published date is now or in the past.
        </p>
        {canPromoteArticle(article.status) ? (
          <div className="mt-3 flex flex-wrap gap-4">
            <Link
              href={`/articles/${article.slug}`}
              className="text-sm font-medium text-(--dash-fg) underline-offset-4 hover:underline"
            >
              View public Article
            </Link>
            <Link
              href={`/dashboard/articles/${article.id}/promote`}
              className="text-sm font-medium text-(--dash-fg) underline-offset-4 hover:underline"
            >
              Promote Article
            </Link>
          </div>
        ) : null}
      </div>
      <ArticleStatusBanner status={status} articleId={article.id} />
      <Card className="max-w-4xl">
        <ArticleHeroPanel
          articleId={article.id}
          heroUrl={
            article.hero_image_path
              ? getArticleHeroPublicUrl(article.hero_image_path)
              : null
          }
        />
      </Card>
      <Card className="max-w-4xl">
        <OriginalityPanel />
      </Card>
      <Card className="max-w-4xl">
        <RelatedListingsPanel
          articleId={article.id}
          selected={selected}
          listings={listings}
        />
      </Card>
      <Card className="max-w-4xl">
        <ArticleForm article={article} />
      </Card>
    </div>
  );
}
