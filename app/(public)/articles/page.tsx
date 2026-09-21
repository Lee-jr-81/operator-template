import type { Metadata } from "next";
import { ArticleCard } from "@/components/articles/article-card";
import { ListingsBrowseAside } from "@/components/listings/listings-browse-aside";
import { Container } from "@/components/ui/container";
import { listPublicHomepageCategories } from "@/server/categories/queries";
import { listPublicArticles } from "@/server/articles/queries";

export const metadata: Metadata = {
  title: "Articles",
  description: "Guides and useful reading from this marketplace.",
  alternates: {
    canonical: "/articles",
  },
};

const BROWSE_CATEGORY_LIMIT = 12;

export default async function ArticlesIndexPage() {
  const [articles, categories] = await Promise.all([
    listPublicArticles(),
    listPublicHomepageCategories(BROWSE_CATEGORY_LIMIT),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Articles</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        Useful reading about this marketplace. Only published Articles appear
        here.
      </p>

      {articles.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">
          Articles will appear here as they are published.
        </p>
      ) : (
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,20rem)] lg:items-start lg:gap-8">
          <ul className="grid grid-cols-1 gap-4">
            {articles.map((article) => (
              <li key={article.id}>
                <ArticleCard article={article} layout="browse" />
              </li>
            ))}
          </ul>
          <ListingsBrowseAside categories={categories} />
        </div>
      )}
    </Container>
  );
}
