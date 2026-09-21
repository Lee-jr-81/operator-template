import { describe, expect, it } from "vitest";
import { parseListingDetailsInput } from "@/lib/listings/vertical-validation";

describe("parseListingDetailsInput", () => {
  it("accepts empty starter vertical fields", () => {
    expect(
      parseListingDetailsInput({
        service_format: "  ",
        price_text: "",
        duration_text: "  ",
      }),
    ).toEqual({
      data: {
        service_format: "",
        price_text: "",
        duration_text: "",
      },
    });
  });

  it("trims and keeps valid vertical values", () => {
    expect(
      parseListingDetailsInput({
        service_format: " Standard format ",
        price_text: "From 50",
        duration_text: "60 minutes",
      }),
    ).toEqual({
      data: {
        service_format: "Standard format",
        price_text: "From 50",
        duration_text: "60 minutes",
      },
    });
  });

  it("rejects values that exceed the field limits", () => {
    const tooLong = "x".repeat(81);
    const result = parseListingDetailsInput({
      service_format: tooLong,
      price_text: tooLong,
      duration_text: tooLong,
    });

    expect(result).toEqual({
      fieldErrors: {
        service_format: "Use 80 characters or fewer.",
        price_text: "Use 80 characters or fewer.",
        duration_text: "Use 80 characters or fewer.",
      },
    });
  });
});
