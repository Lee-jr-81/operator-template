import { ListingCard } from "@/components/listings/listing-card";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { listingCardGridClass } from "@/lib/public-layout";
import type { PublicListingCard } from "@/server/listings/types";

export function RelatedListings({
  listings,
  heading,
}: {
  listings: PublicListingCard[];
  heading: string;
}) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-(--public-muted) py-14 sm:py-20"
      aria-labelledby="article-listings-heading"
    >
      <Container>
        <h2
          id="article-listings-heading"
          className="text-[28px] font-bold tracking-tight text-(--public-text) lg:text-[32px]"
        >
          {heading}
        </h2>
        <ul className={cn("mt-10", listingCardGridClass(listings.length))}>
          {listings.map((listing) => (
            <li key={listing.id} className="w-full">
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
