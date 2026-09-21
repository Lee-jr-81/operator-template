import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCategory } from "@/server/categories/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import { getCategoryById } from "@/server/categories/queries";

export const metadata: Metadata = {
  title: `Delete ${term("category", "singular")}`,
};

export default async function DeleteCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/categories"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to {TERMINOLOGY.category.plural}
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Delete {term("category", "singular")}
        </h1>
      </div>
      <Card className="max-w-3xl space-y-4">
        <p className="text-sm leading-6 text-(--dash-muted-fg)">
          Delete <span className="font-semibold">{category.name}</span>? This
          cannot be undone. A Category that still has Listings cannot be
          deleted until those Listings are moved or deleted.
        </p>
        <form action={deleteCategory} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={category.id} />
          <Button type="submit" variant="danger">
            Delete {category.name}
          </Button>
          <Link
            href="/dashboard/categories"
            className="inline-flex h-[42px] items-center justify-center rounded-[8px] border border-(--dash-border) bg-(--dash-card) px-3.5 text-sm font-semibold text-(--dash-fg) hover:bg-(--dash-muted)"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
}
