export function articlePageMetadata(article: {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
}) {
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
  };
}
