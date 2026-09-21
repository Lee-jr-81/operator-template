import { describe, expect, it } from "vitest";
import { renderArticleMarkdown } from "@/lib/articles/markdown";

describe("renderArticleMarkdown", () => {
  it("renders headings, emphasis, lists, and links", () => {
    const html = renderArticleMarkdown(
      [
        "## What to look for",
        "",
        "A **reliable** provider should have *insurance*.",
        "",
        "- References",
        "- A clear routine",
        "",
        "[Read more](https://example.com/guide)",
      ].join("\n"),
    );

    expect(html).toContain("<h2>");
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>");
    expect(html).toContain("<li>");
    expect(html).toContain('href="https://example.com/guide"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it("strips unsafe HTML and javascript URLs", () => {
    const html = renderArticleMarkdown(
      '<script>alert(1)</script>\n\n[Click](javascript:alert(1))\n\n[Data](data:text/html,hi)\n\n<img src=x onerror=alert(1)>',
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("data:");
  });
});
