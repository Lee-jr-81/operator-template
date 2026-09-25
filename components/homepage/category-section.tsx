"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const scrolls = categories.length > HOMEPAGE_CATEGORY_VISIBLE;
  const [edges, setEdges] = useState({ prev: false, next: scrolls });

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    function updateEdges() {
      const current = listRef.current;
      if (!current) {
        return;
      }
      const max = current.scrollWidth - current.clientWidth;
      setEdges({
        prev: current.scrollLeft > 4,
        next: current.scrollLeft < max - 4,
      });
    }

    updateEdges();
    list.addEventListener("scroll", updateEdges, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateEdges);
    observer?.observe(list);
    return () => {
      list.removeEventListener("scroll", updateEdges);
      observer?.disconnect();
    };
  }, [categories.length]);

  if (categories.length === 0) {
    return null;
  }

  function scrollByCard(direction: -1 | 1) {
    const list = listRef.current;
    const card = list?.querySelector("li");
    if (!list || !card) {
      return;
    }
    const gap = Number.parseFloat(getComputedStyle(list).columnGap || "0");
    const distance = card.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <section aria-label={TERMINOLOGY.category.plural} className="relative">
      <ul
        id={listId}
        ref={listRef}
        className={categoryScrollerClass(categories.length)}
      >
        {categories.map((category) => (
          <li
            key={category.id}
            className={categoryScrollerItemClass(categories.length)}
          >
            <CategoryCard
              name={category.name}
              slug={category.slug}
              imageUrl={category.imageUrl}
            />
          </li>
        ))}
      </ul>
      {scrolls ? (
        <>
          <ScrollButton
            label={`Previous ${TERMINOLOGY.category.plural.toLowerCase()}`}
            direction="previous"
            controls={listId}
            disabled={!edges.prev}
            onClick={() => scrollByCard(-1)}
          />
          <ScrollButton
            label={`Next ${TERMINOLOGY.category.plural.toLowerCase()}`}
            direction="next"
            controls={listId}
            disabled={!edges.next}
            onClick={() => scrollByCard(1)}
          />
        </>
      ) : null}
    </section>
  );
}

function ScrollButton({
  label,
  direction,
  controls,
  disabled,
  onClick,
}: {
  label: string;
  direction: "previous" | "next";
  controls: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const position =
    direction === "previous"
      ? "left-0 translate-[-50%_-50%]"
      : "right-0 translate-[50%_-50%]";

  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-(--public-border) bg-white text-(--public-text) shadow-sm transition hover:bg-(--brand-soft) disabled:pointer-events-none disabled:opacity-0 lg:inline-flex ${position}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d={direction === "previous" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
