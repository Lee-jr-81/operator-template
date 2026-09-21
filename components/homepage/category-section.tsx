import { CategoryCard } from "@/components/categories/category-card";
import { TERMINOLOGY } from "@/config/terminology";
import { HOMEPAGE_CATEGORY_VISIBLE } from "@/lib/homepage/limits";
import {
  categoryScrollerClass,
  categoryScrollerItemClass,
} from "@/lib/public-layout";
import type { Category } from "@/server/categories/types";

type HomepageCategory = Pick<
  Category,
  "id" | "name" | "slug" | "description"
> & {
  imageUrl?: string | null;
};

export function HomepageCategorySection({
  categories,
}: {
  categories: HomepageCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  const visible = categories.slice(0, HOMEPAGE_CATEGORY_VISIBLE);

  return (
    <section aria-label={TERMINOLOGY.category.plural}>
      <ul className={categoryScrollerClass(visible.length)}>
        {visible.map((category) => (
          <li
            key={category.id}
            className={categoryScrollerItemClass(visible.length)}
          >
            <CategoryCard
              name={category.name}
              slug={category.slug}
              imageUrl={category.imageUrl}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
