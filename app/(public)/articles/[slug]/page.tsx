import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/articles/article-body";
import { RelatedListings } from "@/components/articles/related-listings";
import { Container } from "@/components/ui/container";
import { formatArticlePublishedDate } from "@/lib/articles/format";
import {
  ARTICLE_LISTING_BAND_MIN,
  buildArticleListingBand,
} from "@/lib/articles/listing-band";
import { articlePageMetadata } from "@/server/articles/metadata";
import { getPublicArticleBySlug } from "@/server/articles/queries";
import { listPublicRelatedListingCards } from "@/server/articles/related-queries";
import { listPublicRecentListingCards } from "@/server/listings/queries";

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

  const [relatedListings, latestListings] = await Promise.all([
    listPublicRelatedListingCards(article.id),
    listPublicRecentListingCards(ARTICLE_LISTING_BAND_MIN),
  ]);
  const listingBand = buildArticleListingBand(relatedListings, latestListings);
  const excerpt = article.excerpt.trim();

  return (
    <>
      <Container className="py-12 sm:py-16">
        <p className="text-sm text-(--public-text-subtle)">
          <Link
            href="/articles"
            className="font-medium text-(--public-text) underline-offset-4 hover:underline"
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
        {excerpt ? (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-(--public-text-muted)">
            {excerpt}
          </p>
        ) : null}
        {article.hero_image_url ? (
          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl sm:h-112">
            <Image
              src={article.hero_image_url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <ArticleBody markdown={article.body} />
      </Container>
      {listingBand ? (
        <RelatedListings
          listings={listingBand.listings}
          heading={listingBand.heading}
        />
      ) : null}
    </>
  );
}
