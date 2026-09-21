"use client";

import { useActionState, useState } from "react";
import { toArticleDatetimeLocalValue } from "@/lib/articles/format";
import { ARTICLE_STATUS_LABELS } from "@/lib/articles/status";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createArticle,
  updateArticle,
  type ArticleFormState,
} from "@/server/articles/actions";
import {
  ARTICLE_BODY_MAX,
  ARTICLE_EXCERPT_MAX,
  ARTICLE_SEO_DESCRIPTION_MAX,
  ARTICLE_SEO_TITLE_MAX,
  ARTICLE_SLUG_MAX,
  ARTICLE_TITLE_MAX,
  generateArticleSlug,
} from "@/server/articles/slug";
import type { Article } from "@/server/articles/types";

export function ArticleForm({ article }: { article?: Article }) {
  const isEditing = Boolean(article);
  const action = isEditing ? updateArticle : createArticle;
  const [state, formAction, pending] = useActionState<ArticleFormState, FormData>(
    action,
    null,
  );

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const slugValue = slugEdited ? slug : generateArticleSlug(title);

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {isEditing ? <input type="hidden" name="id" value={article?.id} /> : null}

      <fieldset className="space-y-5">
        <legend className="text-base font-medium">Content</legend>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <p id="title-help" className="text-sm text-(--dash-muted-fg)">
            The public headline of the Article.
          </p>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={ARTICLE_TITLE_MAX}
            aria-describedby="title-help"
            aria-invalid={Boolean(state?.fieldErrors?.title)}
          />
          {state?.fieldErrors?.title ? (
            <FormError>{state.fieldErrors.title}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <p id="slug-help" className="text-sm text-(--dash-muted-fg)">
            Used in the public Article URL.
            {isEditing
              ? " Changing it changes the public URL. Existing links will not redirect."
              : null}
          </p>
          <Input
            id="slug"
            name="slug"
            value={slugValue}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
            required
            maxLength={ARTICLE_SLUG_MAX}
            aria-describedby="slug-help"
            aria-invalid={Boolean(state?.fieldErrors?.slug)}
          />
          {state?.fieldErrors?.slug ? (
            <FormError>{state.fieldErrors.slug}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Excerpt</Label>
          <p id="excerpt-help" className="text-sm text-(--dash-muted-fg)">
            A short summary shown on Article cards and used as a default
            description.
          </p>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={article?.excerpt ?? ""}
            required
            rows={3}
            maxLength={ARTICLE_EXCERPT_MAX}
            aria-describedby="excerpt-help"
            aria-invalid={Boolean(state?.fieldErrors?.excerpt)}
          />
          {state?.fieldErrors?.excerpt ? (
            <FormError>{state.fieldErrors.excerpt}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="body">Body</Label>
          <p id="body-help" className="text-sm text-(--dash-muted-fg)">
            Write the main Article content here. You can use Markdown for
            headings (`##`), lists, **bold**, *italics*, and [links](https://example.com).
          </p>
          <Textarea
            id="body"
            name="body"
            defaultValue={article?.body ?? ""}
            required
            rows={16}
            maxLength={ARTICLE_BODY_MAX}
            aria-describedby="body-help"
            aria-invalid={Boolean(state?.fieldErrors?.body)}
          />
          {state?.fieldErrors?.body ? (
            <FormError>{state.fieldErrors.body}</FormError>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-medium">Publishing</legend>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={article?.status ?? "draft"}
            aria-invalid={Boolean(state?.fieldErrors?.status)}
          >
            {Object.entries(ARTICLE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {state?.fieldErrors?.status ? (
            <FormError>{state.fieldErrors.status}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="published_at">Published date</Label>
          <p id="published-help" className="text-sm text-(--dash-muted-fg)">
            Set automatically the first time you publish. Leave blank to use
            now. A future date keeps the Article off the public site until then.
            Returning to Draft keeps this date.
          </p>
          <Input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={toArticleDatetimeLocalValue(
              article?.published_at ?? null,
            )}
            aria-describedby="published-help"
            aria-invalid={Boolean(state?.fieldErrors?.published_at)}
          />
          {state?.fieldErrors?.published_at ? (
            <FormError>{state.fieldErrors.published_at}</FormError>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-medium">SEO</legend>

        <div className="space-y-1.5">
          <Label htmlFor="seo_title">SEO title</Label>
          <p id="seo-title-help" className="text-sm text-(--dash-muted-fg)">
            Optional. Usually the Article title is enough. Only change this if a
            shorter or clearer search title would help.
          </p>
          <Input
            id="seo_title"
            name="seo_title"
            defaultValue={article?.seo_title ?? ""}
            maxLength={ARTICLE_SEO_TITLE_MAX}
            aria-describedby="seo-title-help"
            aria-invalid={Boolean(state?.fieldErrors?.seo_title)}
          />
          {state?.fieldErrors?.seo_title ? (
            <FormError>{state.fieldErrors.seo_title}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo_description">SEO description</Label>
          <p id="seo-description-help" className="text-sm text-(--dash-muted-fg)">
            Optional. Summarise why someone should read this Article. If left
            blank, the excerpt is used.
          </p>
          <Textarea
            id="seo_description"
            name="seo_description"
            defaultValue={article?.seo_description ?? ""}
            maxLength={ARTICLE_SEO_DESCRIPTION_MAX}
            rows={3}
            aria-describedby="seo-description-help"
            aria-invalid={Boolean(state?.fieldErrors?.seo_description)}
          />
          {state?.fieldErrors?.seo_description ? (
            <FormError>{state.fieldErrors.seo_description}</FormError>
          ) : null}
        </div>
      </fieldset>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? "Save Article"
            : "Create Article"}
      </Button>
    </form>
  );
}
