import { ArticleCard } from "@/components/articles/article-card";
import { articleCardGridClass } from "@/lib/public-layout";
import type { PublicArticleCard } from "@/server/articles/types";

export function HomepageArticleSection({
  articles,
}: {
  articles: PublicArticleCard[];
}) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-16 text-center sm:mb-20">
        <h2 className="text-[28px] font-bold tracking-tight text-(--public-text) lg:text-[32px]">
          Latest{" "}
          <span className="underline decoration-2 decoration-(--brand-primary) underline-offset-[0.24em]">
            articles
          </span>
        </h2>
      </div>
      <ul className={articleCardGridClass(articles.length)}>
        {articles.map((article) => (
          <li key={article.id} className="w-full">
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}
