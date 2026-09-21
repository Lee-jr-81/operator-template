export const ARTICLE_TOPIC_MAX = 200;
export const ARTICLE_TOPIC_EMPTY_MESSAGE = "Enter an article topic first.";

export function normalizeArticleTopic(topic: string) {
  return topic.trim();
}

export function buildArticleWritingPrompt(topic: string) {
  const normalized = normalizeArticleTopic(topic);
  if (!normalized) {
    return null;
  }

  return `I want to create an article about:

"${normalized}"

Create a useful, well-written article about this subject.

Return the response using EXACTLY these sections:

TITLE
A clear and engaging article title.

EXCERPT
A concise 1–2 sentence summary.

BODY
The complete article in Markdown.
Use clear headings, readable paragraphs, lists where useful, practical information and a concise conclusion.
Do not include the article title as an H1 in the BODY because the website displays the title separately.

SEO TITLE
A natural search-friendly title.

SEO DESCRIPTION
A concise description of the article.`;
}
