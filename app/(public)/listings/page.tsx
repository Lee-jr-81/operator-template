import type { Metadata } from "next";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsBrowseAside } from "@/components/listings/listings-browse-aside";
import { Container } from "@/components/ui/container";
import { TERMINOLOGY } from "@/config/terminology";
import { listPublicHomepageCategories } from "@/server/categories/queries";
import { listPublicListings } from "@/server/listings/queries";

export const metadata: Metadata = {
  title: TERMINOLOGY.listing.plural,
  description: `Browse the current ${TERMINOLOGY.listing.plural} on this marketplace.`,
  alternates: {
    canonical: "/listings",
  },
};

const BROWSE_CATEGORY_LIMIT = 12;

export default async function ListingsIndexPage() {
  const [listings, categories] = await Promise.all([
    listPublicListings(),
    listPublicHomepageCategories(BROWSE_CATEGORY_LIMIT),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {TERMINOLOGY.listing.plural}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        Browse what is currently available. Each Listing belongs to a Category
        and is provided by an Entity.
      </p>

      {listings.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">
          Listings will appear here as they are published.
        </p>
      ) : (
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,20rem)] lg:items-start lg:gap-8">
          <ul className="grid grid-cols-1 gap-4">
            {listings.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} layout="browse" />
              </li>
            ))}
          </ul>
          <ListingsBrowseAside categories={categories} />
        </div>
      )}
    </Container>
  );
}
