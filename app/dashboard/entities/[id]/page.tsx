import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/app/dashboard/entities/entity-form";
import { EntityStatusBanner } from "@/app/dashboard/entities/status-banner";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import {
  getEntityById,
  getEntityLogoPublicUrl,
} from "@/server/entities/queries";
import { getLocationById } from "@/server/locations/queries";

export const metadata: Metadata = {
  title: `Edit ${term("entity", "singular")}`,
};

export default async function EditEntityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const entity = await getEntityById(id);

  if (!entity) {
    notFound();
  }

  const location = entity.location_id
    ? await getLocationById(entity.location_id)
    : null;

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
          Edit {term("entity", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Operator notes and contact name stay private. Only contact details you
          mark as public can appear on Listing pages.
        </p>
      </div>
      <EntityStatusBanner status={status} />
      <Card className="max-w-3xl">
        <EntityForm
          entity={entity}
          location={location}
          logoUrl={getEntityLogoPublicUrl(entity.logo_path)}
        />
      </Card>
    </div>
  );
}
