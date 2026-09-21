import { ListingCard } from "@/components/listings/listing-card";
import { TERMINOLOGY } from "@/config/terminology";
import { cn } from "@/lib/cn";
import { listingCardGridClass } from "@/lib/public-layout";
import type { PublicListingCard } from "@/server/listings/types";

function ListingSectionTitle({
  title,
  align = "start",
  underlineListings = false,
}: {
  title: string;
  align?: "start" | "center";
  underlineListings?: boolean;
}) {
  const listingsWord = TERMINOLOGY.listing.plural.toLowerCase();
  const showUnderline =
    underlineListings && title.toLowerCase().endsWith(listingsWord);
  const prefix = showUnderline
    ? title.slice(0, title.length - listingsWord.length).trimEnd()
    : title;

  return (
    <div className={cn("mb-16 sm:mb-20", align === "center" && "text-center")}>
      <h2 className="text-[28px] font-bold tracking-tight text-(--public-text) lg:text-[32px]">
        {showUnderline ? (
          <>
            {prefix}{" "}
            <span className="underline decoration-2 decoration-(--brand-primary) underline-offset-[0.24em]">
              {listingsWord}
            </span>
          </>
        ) : (
          title
        )}
      </h2>
    </div>
  );
}

export function HomepageListingSection({
  title,
  listings,
  align = "start",
  underlineListings = false,
}: {
  title: string;
  listings: PublicListingCard[];
  align?: "start" | "center";
  underlineListings?: boolean;
}) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section>
      <ListingSectionTitle
        title={title}
        align={align}
        underlineListings={underlineListings}
      />
      <ul className={listingCardGridClass(listings.length)}>
        {listings.map((listing) => (
          <li key={listing.id} className="w-full">
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  );
}
