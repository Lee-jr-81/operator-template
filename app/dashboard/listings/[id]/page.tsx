import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DuplicateListingButton } from "@/app/dashboard/listings/duplicate-button";
import { ListingForm } from "@/app/dashboard/listings/listing-form";
import { ListingMediaPanel } from "@/app/dashboard/listings/listing-media-panel";
import { ListingStatusBanner } from "@/app/dashboard/listings/status-banner";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import { listCategories } from "@/server/categories/queries";
import { listEntities } from "@/server/entities/queries";
import { getListingMediaPublicUrl, listListingMedia } from "@/server/listings/media-queries";
import {
  getListingById,
  getListingDetails,
} from "@/server/listings/queries";

export const metadata: Metadata = {
  title: `Edit ${term("listing", "singular")}`,
};

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const [listing, details, categories, entities, media] = await Promise.all([
    getListingById(id),
    getListingDetails(id),
    listCategories(),
    listEntities(),
    listListingMedia(id),
  ]);

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/listings"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to {TERMINOLOGY.listing.plural}
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Edit {term("listing", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Changing Category or Entity updates how this Listing is organised.
          Setting status to Inactive hides it from the public site. Add images
          after the Listing exists.
        </p>
        <div className="mt-3">
          <DuplicateListingButton
            listingId={listing.id}
            className="text-sm font-medium text-(--dash-fg) underline-offset-4 hover:underline"
          />
        </div>
      </div>
      <ListingStatusBanner status={status} />
      <Card className="max-w-3xl">
        <ListingMediaPanel
          listingId={listing.id}
          media={media.map((item) => ({
            ...item,
            url: getListingMediaPublicUrl(item.storage_path),
          }))}
        />
      </Card>
      <Card className="max-w-3xl">
        <ListingForm
          listing={listing}
          details={details}
          categories={categories}
          entities={entities}
        />
      </Card>
    </div>
  );
}
