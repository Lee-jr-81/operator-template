import Link from "next/link";
import { CategoryImage } from "@/components/categories/category-image";
import { cn } from "@/lib/cn";

export function CategoryCard({
  name,
  slug,
  imageUrl,
}: {
  name: string;
  slug: string;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={`/categories/${slug}`}
      aria-label={name}
      className="group relative block aspect-square overflow-hidden rounded-(--radius-card)"
    >
      <CategoryImage
        imageUrl={imageUrl}
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 29vw, 58vw"
        clearTitle
      />
      <h3
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 text-base font-semibold leading-tight transition duration-200 motion-safe:group-hover:translate-x-0.5",
          imageUrl
            ? "bg-linear-to-t from-black/60 to-transparent text-white"
            : "text-(--public-text)",
        )}
      >
        {name}
      </h3>
    </Link>
  );
}
