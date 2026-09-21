import type { Metadata } from "next";
import Link from "next/link";
import { EntityStatusBanner } from "@/app/dashboard/entities/status-banner";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { buttonClass } from "@/components/ui/button";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY, term } from "@/config/terminology";
import {
  dashDangerLink,
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import { listEntities } from "@/server/entities/queries";

export const metadata: Metadata = {
  title: TERMINOLOGY.entity.plural,
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

export default async function EntitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const entities = await listEntities();

  return (
    <div className="space-y-5">
      <PageHeader
        title={TERMINOLOGY.entity.plural}
        description="Businesses, providers or people behind the Listings."
        action={
          <Link href="/dashboard/entities/new" className={buttonClass.primary}>
            Add {term("entity", "singular")}
          </Link>
        }
      />

      <EntityStatusBanner status={status} />

      {entities.length === 0 ? (
        <EmptyState title={`No ${TERMINOLOGY.entity.plural} yet`}>
          <p>
            Start by adding someone you have established contact with or want to
            work with.
          </p>
          <p>
            <Link href="/dashboard/entities/new" className={dashLink}>
              Add first {term("entity", "singular")}
            </Link>
          </p>
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>
                {term("entity", "singular")}
              </DataTableHeaderCell>
              <DataTableHeaderCell>Contact</DataTableHeaderCell>
              <DataTableHeaderCell>Website</DataTableHeaderCell>
              <DataTableHeaderCell>Updated</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id} className={dashTr}>
                <td className={`${dashTd} font-medium`}>{entity.name}</td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {entity.contact_name ?? "—"}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {entity.website_url ?? "—"}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {formatUpdatedAt(entity.updated_at)}
                </td>
                <td className={`${dashTd} text-right`}>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      href={`/dashboard/entities/${entity.id}`}
                      className={dashLink}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/entities/${entity.id}/delete`}
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
