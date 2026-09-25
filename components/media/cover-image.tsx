"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  COVER_POSITION_FALLBACK,
  focalPointFromImage,
  objectPositionForCover,
} from "@/lib/media/cover-position";

export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  focalX = null,
  focalY = null,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  focalX?: number | null;
  focalY?: number | null;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const focalRef = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState(COVER_POSITION_FALLBACK);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setPosition(COVER_POSITION_FALLBACK);
    focalRef.current = null;
    imageRef.current = null;
  }

  const hasSavedFocal =
    typeof focalX === "number" && typeof focalY === "number";

  const updatePosition = useCallback(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image || image.naturalWidth < 1 || image.naturalHeight < 1) {
      return;
    }

    const { width, height } = frame.getBoundingClientRect();
    if (width < 1 || height < 1) {
      return;
    }

    const focal = hasSavedFocal
      ? { x: focalX as number, y: focalY as number }
      : (focalRef.current ?? focalPointFromImage(image));
    if (!hasSavedFocal) {
      focalRef.current = focal;
    }

    setPosition(
      objectPositionForCover(
        focal.x,
        focal.y,
        image.naturalWidth / image.naturalHeight,
        width / height,
      ),
    );
  }, [focalX, focalY, hasSavedFocal]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const observer = new ResizeObserver(() => updatePosition());
    observer.observe(frame);
    return () => observer.disconnect();
  }, [updatePosition]);

  return (
    <div ref={frameRef} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
        style={{ objectPosition: position }}
        onLoad={(event) => {
          imageRef.current = event.currentTarget;
          if (!hasSavedFocal) {
            focalRef.current = null;
          }
          updatePosition();
        }}
      />
    </div>
  );
}
