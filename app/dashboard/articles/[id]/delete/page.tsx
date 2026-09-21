import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle } from "@/server/articles/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getArticleById } from "@/server/articles/queries";

export const metadata: Metadata = {
  title: "Delete Article",
};

export default async function DeleteArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/articles"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to Articles
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Delete Article
        </h1>
      </div>
      <Card className="max-w-3xl space-y-4">
        <p className="text-sm leading-6 text-(--dash-muted-fg)">
          Delete <span className="font-semibold">{article.title}</span>? This
          cannot be undone. The public page at{" "}
          <span className="font-medium">/articles/{article.slug}</span> will
          stop working. The hero image is removed with it.
        </p>
        <form action={deleteArticle} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={article.id} />
          <Button type="submit" variant="danger">
            Delete {article.title}
          </Button>
          <Link
            href={`/dashboard/articles/${article.id}`}
            className="inline-flex h-[42px] items-center justify-center rounded-[8px] border border-(--dash-border) bg-(--dash-card) px-3.5 text-sm font-semibold text-(--dash-fg) hover:bg-(--dash-muted)"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
}
