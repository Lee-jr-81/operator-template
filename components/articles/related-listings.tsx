import Image from "next/image";
import Link from "next/link";
import { ListingImageFallback } from "@/components/listings/listing-image-fallback";
import { formatCardPrice } from "@/components/listings/vertical-card";
import { TERMINOLOGY } from "@/config/terminology";
import type { PublicListingCard } from "@/server/listings/types";

export function RelatedListings({
  listings,
  heading,
  categoryHref,
  categoryLabel,
}: {
  listings: PublicListingCard[];
  heading: string;
  categoryHref?: string;
  categoryLabel?: string;
}) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <aside className="min-w-0" aria-labelledby="article-listings-heading">
      <h2
        id="article-listings-heading"
        className="text-base font-semibold tracking-tight text-(--public-text)"
      >
        {heading}
      </h2>
      <ul className="mt-4 space-y-4">
        {listings.map((listing) => {
          const detail = [
            listing.details.service_format.trim(),
            listing.details.duration_text.trim(),
            formatCardPrice(listing.details.price_text.trim()),
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={listing.id}>
              <Link
                href={`/listings/${listing.slug}`}
                aria-label={listing.title}
                className="group flex min-w-0 gap-3"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-(--public-muted)">
                  {listing.image ? (
                    <Image
                      src={listing.image.url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <ListingImageFallback label="" className="h-full rounded-none text-xs" />
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-semibold leading-5 text-(--public-text) group-hover:text-(--brand-primary)">
                    {listing.title}
                  </span>
                  {detail ? (
                    <span className="mt-1 block min-w-0 truncate text-xs text-(--public-text-muted)">
                      {detail}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {categoryHref ? (
        <p className="mt-5">
          <Link
            href={categoryHref}
            className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            View the {categoryLabel ?? TERMINOLOGY.category.singular.toLowerCase()}
          </Link>
        </p>
      ) : null}
    </aside>
  );
}
