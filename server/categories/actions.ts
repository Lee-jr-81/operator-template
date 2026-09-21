"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import {
  CATEGORY_IMAGE_REQUIRED_MESSAGE,
  CATEGORY_IMAGE_SAVE_FAILED_MESSAGE,
  categoryImagePath,
  readCategoryImageFile,
  validateCategoryImageFile,
} from "@/server/categories/image";
import {
  deleteCategoryImageFiles,
  uploadCategoryImageFile,
} from "@/server/categories/image-queries";
import {
  deleteCategoryRecord,
  getCategoryById,
  insertCategory,
  updateCategoryImagePath,
  updateCategoryRecord,
} from "@/server/categories/queries";
import {
  CATEGORY_SAVE_FAILED_MESSAGE,
  DUPLICATE_SLUG_MESSAGE,
  isRestrictDeleteError,
  isUniqueSlugError,
  parseCategoryInput,
} from "@/server/categories/validation";
import type { CategoryFieldErrors } from "@/server/categories/types";

export type CategoryFormState = {
  fieldErrors?: CategoryFieldErrors;
  formError?: string;
} | null;

function readCategoryForm(formData: FormData) {
  return parseCategoryInput({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
}

async function storeCategoryImage(categoryId: string, file: File) {
  const validated = await validateCategoryImageFile(file);
  if ("error" in validated) {
    return { fieldError: validated.error };
  }

  const path = categoryImagePath(
    categoryId,
    crypto.randomUUID(),
    validated.extension,
  );
  const { error: uploadError } = await uploadCategoryImageFile(
    path,
    file,
    validated.contentType,
  );

  if (uploadError) {
    console.error("Failed to upload category image", {
      name: uploadError.name,
    });
    return { formError: CATEGORY_IMAGE_SAVE_FAILED_MESSAGE };
  }

  const { error } = await updateCategoryImagePath(categoryId, path);
  if (error) {
    console.error("Failed to save category image path", { code: error.code });
    await deleteCategoryImageFiles([path]);
    return { formError: CATEGORY_IMAGE_SAVE_FAILED_MESSAGE };
  }

  return { path };
}

export async function createCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireOperator();

  const parsed = readCategoryForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const file = readCategoryImageFile(formData);
  if (!file) {
    return { fieldErrors: { image: CATEGORY_IMAGE_REQUIRED_MESSAGE } };
  }

  const validated = await validateCategoryImageFile(file);
  if ("error" in validated) {
    return { fieldErrors: { image: validated.error } };
  }

  const { data, error } = await insertCategory(parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error || !data) {
    console.error("Failed to create category", { code: error?.code });
    return { formError: CATEGORY_SAVE_FAILED_MESSAGE };
  }

  const stored = await storeCategoryImage(data.id, file);
  if ("fieldError" in stored && stored.fieldError) {
    await deleteCategoryRecord(data.id);
    return { fieldErrors: { image: stored.fieldError } };
  }
  if ("formError" in stored && stored.formError) {
    await deleteCategoryRecord(data.id);
    return { formError: stored.formError };
  }

  redirect("/dashboard/categories?status=created");
}

export async function updateCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { formError: "That Category could not be found." };
  }

  const existing = await getCategoryById(id);
  if (!existing) {
    return { formError: "That Category could not be found." };
  }

  const parsed = readCategoryForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const file = readCategoryImageFile(formData);
  const removeImage = String(formData.get("remove_image") ?? "") === "true";

  if (file) {
    const validated = await validateCategoryImageFile(file);
    if ("error" in validated) {
      return { fieldErrors: { image: validated.error } };
    }
  }

  const { data, error } = await updateCategoryRecord(id, parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error) {
    console.error("Failed to update category", { code: error.code });
    return { formError: CATEGORY_SAVE_FAILED_MESSAGE };
  }

  if (!data) {
    return { formError: "That Category could not be found." };
  }

  if (file) {
    const stored = await storeCategoryImage(id, file);
    if ("fieldError" in stored && stored.fieldError) {
      return { fieldErrors: { image: stored.fieldError } };
    }
    if ("formError" in stored && stored.formError) {
      return { formError: stored.formError };
    }
    if (existing.image_path && existing.image_path !== stored.path) {
      const { error: removeError } = await deleteCategoryImageFiles([
        existing.image_path,
      ]);
      if (removeError) {
        console.error("Failed to remove previous category image", {
          name: removeError.name,
        });
      }
    }
  } else if (removeImage && existing.image_path) {
    const { error: pathError } = await updateCategoryImagePath(id, null);
    if (pathError) {
      console.error("Failed to clear category image path", {
        code: pathError.code,
      });
      return { formError: CATEGORY_IMAGE_SAVE_FAILED_MESSAGE };
    }
    const { error: removeError } = await deleteCategoryImageFiles([
      existing.image_path,
    ]);
    if (removeError) {
      console.error("Failed to delete category image file", {
        name: removeError.name,
      });
    }
  }

  redirect("/dashboard/categories?status=updated");
}

export async function deleteCategory(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/categories");
  }

  const existing = await getCategoryById(id);
  if (!existing) {
    redirect("/dashboard/categories");
  }

  const { error } = await deleteCategoryRecord(id);

  if (isRestrictDeleteError(error)) {
    redirect("/dashboard/categories?status=in-use");
  }

  if (error) {
    console.error("Failed to delete category", { code: error.code });
    redirect("/dashboard/categories?status=delete-failed");
  }

  if (existing.image_path) {
    const { error: removeError } = await deleteCategoryImageFiles([
      existing.image_path,
    ]);
    if (removeError) {
      console.error("Failed to delete category image file", {
        name: removeError.name,
      });
    }
  }

  redirect("/dashboard/categories?status=deleted");
}
