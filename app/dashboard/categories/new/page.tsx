import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm } from "@/app/dashboard/categories/category-form";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY, term } from "@/config/terminology";

export const metadata: Metadata = {
  title: `Create ${term("category", "singular")}`,
};

export default function NewCategoryPage() {
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
          Create {term("category", "singular")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Add one of the main areas visitors will browse. You can edit this later.
        </p>
      </div>
      <Card className="max-w-3xl">
        <CategoryForm />
      </Card>
    </div>
  );
}
