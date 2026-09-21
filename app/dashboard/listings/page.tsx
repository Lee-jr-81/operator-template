import type { Metadata } from "next";
import Link from "next/link";
import { DuplicateListingButton } from "@/app/dashboard/listings/duplicate-button";
import { ListingStatusBanner } from "@/app/dashboard/listings/status-banner";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonClass } from "@/components/ui/button";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY, term } from "@/config/terminology";
import {
  dashDangerLink,
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import { listCategories } from "@/server/categories/queries";
import { listEntities } from "@/server/entities/queries";
import { listOperatorListings } from "@/server/listings/queries";

export const metadata: Metadata = {
  title: TERMINOLOGY.listing.plural,
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(BUSINESS.locale.language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [listings, categories, entities] = await Promise.all([
    listOperatorListings(),
    listCategories(),
    listEntities(),
  ]);
  const canCreate = categories.length > 0 && entities.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title={TERMINOLOGY.listing.plural}
        description="What people discover. Every Listing belongs to a Category and an Entity."
        action={
          canCreate ? (
            <Link href="/dashboard/listings/new" className={buttonClass.primary}>
              Create {term("listing", "singular")}
            </Link>
          ) : null
        }
      />

      <ListingStatusBanner status={status} />

      {listings.length === 0 ? (
        <EmptyState title={`No ${TERMINOLOGY.listing.plural} yet`}>
          {!canCreate ? (
            <>
              <p>
                A Listing needs both a Category and an Entity. Create the missing
                piece first.
              </p>
              <p className="flex flex-wrap gap-4">
                {categories.length === 0 ? (
                  <Link href="/dashboard/categories/new" className={dashLink}>
                    Create {term("category", "singular")}
                  </Link>
                ) : null}
                {entities.length === 0 ? (
                  <Link href="/dashboard/entities/new" className={dashLink}>
                    Create {term("entity", "singular")}
                  </Link>
                ) : null}
              </p>
            </>
          ) : (
            <>
              <p>
                Create your first Listing by choosing the Entity providing it and
                the Category it belongs to.
              </p>
              <p>
                <Link href="/dashboard/listings/new" className={dashLink}>
                  Create first {term("listing", "singular")}
                </Link>
              </p>
            </>
          )}
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>
                {term("listing", "singular")}
              </DataTableHeaderCell>
              <DataTableHeaderCell>
                {term("category", "singular")}
              </DataTableHeaderCell>
              <DataTableHeaderCell>
                {term("entity", "singular")}
              </DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Updated</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className={dashTr}>
                <td className={`${dashTd} font-medium`}>{listing.title}</td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {listing.category_name}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {listing.entity_name}
                </td>
                <td className={dashTd}>
                  <StatusBadge
                    tone={listing.status === "active" ? "success" : "muted"}
                  >
                    {listing.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {formatUpdatedAt(listing.updated_at)}
                </td>
                <td className={`${dashTd} text-right`}>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      href={`/dashboard/listings/${listing.id}`}
                      className={dashLink}
                    >
                      Edit
                    </Link>
                    <DuplicateListingButton
                      listingId={listing.id}
                      className={dashLink}
                    />
                    <Link
                      href={`/dashboard/listings/${listing.id}/delete`}
                      className={dashDangerLink}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
