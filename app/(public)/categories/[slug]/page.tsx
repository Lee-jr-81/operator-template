import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { ListingCard } from "@/components/listings/listing-card";
import { Container } from "@/components/ui/container";
import { TERMINOLOGY } from "@/config/terminology";
import { listPublicArticlesByCategoryId } from "@/server/articles/queries";
import {
  getCategoryBySlug,
  getCategoryImagePublicUrl,
} from "@/server/categories/queries";
import { listPublicListingsByCategoryId } from "@/server/listings/queries";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [listings, articles] = await Promise.all([
    listPublicListingsByCategoryId(category.id),
    listPublicArticlesByCategoryId(category.id),
  ]);
  const imageUrl = category.image_path
    ? getCategoryImagePublicUrl(category.image_path)
    : null;

  return (
    <Container className="py-12 sm:py-16">
      {imageUrl ? (
        <div className="relative mb-8 aspect-5/3 max-w-3xl overflow-hidden rounded-2xl bg-(--public-muted)">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-(--public-text)">
        {category.name}
      </h1>
      <p className="mt-4 max-w-2xl whitespace-pre-wrap text-base leading-7 text-(--public-text-muted)">
        {category.description}
      </p>

      {articles.length > 0 ? (
        <section className="mt-16 sm:mt-20 lg:mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-(--public-text)">
            {category.name} guides
          </h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {articles.map((article) => (
              <li key={article.id} className="w-full max-w-[320px]">
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {listings.length > 0 ? (
        <section className="mt-16 sm:mt-20 lg:mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-(--public-text)">
            {category.name} {TERMINOLOGY.listing.plural.toLowerCase()}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {listings.map((listing) => (
              <li key={listing.id} className="w-full max-w-[320px]">
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
