import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "blockquote",
  "code",
  "pre",
];

export function renderArticleMarkdown(source: string) {
  const raw = marked.parse(source, {
    async: false,
    gfm: true,
    breaks: false,
  });

  return sanitizeHtml(typeof raw === "string" ? raw : "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      h1: "h2",
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href || "#",
          ...(attribs.title ? { title: attribs.title } : {}),
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    },
  });
}
