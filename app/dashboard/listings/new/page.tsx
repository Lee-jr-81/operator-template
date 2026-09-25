import type { Metadata } from "next";
import Link from "next/link";
import { ListingForm } from "@/app/dashboard/listings/listing-form";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import { listCategories } from "@/server/categories/queries";
import { listEntities } from "@/server/entities/queries";

export const metadata: Metadata = {
  title: `Create ${term("listing", "singular")}`,
};

export default async function NewListingPage() {
  const [categories, entities] = await Promise.all([
    listCategories(),
    listEntities(),
  ]);
  const missingCategories = categories.length === 0;
  const missingEntities = entities.length === 0;

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
          Create {term("listing", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Choose the Category and Entity first. After you save, you will add
          images on the next screen.
        </p>
      </div>

      {missingCategories || missingEntities ? (
        <Card className="max-w-3xl space-y-3">
          <h2 className="text-base font-medium">
            Create the missing pieces first
          </h2>
          <p className="text-sm leading-6 text-(--dash-muted-fg)">
            Every Listing needs one Category and one Entity. The form is hidden
            until both exist so you do not submit incomplete data.
          </p>
          <p className="flex flex-wrap gap-4">
            {missingCategories ? (
              <Link
                href="/dashboard/categories/new"
                className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
              >
                Create {term("category", "singular")}
              </Link>
            ) : null}
            {missingEntities ? (
              <Link
                href="/dashboard/entities/new"
                className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
              >
                Create {term("entity", "singular")}
              </Link>
            ) : null}
          </p>
        </Card>
      ) : (
        <Card className="max-w-3xl">
          <ListingForm categories={categories} entities={entities} />
        </Card>
      )}
    </div>
  );
}
