import { cn } from "@/lib/cn";

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

  return "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 lg:justify-center lg:gap-4 lg:overflow-visible lg:pb-0";
}

export function categoryScrollerItemClass(count: number) {
  if (count === 1) {
    return "w-[58%] max-w-[243px] lg:w-[148px] lg:max-w-none";
  }

  return "w-[58%] shrink-0 snap-start sm:w-[29%] lg:w-[148px] lg:shrink-0";
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
