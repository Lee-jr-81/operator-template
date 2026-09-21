"use client";

import { useActionState, useState } from "react";
import {
  createCategory,
  updateCategory,
  type CategoryFormState,
} from "@/server/categories/actions";
import { generateCategorySlug } from "@/server/categories/slug";
import { term } from "@/config/terminology";
import type { Category } from "@/server/categories/types";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryFormProps = {
  category?: Category;
  imageUrl?: string | null;
};

export function CategoryForm({ category, imageUrl }: CategoryFormProps) {
  const isEditing = Boolean(category);
  const action = isEditing ? updateCategory : createCategory;
  const [state, formAction, pending] = useActionState<
    CategoryFormState,
    FormData
  >(action, null);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const slugValue = slugEdited ? slug : generateCategorySlug(name);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {isEditing ? <input type="hidden" name="id" value={category?.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <p id="name-help" className="text-sm text-(--dash-muted-fg)">
          The public name visitors will see, such as “Training” or “BMS
          Commissioning”.
        </p>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={80}
          aria-describedby="name-help"
          aria-invalid={Boolean(state?.fieldErrors?.name)}
        />
        {state?.fieldErrors?.name ? (
          <FormError>{state.fieldErrors.name}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <p id="slug-help" className="text-sm text-(--dash-muted-fg)">
          Used in the public Category URL. Keep it short and readable.
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
          maxLength={80}
          aria-describedby="slug-help"
          aria-invalid={Boolean(state?.fieldErrors?.slug)}
        />
        {state?.fieldErrors?.slug ? (
          <FormError>{state.fieldErrors.slug}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <p id="description-help" className="text-sm text-(--dash-muted-fg)">
          Briefly explain what visitors will find in this Category. This appears
          on its public page.
        </p>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
          required
          maxLength={500}
          aria-describedby="description-help"
          aria-invalid={Boolean(state?.fieldErrors?.description)}
        />
        {state?.fieldErrors?.description ? (
          <FormError>{state.fieldErrors.description}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="image">Image</Label>
        <p id="image-help" className="text-sm text-(--dash-muted-fg)">
          Shown on Category cards. JPEG, PNG, or WebP, up to 5MB.
          {isEditing
            ? " Upload a new file to replace the current image."
            : " Required when creating a Category."}
        </p>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-36 w-36 rounded-md object-cover"
          />
        ) : null}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!isEditing}
          aria-describedby="image-help"
          aria-invalid={Boolean(state?.fieldErrors?.image)}
        />
        {state?.fieldErrors?.image ? (
          <FormError>{state.fieldErrors.image}</FormError>
        ) : null}
        {isEditing && imageUrl ? (
          <label className="flex items-center gap-2 text-sm text-(--dash-muted-fg)">
            <input type="checkbox" name="remove_image" value="true" />
            Remove image
          </label>
        ) : null}
      </div>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? `Save ${term("category", "singular")}`
            : `Create ${term("category", "singular")}`}
      </Button>
    </form>
  );
}
