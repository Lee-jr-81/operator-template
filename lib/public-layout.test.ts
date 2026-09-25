import { describe, expect, it } from "vitest";
import {
  categoryScrollerClass,
  categoryScrollerItemClass,
} from "@/lib/public-layout";

describe("category scroller", () => {
  it("fits five cards across on desktop and hides the scrollbar", () => {
    expect(categoryScrollerClass(5)).toContain("lg:grid-cols-5");
    expect(categoryScrollerClass(5)).toContain("no-scrollbar");
    expect(categoryScrollerItemClass(5)).toContain("lg:w-auto");
    expect(categoryScrollerItemClass(3)).toContain("w-[calc(100%-4.5rem)]");
  });

  it("scrolls further cards in the same desktop row", () => {
    expect(categoryScrollerClass(6)).not.toContain("lg:grid-cols-5");
    expect(categoryScrollerClass(6)).toContain("overflow-x-auto");
    expect(categoryScrollerClass(6)).toContain("no-scrollbar");
    expect(categoryScrollerItemClass(6)).toContain("lg:w-[calc((100%-4rem)/5)]");
    expect(categoryScrollerItemClass(6)).toContain("shrink-0");
  });
});
