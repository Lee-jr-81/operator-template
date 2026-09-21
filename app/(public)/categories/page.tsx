import type { Metadata } from "next";
import { CategoryCard } from "@/components/categories/category-card";
import { Container } from "@/components/ui/container";
import { TERMINOLOGY } from "@/config/terminology";
import {
  getCategoryImagePublicUrl,
  listCategories,
} from "@/server/categories/queries";

export const metadata: Metadata = {
  title: TERMINOLOGY.category.plural,
  description: "Browse the main areas of this marketplace.",
  alternates: {
    canonical: "/categories",
  },
};

export default async function CategoriesIndexPage() {
  const categories = await listCategories();

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {TERMINOLOGY.category.plural}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        Browse the main areas of this marketplace. Open a Category to see its
        Listings.
      </p>

      {categories.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">
          Categories will appear here as they are added.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard
                name={category.name}
                slug={category.slug}
                imageUrl={
                  category.image_path
                    ? getCategoryImagePublicUrl(category.image_path)
                    : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
