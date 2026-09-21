import Image from "next/image";
import Link from "next/link";
import { ListingImageFallback } from "@/components/listings/listing-image-fallback";
import { VerticalCardMeta } from "@/components/listings/vertical-card";
import { BUSINESS } from "@/config/business";
import { cn } from "@/lib/cn";
import { mediaZoomClass } from "@/lib/public-layout";
import type { PublicListingCard } from "@/server/listings/types";

function formatAddedOn(iso: string) {
  const formatted = new Intl.DateTimeFormat(BUSINESS.locale.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(iso));

  return `Added on ${formatted}`;
}

export function ListingCard({
  listing,
  layout = "compact",
}: {
  listing: PublicListingCard;
  layout?: "compact" | "browse";
}) {
  const isBrowse = layout === "browse";

  return (
    <article
      className={cn("h-full w-full", !isBrowse && "mx-auto max-w-[320px]")}
    >
      <Link
        href={`/listings/${listing.slug}`}
        aria-label={listing.title}
        className={cn(
          "group flex h-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(26,25,22,0.035)] transition duration-200",
          isBrowse ? "flex-col md:h-95 md:flex-row" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-neutral-50",
            isBrowse
              ? "aspect-3/2 w-full md:h-full md:w-[60%] md:aspect-auto"
              : "aspect-3/2",
          )}
        >
          {listing.image ? (
            <Image
              src={listing.image.url}
              alt=""
              fill
              sizes={
                isBrowse
                  ? "(max-width: 768px) 100vw, 60vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className={mediaZoomClass()}
            />
          ) : (
            <ListingImageFallback className="h-full min-h-full rounded-none aspect-auto" />
          )}
          {listing.current_deal ? (
            <p className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-(--radius-button) bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
              {listing.current_deal.headline}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col px-4 pb-4 pt-2",
            isBrowse && "w-full md:w-[40%] md:px-6 md:pt-6",
          )}
        >
          <p className="truncate text-xs text-(--public-text-subtle)">
            {listing.category_name}
          </p>
          <h2 className="mt-1 text-[20px] font-semibold leading-tight tracking-tight text-(--public-text) transition duration-200 group-hover:text-(--brand-primary)">
            <span className="line-clamp-2">{listing.title}</span>
          </h2>
          <VerticalCardMeta details={listing.details} />
          {listing.summary.trim() ? (
            <p
              className={cn(
                "mt-2 min-w-0 text-[14px] leading-[1.45] text-(--public-text-muted)",
                isBrowse ? "line-clamp-2" : "truncate",
              )}
            >
              {listing.summary}
            </p>
          ) : null}
          <div className="mt-auto pt-3">
            <p className="text-xs text-(--public-text-muted)">
              {formatAddedOn(listing.created_at)}
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="min-w-0 max-w-[70%] truncate rounded-md bg-[color-mix(in_srgb,var(--brand-primary)_8%,transparent)] px-2.5 py-1 text-xs font-regular text-(--public-text)">
                {listing.entity_name}
              </p>
              {listing.entity_location ? (
                <p className="min-w-0 shrink-0 truncate text-right text-xs text-(--public-text-subtle)">
                  {listing.entity_location}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
