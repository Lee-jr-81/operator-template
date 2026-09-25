"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeroCropControl } from "@/app/dashboard/articles/hero-crop";
import { prepareImageForUpload } from "@/lib/uploads/prepare-image";
import { removeArticleHero, uploadArticleHero } from "@/server/articles/hero-actions";

export function ArticleHeroPanel({
  articleId,
  heroUrl,
  focalX,
  focalY,
}: {
  articleId: string;
  heroUrl: string | null;
  focalX: number | null;
  focalY: number | null;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("image");
    const file =
      input instanceof HTMLInputElement ? input.files?.[0] : undefined;

    if (!file) {
      setFormError("Choose an image to upload.");
      return;
    }

    setFormError(null);
    setPending(true);

    let prepared: File;
    try {
      prepared = await prepareImageForUpload(file);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "This image could not be prepared. Please try again.",
      );
      setPending(false);
      return;
    }

    const data = new FormData();
    data.set("article_id", articleId);
    data.set("image", prepared);
    const result = await uploadArticleHero(null, data);
    if (result?.formError) {
      setFormError(result.formError);
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-medium">Hero image</h2>
        <p className="mt-1 text-sm leading-6 text-(--dash-muted-fg)">
          Optional image shown at the top of the Article and on Article cards.
          JPEG, PNG, or WebP. Large photos are reduced automatically.
        </p>
      </div>

      {heroUrl ? (
        <HeroCropControl
          articleId={articleId}
          heroUrl={heroUrl}
          focalX={focalX}
          focalY={focalY}
        />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md bg-(--dash-muted) text-sm text-(--dash-subtle-fg)">
          No hero image yet
        </div>
      )}

      <form onSubmit={onUpload} className="space-y-4">
        <input type="hidden" name="article_id" value={articleId} />
        <div className="space-y-1.5">
          <Label htmlFor="article-hero">{heroUrl ? "Replace image" : "Add image"}</Label>
          <Input
            id="article-hero"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </div>
        {formError ? <FormError>{formError}</FormError> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : heroUrl ? "Replace hero image" : "Upload hero image"}
        </Button>
      </form>

      {heroUrl ? (
        <form action={removeArticleHero}>
          <input type="hidden" name="article_id" value={articleId} />
          <Button type="submit" variant="secondary">
            Remove hero image
          </Button>
        </form>
      ) : null}
    </div>
  );
}
