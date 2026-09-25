"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ListingImageFallback } from "@/components/listings/listing-image-fallback";
import { cn } from "@/lib/cn";
import type { PublicListingImage } from "@/server/listings/media";

function orderedListingImages(images: PublicListingImage[]) {
  const hero = images.find((item) => item.is_primary) ?? images[0] ?? null;
  if (!hero) {
    return [];
  }

  return [hero, ...images.filter((item) => item !== hero)];
}

export function ListingGallery({
  images,
  title,
}: {
  images: PublicListingImage[];
  title: string;
}) {
  const ordered = orderedListingImages(images);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  function openAt(nextIndex: number, target?: HTMLElement) {
    restoreFocus.current = target ?? null;
    setOpenIndex(nextIndex);
  }

  if (ordered.length === 0) {
    return (
      <ListingImageFallback className="mt-6 h-72 w-full rounded-2xl aspect-auto sm:h-112" />
    );
  }

  const thumbs = ordered.slice(1, 5);
  const extra = ordered.length - 1 - thumbs.length;
  const mosaic = thumbs.length > 0;

  return (
    <div className="relative mt-6">
      <div
        className={cn(mosaic && "sm:grid sm:h-112 sm:grid-cols-2 sm:gap-2")}
      >
        <button
          type="button"
          className={cn(
            "relative block w-full overflow-hidden rounded-2xl",
            mosaic ? "aspect-3/2 sm:aspect-auto sm:h-full" : "h-72 sm:h-112",
          )}
          aria-label={`Photo 1 of ${ordered.length}`}
          onClick={(event) => openAt(0, event.currentTarget)}
        >
          <Image
            src={ordered[0].url}
            alt={ordered[0].alt || title}
            fill
            priority
            sizes={mosaic ? "(min-width: 640px) 50vw, 100vw" : "100vw"}
            className="object-cover"
          />
        </button>
        {mosaic ? (
          <ul
            className={cn(
              "mt-2 gap-2 sm:mt-0 sm:h-full",
              thumbs.length === 1 && "grid grid-cols-1",
              thumbs.length === 2 &&
                "grid grid-cols-2 sm:grid-cols-1 sm:grid-rows-2",
              thumbs.length >= 3 && "grid grid-cols-2 sm:grid-rows-2",
            )}
          >
            {thumbs.map((image, index) => {
              const photoNumber = index + 2;
              const showExtra = extra > 0 && index === thumbs.length - 1;

              return (
                <li key={image.url} className="min-h-28 sm:min-h-0">
                  <button
                    type="button"
                    className="relative block h-full min-h-28 w-full overflow-hidden rounded-2xl sm:min-h-0"
                    aria-label={`Photo ${photoNumber} of ${ordered.length}`}
                    onClick={(event) =>
                      openAt(photoNumber - 1, event.currentTarget)
                    }
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || title}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                    {showExtra ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
                        +{extra} more
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <button
        type="button"
        className="absolute bottom-4 right-4 z-10 inline-flex h-12 items-center rounded-(--radius-button) bg-white px-4 text-sm font-semibold text-(--public-text) shadow-[0_2px_10px_rgba(26,25,22,0.18)]"
        onClick={(event) => openAt(0, event.currentTarget)}
      >
        {ordered.length === 1 ? "View photo" : "Show all photos"}
      </button>
      {openIndex !== null ? (
        <ListingPhotoViewer
          images={ordered}
          title={title}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => {
            const restore = restoreFocus.current;
            setOpenIndex(null);
            queueMicrotask(() => restore?.focus());
          }}
        />
      ) : null}
    </div>
  );
}

function wrapIndex(nextIndex: number, count: number) {
  if (nextIndex < 0) {
    return count - 1;
  }
  if (nextIndex >= count) {
    return 0;
  }
  return nextIndex;
}

function ListingPhotoViewer({
  images,
  title,
  index,
  onIndexChange,
  onClose,
}: {
  images: PublicListingImage[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const titleId = useId();
  const current = images[index];
  const hasMany = images.length > 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(wrapIndex(index - 1, images.length));
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange(wrapIndex(index + 1, images.length));
        return;
      }
      if (event.key !== "Tab") {
        return;
      }

      const root = dialogRef.current;
      if (!root) {
        return;
      }

      const focusable = [
        ...root.querySelectorAll<HTMLElement>("button:not([disabled])"),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, images.length, onClose, onIndexChange]);

  if (!current) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-60 flex flex-col bg-[#252A2A] text-white"
    >
      <div className="flex h-19 shrink-0 items-center justify-between px-4 sm:px-6">
        <p id={titleId} className="text-sm font-medium">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-(--radius-button) text-white hover:bg-white/10"
          aria-label="Close photos"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div
        className="relative min-h-0 flex-1"
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchX.current;
          const end = event.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined || !hasMany) {
            return;
          }
          const delta = end - start;
          if (delta > 50) {
            onIndexChange(wrapIndex(index - 1, images.length));
          } else if (delta < -50) {
            onIndexChange(wrapIndex(index + 1, images.length));
          }
        }}
      >
        {hasMany ? (
          <button
            type="button"
            className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-4"
            aria-label="Previous photo"
            onClick={() => onIndexChange(wrapIndex(index - 1, images.length))}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
        <div className="relative mx-auto h-full max-w-5xl px-16">
          <Image
            src={current.url}
            alt={current.alt || title}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
        {hasMany ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-4"
            aria-label="Next photo"
            onClick={() => onIndexChange(wrapIndex(index + 1, images.length))}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
      {hasMany ? (
        <ul className="flex shrink-0 gap-2 overflow-x-auto px-4 py-4 sm:justify-center">
          {images.map((image, photoIndex) => (
            <li key={image.url} className="shrink-0">
              <button
                type="button"
                className={cn(
                  "relative h-14 w-20 overflow-hidden rounded-lg",
                  photoIndex === index &&
                    "ring-2 ring-white ring-offset-2 ring-offset-[#252A2A]",
                )}
                aria-label={`Go to photo ${photoIndex + 1} of ${images.length}`}
                aria-current={photoIndex === index ? "true" : undefined}
                onClick={() => onIndexChange(photoIndex)}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
