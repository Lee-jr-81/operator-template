import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listings/listing-card";
import { Container } from "@/components/ui/container";
import { getCategoryBySlug } from "@/server/categories/queries";
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

  const listings = await listPublicListingsByCategoryId(category.id);

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{category.name}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
        {category.description}
      </p>

      {listings.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">
          No Listings in this Category yet. They will appear here when they are
          published.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
