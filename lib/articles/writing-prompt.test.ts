import { describe, expect, it } from "vitest";
import { buildArticleWritingPrompt } from "@/lib/articles/writing-prompt";

const ORIGINALITY_PHRASES = [
  "original",
  "your experience",
  "local knowledge",
  "specialist insight",
  "Make this article yours",
  "starting point",
];

describe("buildArticleWritingPrompt", () => {
  it("inserts the entered topic", () => {
    const prompt = buildArticleWritingPrompt(
      "How to choose a reliable provider",
    );

    expect(prompt).toContain(
      'I want to create an article about:\n\n"How to choose a reliable provider"',
    );
  });

  it("requests the CMS field sections", () => {
    const prompt = buildArticleWritingPrompt("Choosing a provider");

    expect(prompt).toContain("TITLE");
    expect(prompt).toContain("EXCERPT");
    expect(prompt).toContain("BODY");
    expect(prompt).toContain("SEO TITLE");
    expect(prompt).toContain("SEO DESCRIPTION");
  });

  it("asks for Markdown body without a duplicate title H1", () => {
    const prompt = buildArticleWritingPrompt("Choosing a provider");

    expect(prompt).toMatch(/BODY[\s\S]*Markdown/);
    expect(prompt).toMatch(/Do not include the article title as an H1/);
  });

  it("returns null for an empty or whitespace-only topic", () => {
    expect(buildArticleWritingPrompt("")).toBeNull();
    expect(buildArticleWritingPrompt("   ")).toBeNull();
  });

  it("trims the topic before inserting it", () => {
    const prompt = buildArticleWritingPrompt("  Choosing a provider  ");

    expect(prompt).toContain('"Choosing a provider"');
    expect(prompt).not.toContain('"  Choosing a provider  "');
  });

  it("does not include OperatorTemplate originality guidance", () => {
    const prompt = buildArticleWritingPrompt("Choosing a provider");

    expect(prompt).not.toBeNull();
    for (const phrase of ORIGINALITY_PHRASES) {
      expect(prompt).not.toContain(phrase);
    }
  });
});
