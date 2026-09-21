import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ListingEnquirePanel,
  hasListingEnquireContent,
} from "@/components/listings/listing-enquire-panel";
import { ListingEntityBlock } from "@/components/listings/listing-entity";
import { ListingGallery } from "@/components/listings/listing-gallery";
import { ListingMapPanel } from "@/components/listings/listing-map-panel";
import { VerticalDetail } from "@/components/listings/vertical-detail";
import { Container } from "@/components/ui/container";
import { SEO } from "@/config/seo";
import { term } from "@/config/terminology";
import { listingPageMetadata } from "@/server/listings/metadata";
import { toListingMapMarkers } from "@/server/listings/map-markers";
import { getListingContactChannels } from "@/server/contact/queries";
import { getCurrentPublicDealsByListingIds } from "@/server/deals/queries";
import { getPublicListingBySlug } from "@/server/listings/queries";
import { formatConciseLocation } from "@/server/locations/format";

type ListingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicListingBySlug(slug);

  if (!result) {
    return { title: `${term("listing", "singular")} not found` };
  }

  const metadata = listingPageMetadata(result.listing);
  const primaryImage = result.media.find((item) => item.is_primary) ?? result.media[0];

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `/listings/${result.listing.slug}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [{ url: primaryImage?.url ?? SEO.defaultImage }],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const result = await getPublicListingBySlug(slug);

  if (!result) {
    notFound();
  }

  const { listing, category, entity, details, media } = result;
  const currentDeals = await getCurrentPublicDealsByListingIds([listing.id]);
  const currentDeal = currentDeals.get(listing.id) ?? null;
  const contactChannels = await getListingContactChannels(listing.id);
  const locationLabel = formatConciseLocation(entity.location);
  const markers = toListingMapMarkers([
    {
      listingId: listing.id,
      slug: listing.slug,
      title: listing.title,
      status: listing.status,
      entityName: entity.name,
      locationLabel,
      latitude: entity.location?.latitude ?? null,
      longitude: entity.location?.longitude ?? null,
    },
  ]);

  const showEnquire = hasListingEnquireContent({
    details,
    currentDeal,
    channels: contactChannels,
  });

  const listingBody = (
    <div className="space-y-8">
      {listing.summary.trim() ? (
        <p className="text-base leading-7 text-(--public-text-muted)">
          {listing.summary}
        </p>
      ) : null}
      {listing.description ? (
        <div className="whitespace-pre-wrap text-base leading-7 text-(--public-text-muted)">
          {listing.description}
        </div>
      ) : null}
      <VerticalDetail details={details} />
      {markers.length > 0 ? <ListingMapPanel markers={markers} compact /> : null}
      <ListingEntityBlock entity={entity} />
    </div>
  );

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm text-(--public-text-subtle)">
        <Link
          href={`/categories/${category.slug}`}
          className="font-medium text-(--public-text) underline-offset-4 hover:underline"
        >
          {category.name}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--public-text) sm:text-4xl">
        {listing.title}
      </h1>
      {locationLabel ? (
        <p className="mt-2 text-sm text-(--public-text-muted)">
          {locationLabel} · {category.name}
        </p>
      ) : (
        <p className="mt-2 text-sm text-(--public-text-muted)">{category.name}</p>
      )}
      <ListingGallery images={media} title={listing.title} />
      {showEnquire ? (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,22rem)]">
          <div className="lg:col-start-2 lg:row-start-1">
            <ListingEnquirePanel
              details={details}
              currentDeal={currentDeal}
              listingId={listing.id}
              listingTitle={listing.title}
              entityName={entity.name}
              channels={contactChannels}
            />
          </div>
          <div className="lg:col-start-1 lg:row-start-1">{listingBody}</div>
        </div>
      ) : (
        <div className="mt-10">{listingBody}</div>
      )}
    </Container>
  );
}
