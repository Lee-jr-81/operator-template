"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeArticleHero,
  uploadArticleHero,
  type ArticleHeroFormState,
} from "@/server/articles/hero-actions";

export function ArticleHeroPanel({
  articleId,
  heroUrl,
}: {
  articleId: string;
  heroUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState<
    ArticleHeroFormState,
    FormData
  >(uploadArticleHero, null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-medium">Hero image</h2>
        <p className="mt-1 text-sm leading-6 text-(--dash-muted-fg)">
          Optional image shown at the top of the Article and on Article cards.
          JPEG, PNG, or WebP, up to 5MB.
        </p>
      </div>

      {heroUrl ? (
        <Image
          src={heroUrl}
          alt=""
          width={640}
          height={360}
          className="h-48 w-full rounded-md object-cover"
        />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md bg-(--dash-muted) text-sm text-(--dash-subtle-fg)">
          No hero image yet
        </div>
      )}

      <form action={formAction} className="space-y-4">
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
        {state?.formError ? <FormError>{state.formError}</FormError> : null}
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
