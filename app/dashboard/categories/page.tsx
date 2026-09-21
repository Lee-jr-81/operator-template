import type { Metadata } from "next";
import Link from "next/link";
import { CategoryStatusBanner } from "@/app/dashboard/categories/status-banner";
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
import { listCategories } from "@/server/categories/queries";

export const metadata: Metadata = {
  title: TERMINOLOGY.category.plural,
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

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const categories = await listCategories();

  return (
    <div className="space-y-5">
      <PageHeader
        title={TERMINOLOGY.category.plural}
        description="Sections visitors browse. One Category is enough if that is all the niche needs."
        action={
          <Link href="/dashboard/categories/new" className={buttonClass.primary}>
            Create {term("category", "singular")}
          </Link>
        }
      />

      <CategoryStatusBanner status={status} />

      {categories.length === 0 ? (
        <EmptyState title={`No ${TERMINOLOGY.category.plural} yet`}>
          <p>Start with the simplest structure that makes sense for your niche.</p>
          <p>
            <Link href="/dashboard/categories/new" className={dashLink}>
              Create first {term("category", "singular")}
            </Link>
          </p>
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Name</DataTableHeaderCell>
              <DataTableHeaderCell>Slug</DataTableHeaderCell>
              <DataTableHeaderCell>Updated</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className={dashTr}>
                <td className={`${dashTd} font-medium`}>{category.name}</td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {category.slug}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {formatUpdatedAt(category.updated_at)}
                </td>
                <td className={`${dashTd} text-right`}>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      href={`/dashboard/categories/${category.id}`}
                      className={dashLink}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/categories/${category.id}/delete`}
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
