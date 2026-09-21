import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("allows public pages, blocks dashboard, and points at the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toEqual(["/dashboard", "/login"]);
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
