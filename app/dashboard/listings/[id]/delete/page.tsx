import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteListing } from "@/server/listings/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import { getListingById } from "@/server/listings/queries";

export const metadata: Metadata = {
  title: `Delete ${term("listing", "singular")}`,
};

export default async function DeleteListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/listings"
            className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Back to {TERMINOLOGY.listing.plural}
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Delete {term("listing", "singular")}
        </h1>
      </div>
      <Card className="max-w-3xl space-y-4">
        <p className="text-sm leading-6 text-(--dash-muted-fg)">
          Delete <span className="font-semibold">{listing.title}</span>? This
          cannot be undone. Its vertical details, images, and Deals are
          removed with it. The Category and Entity stay in place. If this
          Listing has Enquiries, deletion is blocked so the lead history is
          kept.
        </p>
        <form action={deleteListing} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={listing.id} />
          <Button type="submit" variant="danger">
            Delete {listing.title}
          </Button>
          <Link
            href="/dashboard/listings"
            className="inline-flex h-[42px] items-center justify-center rounded-[8px] border border-(--dash-border) bg-(--dash-card) px-3.5 text-sm font-semibold text-(--dash-fg) hover:bg-(--dash-muted)"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
}
