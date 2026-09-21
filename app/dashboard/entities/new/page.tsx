import type { Metadata } from "next";
import Link from "next/link";
import { EntityForm } from "@/app/dashboard/entities/entity-form";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";

export const metadata: Metadata = {
  title: `Add ${term("entity", "singular")}`,
};

export default function NewEntityPage() {
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
          Add {term("entity", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Add a business, provider or person you have a relationship with.
          Listings are attached to this Entity.
        </p>
      </div>
      <Card className="max-w-3xl">
        <EntityForm />
      </Card>
    </div>
  );
}
