"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { deleteArticleHeroFiles } from "@/server/articles/hero-queries";
import { getCategoryById } from "@/server/categories/queries";
import {
  deleteArticleRecord,
  getArticleById,
  insertArticle,
  updateArticleRecord,
} from "@/server/articles/queries";
import type { ArticleFieldErrors } from "@/server/articles/types";
import {
  ARTICLE_SAVE_FAILED_MESSAGE,
  DUPLICATE_SLUG_MESSAGE,
  isUniqueSlugError,
  parseArticleInput,
} from "@/server/articles/validation";

export type ArticleFormState = {
  fieldErrors?: ArticleFieldErrors;
  formError?: string;
} | null;

function readArticleForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    body: String(formData.get("body") ?? ""),
    status: String(formData.get("status") ?? ""),
    published_at: String(formData.get("published_at") ?? ""),
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
    category_id: String(formData.get("category_id") ?? ""),
  };
}

function redirectStatus(existingStatus: string, nextStatus: string) {
  if (existingStatus !== "published" && nextStatus === "published") {
    return "published";
  }

  if (existingStatus === "published" && nextStatus === "draft") {
    return "drafted";
  }

  return "updated";
}

export async function createArticle(
  _previousState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireOperator();

  const parsed = parseArticleInput(readArticleForm(formData));
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  if (parsed.data.category_id) {
    const category = await getCategoryById(parsed.data.category_id);
    if (!category) {
      return { fieldErrors: { category_id: "Choose a Category from the list." } };
    }
  }

  const { data, error } = await insertArticle(parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error || !data) {
    console.error("Failed to create article", { code: error?.code });
    return { formError: ARTICLE_SAVE_FAILED_MESSAGE };
  }

  redirect(`/dashboard/articles/${data.id}?status=created`);
}

export async function updateArticle(
  _previousState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { formError: "That Article could not be found." };
  }

  const existing = await getArticleById(id);
  if (!existing) {
    return { formError: "That Article could not be found." };
  }

  const parsed = parseArticleInput(readArticleForm(formData), {
    status: existing.status,
    published_at: existing.published_at,
  });

  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  if (parsed.data.category_id) {
    const category = await getCategoryById(parsed.data.category_id);
    if (!category) {
      return { fieldErrors: { category_id: "Choose a Category from the list." } };
    }
  }

  const { error } = await updateArticleRecord(id, parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error) {
    console.error("Failed to update article", { code: error.code });
    return { formError: ARTICLE_SAVE_FAILED_MESSAGE };
  }

  redirect(
    `/dashboard/articles/${id}?status=${redirectStatus(existing.status, parsed.data.status)}`,
  );
}

export async function deleteArticle(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/articles");
  }

  const existing = await getArticleById(id);
  if (!existing) {
    redirect("/dashboard/articles");
  }

  const { error } = await deleteArticleRecord(id);

  if (error) {
    console.error("Failed to delete article", { code: error.code });
    redirect("/dashboard/articles?status=delete-failed");
  }

  if (existing.hero_image_path) {
    const { error: storageError } = await deleteArticleHeroFiles([
      existing.hero_image_path,
    ]);
    if (storageError) {
      console.error("Failed to remove article hero file", {
        name: storageError.name,
      });
    }
  }

  redirect("/dashboard/articles?status=deleted");
}
