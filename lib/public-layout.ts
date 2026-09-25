import { cn } from "@/lib/cn";
import { HOMEPAGE_CATEGORY_VISIBLE } from "@/lib/homepage/limits";

export const publicSectionClass = "py-14 sm:py-[4.5rem] lg:py-24";
export const publicProofSectionClass = "py-12 sm:py-16 lg:py-20";

export function listingCardGridClass(count: number) {
  if (count <= 1) {
    return "mx-auto grid max-w-[320px] grid-cols-1 gap-4";
  }

  if (count === 2) {
    return "mx-auto grid max-w-[656px] grid-cols-1 gap-4 sm:grid-cols-2";
  }

  return "mx-auto grid max-w-[992px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
}

export function articleCardGridClass(count: number) {
  return listingCardGridClass(count);
}

export function categoryScrollerClass(count: number) {
  if (count === 1) {
    return "flex justify-center";
  }

  const scroller =
    "no-scrollbar flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto";

  if (count <= HOMEPAGE_CATEGORY_VISIBLE) {
    return `${scroller} lg:grid lg:snap-none lg:grid-cols-5 lg:gap-4 lg:overflow-visible`;
  }

  return `${scroller} lg:gap-4`;
}

export function categoryScrollerItemClass(count: number) {
  if (count === 1) {
    return "w-[58%] max-w-[243px] lg:w-[148px] lg:max-w-none";
  }

  // Cut off the next card so the row reads as scrollable without a scrollbar.
  const item =
    "w-[calc(100%-4.5rem)] shrink-0 snap-start sm:w-[calc((100%-4.5rem)/2)]";

  if (count <= HOMEPAGE_CATEGORY_VISIBLE) {
    return `${item} lg:w-auto lg:min-w-0 lg:shrink`;
  }

  return `${item} lg:w-[calc((100%-4rem)/5)]`;
}

export function viewAllLabel(plural: string) {
  return `View all ${plural.toLowerCase()} →`;
}

export function mediaZoomClass(className?: string) {
  return cn(
    "public-media-zoom object-cover transition duration-200 motion-safe:group-hover:scale-[1.02]",
    className,
  );
}
