import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEntity } from "@/server/entities/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import { getEntityById } from "@/server/entities/queries";

export const metadata: Metadata = {
  title: `Delete ${term("entity", "singular")}`,
};

export default async function DeleteEntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = await getEntityById(id);

  if (!entity) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/entities"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to {TERMINOLOGY.entity.plural}
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Delete {term("entity", "singular")}
        </h1>
      </div>
      <Card className="max-w-3xl space-y-4">
        <p className="text-sm leading-6 text-(--dash-muted-fg)">
          Delete <span className="font-semibold">{entity.name}</span>? This
          cannot be undone. An Entity that still has Listings cannot be deleted
          until those Listings are moved or deleted.
        </p>
        <form action={deleteEntity} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={entity.id} />
          <Button type="submit" variant="danger">
            Delete {entity.name}
          </Button>
          <Link
            href="/dashboard/entities"
            className="inline-flex h-[42px] items-center justify-center rounded-[8px] border border-(--dash-border) bg-(--dash-card) px-3.5 text-sm font-semibold text-(--dash-fg) hover:bg-(--dash-muted)"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
}
