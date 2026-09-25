import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticlePromotionDrafts } from "@/app/dashboard/articles/promotion-drafts";
import { Card } from "@/components/ui/card";
import {
  buildFacebookArticlePost,
  buildInstagramArticlePost,
  buildLinkedInArticlePost,
  buildXArticlePost,
  canPromoteArticle,
} from "@/lib/articles/promotion-templates";
import { getPublicArticleUrl } from "@/lib/site-url";
import { getArticleById } from "@/server/articles/queries";

export const metadata: Metadata = {
  title: "Promote Article",
};

export default async function PromoteArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article || !canPromoteArticle(article.status)) {
    notFound();
  }

  const articleUrl = getPublicArticleUrl(article.slug);
  const source = articleUrl
    ? {
        title: article.title,
        excerpt: article.excerpt,
        url: articleUrl,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href={`/dashboard/articles/${article.id}`}
            className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Back to Article
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Promote Article
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          We&apos;ve created a few starting posts using your Article title,
          summary and link. Edit them to suit your audience, then copy them into
          the social platform you use. OperatorTemplate does not publish these for
          you.
        </p>
        <p className="mt-3 text-sm font-medium text-(--dash-fg)">{article.title}</p>
        <p className="mt-2">
          <Link
            href={`/articles/${article.slug}`}
            className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            View public Article
          </Link>
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Edit the post to match how you normally speak to your audience.
        </p>
      </div>

      {!source ? (
        <Card className="max-w-3xl">
          <p className="text-sm leading-6 text-(--dash-muted-fg)">
            Set <span className="font-medium">NEXT_PUBLIC_SITE_URL</span> in
            .env.local to the public site origin so promotional copy can include
            the Article URL.
          </p>
        </Card>
      ) : (
        <ArticlePromotionDrafts
          facebook={buildFacebookArticlePost(source)}
          instagram={buildInstagramArticlePost(source)}
          linkedin={buildLinkedInArticlePost(source)}
          x={buildXArticlePost(source)}
        />
      )}
    </div>
  );
}
