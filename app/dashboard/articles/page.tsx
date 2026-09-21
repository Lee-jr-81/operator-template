import type { Metadata } from "next";
import Link from "next/link";
import { ArticleStatusBanner } from "@/app/dashboard/articles/status-banner";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonClass } from "@/components/ui/button";
import { formatArticleDateTime } from "@/lib/articles/format";
import { canPromoteArticle } from "@/lib/articles/promotion-templates";
import { ARTICLE_STATUS_LABELS } from "@/lib/articles/status";
import {
  dashDangerLink,
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import { listOperatorArticles } from "@/server/articles/queries";

export const metadata: Metadata = {
  title: "Articles",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const articles = await listOperatorArticles();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Articles"
        description="Niche content that educates visitors and supports discovery."
        action={
          <Link href="/dashboard/articles/new" className={buttonClass.primary}>
            Create Article
          </Link>
        }
      />

      <ArticleStatusBanner status={status} />

      {articles.length === 0 ? (
        <EmptyState title="No articles yet">
          <p>Publish useful niche content to build trust and support discovery.</p>
          <p>
            <Link href="/dashboard/articles/new" className={dashLink}>
              Create first Article
            </Link>
          </p>
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Article</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Published</DataTableHeaderCell>
              <DataTableHeaderCell>Updated</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className={dashTr}>
                <td className={`${dashTd} font-medium`}>{article.title}</td>
                <td className={dashTd}>
                  <StatusBadge
                    tone={article.status === "published" ? "success" : "muted"}
                  >
                    {ARTICLE_STATUS_LABELS[article.status]}
                  </StatusBadge>
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {formatArticleDateTime(article.published_at)}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {formatArticleDateTime(article.updated_at)}
                </td>
                <td className={`${dashTd} text-right`}>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      href={`/dashboard/articles/${article.id}`}
                      className={dashLink}
                    >
                      Edit
                    </Link>
                    {canPromoteArticle(article.status) ? (
                      <Link
                        href={`/dashboard/articles/${article.id}/promote`}
                        className={dashLink}
                      >
                        Promote
                      </Link>
                    ) : null}
                    <Link
                      href={`/dashboard/articles/${article.id}/delete`}
                      className={dashDangerLink}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
