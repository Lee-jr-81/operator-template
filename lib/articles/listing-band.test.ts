import { describe, expect, it } from "vitest";
import { articleCategoryListingHeading } from "@/lib/articles/listing-band";

describe("articleCategoryListingHeading", () => {
  it("names the category and the listing plural", () => {
    expect(articleCategoryListingHeading("Walking")).toBe("Latest Walking listings");
  });
});
