"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import {
  COVER_FOCAL_FALLBACK,
  coverPositionRatios,
  focalPointFromCoverPosition,
  focalPointFromImage,
  objectPositionForCover,
} from "@/lib/media/cover-position";
import { updateArticleHeroCrop } from "@/server/articles/hero-actions";

type FocalPoint = { x: number; y: number };

export function HeroCropControl({
  articleId,
  heroUrl,
  focalX,
  focalY,
}: {
  articleId: string;
  heroUrl: string;
  focalX: number | null;
  focalY: number | null;
}) {
  const saved =
    focalX != null && focalY != null ? { x: focalX, y: focalY } : null;
  const frameRef = useRef<HTMLDivElement>(null);
  const detectedRef = useRef<FocalPoint>(COVER_FOCAL_FALLBACK);
  const focalRef = useRef<FocalPoint | null>(saved);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    positionX: number;
    positionY: number;
    focalX: number;
    focalY: number;
  } | null>(null);
  const [focal, setFocal] = useState<FocalPoint | null>(saved);
  const [manual, setManual] = useState(saved != null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const box = frame.getBoundingClientRect();
      setFrameSize({ width: box.width, height: box.height });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const activeFocal = focal ?? COVER_FOCAL_FALLBACK;
  const imageAspect =
    imageSize && imageSize.height > 0 ? imageSize.width / imageSize.height : 0;
  const frameAspect = frameSize.height > 0 ? frameSize.width / frameSize.height : 0;
  const position =
    imageAspect > 0 && frameAspect > 0
      ? objectPositionForCover(activeFocal.x, activeFocal.y, imageAspect, frameAspect)
      : "50% 32%";

  function remember(next: FocalPoint | null) {
    focalRef.current = next;
    setFocal(next);
  }

  async function saveFocal(next: FocalPoint | null) {
    setFormError(null);
    const result = await updateArticleHeroCrop(
      articleId,
      next?.x ?? null,
      next?.y ?? null,
    );
    if (result?.formError) {
      setFormError(result.formError);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (imageAspect <= 0 || frameAspect <= 0) {
      return;
    }

    const current = focalRef.current ?? detectedRef.current;
    const ratios = coverPositionRatios(
      current.x,
      current.y,
      imageAspect,
      frameAspect,
    );
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      positionX: ratios.x,
      positionY: ratios.y,
      focalX: current.x,
      focalY: current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || imageAspect <= 0) {
      return;
    }

    const displayedWidth =
      imageAspect > frameAspect ? frameSize.height * imageAspect : frameSize.width;
    const displayedHeight =
      imageAspect < frameAspect ? frameSize.width / imageAspect : frameSize.height;
    const overflowX = frameSize.width - displayedWidth;
    const overflowY = frameSize.height - displayedHeight;
    const nextX =
      overflowX === 0
        ? drag.positionX
        : clampRatio(drag.positionX + (event.clientX - drag.x) / overflowX);
    const nextY =
      overflowY === 0
        ? drag.positionY
        : clampRatio(drag.positionY + (event.clientY - drag.y) / overflowY);
    const next = focalPointFromCoverPosition(nextX, nextY, imageAspect, frameAspect);
    setManual(true);
    remember(next);
  }

  async function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const next = focalRef.current;
    if (next && (next.x !== drag.focalX || next.y !== drag.focalY)) {
      await saveFocal(next);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const horizontal = event.key === "ArrowRight" ? 4 : event.key === "ArrowLeft" ? -4 : 0;
    const vertical = event.key === "ArrowDown" ? 4 : event.key === "ArrowUp" ? -4 : 0;
    if (horizontal === 0 && vertical === 0) {
      return;
    }

    event.preventDefault();
    const current = focalRef.current ?? detectedRef.current;
    const next = {
      x: clampPoint(current.x + horizontal),
      y: clampPoint(current.y + vertical),
    };
    setManual(true);
    remember(next);
    void saveFocal(next);
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        role="group"
        tabIndex={0}
        aria-label="Hero crop. Drag the photo, or use the arrow keys."
        className="relative aspect-5/2 w-full cursor-grab touch-none overflow-hidden rounded-md active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <Image
          src={heroUrl}
          alt=""
          fill
          draggable={false}
          sizes="640px"
          className="object-cover"
          style={{ objectPosition: position }}
          onLoad={(event) => {
            const image = event.currentTarget;
            setImageSize({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
            const detected = focalPointFromImage(image);
            detectedRef.current = detected;
            if (focalRef.current == null) {
              remember(detected);
            }
          }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-(--dash-muted-fg)">
          Drag the photo to choose what stays in the frame. Arrow keys work too.
        </p>
        {manual ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setManual(false);
              remember(detectedRef.current);
              void saveFocal(null);
            }}
          >
            Use automatic crop
          </Button>
        ) : null}
      </div>
      {formError ? <FormError>{formError}</FormError> : null}
    </div>
  );
}

function clampRatio(value: number) {
  if (!Number.isFinite(value)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, value));
}

function clampPoint(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
