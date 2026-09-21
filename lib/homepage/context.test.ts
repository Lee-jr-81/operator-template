import { describe, expect, it } from "vitest";
import { visibleHomepageContext } from "@/lib/homepage/context";

describe("visibleHomepageContext", () => {
  it("returns trimmed copy when heading and paragraphs exist", () => {
    expect(
      visibleHomepageContext({
        heading: "  Your trusted niche platform  ",
        underline: " niche ",
        paragraphs: [" First. ", "", "Second."],
        actions: [
          {
            title: " Browse listings ",
            copy: " See what is available. ",
            href: " /listings ",
          },
        ],
      }),
    ).toEqual({
      heading: "Your trusted niche platform",
      underline: "niche",
      paragraphs: ["First.", "Second."],
      actions: [
        {
          title: "Browse listings",
          copy: "See what is available.",
          href: "/listings",
        },
      ],
    });
  });

  it("returns nothing when the clone leaves the band empty", () => {
    expect(
      visibleHomepageContext({
        heading: "",
        underline: "niche",
        paragraphs: ["Still here."],
        actions: [],
      }),
    ).toBeNull();
    expect(
      visibleHomepageContext({
        heading: "Heading",
        underline: "",
        paragraphs: ["  "],
        actions: [],
      }),
    ).toBeNull();
  });
});
