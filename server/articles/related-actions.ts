"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import {
  isDuplicateArticleListingError,
  neighborForRelatedListingMove,
  nextRelatedListingSortOrder,
} from "@/lib/articles/related-listings";
import { getArticleById } from "@/server/articles/queries";
import {
  deleteArticleListing,
  insertArticleListing,
  listArticleListingSortRows,
  updateArticleListingSortOrder,
} from "@/server/articles/related-queries";
import { getListingById } from "@/server/listings/queries";

function editPath(articleId: string, status: string) {
  return `/dashboard/articles/${articleId}?status=${status}`;
}

async function requireArticle(articleId: string) {
  if (!articleId) {
    return null;
  }

  return getArticleById(articleId);
}

export async function addArticleListing(formData: FormData) {
  await requireOperator();

  const articleId = String(formData.get("article_id") ?? "");
  const listingId = String(formData.get("listing_id") ?? "");
  const article = await requireArticle(articleId);
  if (!article) {
    redirect("/dashboard/articles");
  }

  const listing = listingId ? await getListingById(listingId) : null;
  if (!listing) {
    redirect(editPath(articleId, "listing-add-failed"));
  }

  const existing = await listArticleListingSortRows(articleId);
  if (existing.some((row) => row.listing_id === listingId)) {
    redirect(editPath(articleId, "listing-already-related"));
  }

  const { error } = await insertArticleListing({
    article_id: articleId,
    listing_id: listingId,
    sort_order: nextRelatedListingSortOrder(existing),
  });

  if (isDuplicateArticleListingError(error)) {
    redirect(editPath(articleId, "listing-already-related"));
  }

  if (error) {
    console.error("Failed to add article listing", { code: error.code });
    redirect(editPath(articleId, "listing-add-failed"));
  }

  redirect(editPath(articleId, "listing-added"));
}

export async function removeArticleListing(formData: FormData) {
  await requireOperator();

  const articleId = String(formData.get("article_id") ?? "");
  const listingId = String(formData.get("listing_id") ?? "");
  const article = await requireArticle(articleId);
  if (!article) {
    redirect("/dashboard/articles");
  }

  const { error } = await deleteArticleListing(articleId, listingId);
  if (error) {
    console.error("Failed to remove article listing", { code: error.code });
    redirect(editPath(articleId, "listing-remove-failed"));
  }

  redirect(editPath(articleId, "listing-removed"));
}

export async function moveArticleListing(formData: FormData) {
  await requireOperator();

  const articleId = String(formData.get("article_id") ?? "");
  const listingId = String(formData.get("listing_id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const article = await requireArticle(articleId);
  if (!article) {
    redirect("/dashboard/articles");
  }

  if (direction !== "up" && direction !== "down") {
    redirect(editPath(articleId, "listing-move-failed"));
  }

  const existing = await listArticleListingSortRows(articleId);
  const pair = neighborForRelatedListingMove(existing, listingId, direction);
  if (!pair) {
    redirect(editPath(articleId, "listings-updated"));
  }

  const { error: firstError } = await updateArticleListingSortOrder(
    articleId,
    pair.current.listing_id,
    pair.neighbor.sort_order,
  );
  const { error: secondError } = await updateArticleListingSortOrder(
    articleId,
    pair.neighbor.listing_id,
    pair.current.sort_order,
  );

  if (firstError || secondError) {
    console.error("Failed to reorder article listings", {
      code: firstError?.code ?? secondError?.code,
    });
    redirect(editPath(articleId, "listing-move-failed"));
  }

  redirect(editPath(articleId, "listings-updated"));
}
