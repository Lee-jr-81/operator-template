import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/app/dashboard/categories/category-form";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";
import {
  getCategoryById,
  getCategoryImagePublicUrl,
} from "@/server/categories/queries";

export const metadata: Metadata = {
  title: `Edit ${term("category", "singular")}`,
};

export default async function EditCategoryPage({
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
            className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Back to {TERMINOLOGY.category.plural}
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Edit {term("category", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Changes appear on the public Category page. Changing the slug changes
          the public URL.
        </p>
      </div>
      <Card className="max-w-3xl">
        <CategoryForm
          category={category}
          imageUrl={
            category.image_path
              ? getCategoryImagePublicUrl(category.image_path)
              : null
          }
        />
      </Card>
    </div>
  );
}
