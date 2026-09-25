import { cn } from "@/lib/cn";
import { renderArticleMarkdown } from "@/lib/articles/markdown";

export function ArticleBody({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const html = renderArticleMarkdown(markdown);

  return (
    <div
      className={cn(
        "min-w-0 text-base leading-7 text-(--public-text-muted) *:first:mt-0 [&_a]:font-medium [&_a]:text-(--brand-primary) [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-(--brand-secondary) [&_blockquote]:border-l-2 [&_blockquote]:border-(--public-border) [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-(--public-muted) [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-(--public-text) [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-(--public-text) [&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-(--public-text) [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-(--public-muted) [&_pre]:p-4 [&_pre]:text-sm [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
