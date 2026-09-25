import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/articles/article-body";
import { RelatedListings } from "@/components/articles/related-listings";
import { CoverImage } from "@/components/media/cover-image";
import { Container } from "@/components/ui/container";
import { formatArticlePublishedDate } from "@/lib/articles/format";
import {
  ARTICLE_CATEGORY_LISTING_LIMIT,
  articleCategoryListingHeading,
} from "@/lib/articles/listing-band";
import { TERMINOLOGY } from "@/config/terminology";
import { articlePageMetadata } from "@/server/articles/metadata";
import { getPublicArticleBySlug } from "@/server/articles/queries";
import { getCategoryById } from "@/server/categories/queries";
import { listLatestPublicListingsByCategoryId } from "@/server/listings/queries";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const metadata = articlePageMetadata(article);

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = article.category_id
    ? await getCategoryById(article.category_id)
    : null;
  const listings = category
    ? await listLatestPublicListingsByCategoryId(
        category.id,
        ARTICLE_CATEGORY_LISTING_LIMIT,
      )
    : [];

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm text-(--public-text-subtle)">
        <Link
          href="/articles"
          className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
        >
          Articles
        </Link>
        <span>
          {" "}
          ·{" "}
          <time dateTime={article.published_at}>
            {formatArticlePublishedDate(article.published_at)}
          </time>
        </span>
      </p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-(--public-text) sm:text-4xl">
        {article.title}
      </h1>
      {article.hero_image_url ? (
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl sm:h-112">
          <CoverImage
            src={article.hero_image_url}
            alt=""
            priority
            sizes="100vw"
            focalX={article.hero_focal_x}
            focalY={article.hero_focal_y}
          />
        </div>
      ) : null}
      {listings.length > 0 && category ? (
        <div className="mt-10 grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-x-12">
          <ArticleBody className="min-w-0 lg:col-span-2" markdown={article.body} />
          <RelatedListings
            listings={listings}
            heading={articleCategoryListingHeading(category.name)}
            categoryHref={`/categories/${category.slug}`}
            categoryLabel={TERMINOLOGY.category.singular.toLowerCase()}
          />
        </div>
      ) : (
        <ArticleBody className="mx-auto mt-10 max-w-2xl" markdown={article.body} />
      )}
    </Container>
  );
}
