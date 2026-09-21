"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import {
  articleHeroPath,
  validateArticleHeroFile,
} from "@/server/articles/hero";
import {
  deleteArticleHeroFiles,
  uploadArticleHeroFile,
} from "@/server/articles/hero-queries";
import {
  getArticleById,
  updateArticleHeroPath,
} from "@/server/articles/queries";

export type ArticleHeroFormState = {
  formError?: string;
} | null;

function editPath(articleId: string, status: string) {
  return `/dashboard/articles/${articleId}?status=${status}`;
}

function readImageFile(formData: FormData) {
  const value = formData.get("image");
  if (value == null || typeof value === "string") {
    return null;
  }

  const file = value as File;
  if (typeof file.size !== "number" || file.size === 0) {
    return null;
  }

  return file;
}

export async function uploadArticleHero(
  _previousState: ArticleHeroFormState,
  formData: FormData,
): Promise<ArticleHeroFormState> {
  await requireOperator();

  const articleId = String(formData.get("article_id") ?? "");
  const article = articleId ? await getArticleById(articleId) : null;
  if (!article) {
    return { formError: "That Article could not be found." };
  }

  const file = readImageFile(formData);
  if (!file) {
    return { formError: "Choose an image to upload." };
  }

  const validated = await validateArticleHeroFile(file);
  if ("error" in validated) {
    return { formError: validated.error };
  }

  const mediaId = crypto.randomUUID();
  const path = articleHeroPath(articleId, mediaId, validated.extension);
  const { error: uploadError } = await uploadArticleHeroFile(
    path,
    file,
    validated.contentType,
  );

  if (uploadError) {
    console.error("Failed to upload article hero", { name: uploadError.name });
    return { formError: "The image could not be uploaded. Please try again." };
  }

  const previousPath = article.hero_image_path;
  const { error } = await updateArticleHeroPath(articleId, path);

  if (error) {
    console.error("Failed to save article hero", { code: error.code });
    await deleteArticleHeroFiles([path]);
    return { formError: "The image could not be saved. Please try again." };
  }

  if (previousPath && previousPath !== path) {
    const { error: removeError } = await deleteArticleHeroFiles([previousPath]);
    if (removeError) {
      console.error("Failed to remove previous article hero", {
        name: removeError.name,
      });
    }
  }

  redirect(editPath(articleId, "hero-updated"));
}

export async function removeArticleHero(formData: FormData) {
  await requireOperator();

  const articleId = String(formData.get("article_id") ?? "");
  const article = articleId ? await getArticleById(articleId) : null;
  if (!article) {
    redirect("/dashboard/articles");
  }

  const previousPath = article.hero_image_path;
  const { error } = await updateArticleHeroPath(articleId, null);

  if (error) {
    console.error("Failed to remove article hero", { code: error.code });
    redirect(editPath(articleId, "hero-failed"));
  }

  if (previousPath) {
    const { error: removeError } = await deleteArticleHeroFiles([previousPath]);
    if (removeError) {
      console.error("Failed to delete article hero file", {
        name: removeError.name,
      });
    }
  }

  redirect(editPath(articleId, "hero-removed"));
}
