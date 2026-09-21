import { describe, expect, it } from "vitest";
import {
  DUPLICATE_SLUG_MESSAGE,
  isRestrictDeleteError,
  isUniqueSlugError,
  parseEntityInput,
} from "@/server/entities/validation";

const validBase = {
  name: "Sample Entity",
  slug: "",
  contact_name: "Sarah",
  email: "bookings@example.com",
  phone: "0121 000 0000",
  website_url: "https://example.com",
  show_email: false,
  show_phone: false,
  show_website: true,
  public_description: "A short public description of this entity.",
  operator_notes: "Use the bookings email for enquiries.",
};

describe("parseEntityInput", () => {
  it("requires a name and generates a slug", () => {
    const result = parseEntityInput({
      ...validBase,
      name: "  ",
    });

    expect(result).toMatchObject({
      fieldErrors: {
        name: "Enter an Entity name.",
      },
    });
  });

  it("accepts valid input and stores empty optionals as null", () => {
    const result = parseEntityInput({
      ...validBase,
      email: "",
      phone: "",
      website_url: "",
      contact_name: "",
    });

    expect(result).toEqual({
      data: {
        name: "Sample Entity",
        slug: "sample-entity",
        contact_name: null,
        email: null,
        phone: null,
        website_url: null,
        show_email: false,
        show_phone: false,
        show_website: true,
        public_description: "A short public description of this entity.",
        operator_notes: "Use the bookings email for enquiries.",
      },
    });
  });

  it("rejects an invalid email", () => {
    const result = parseEntityInput({
      ...validBase,
      email: "not-an-email",
    });

    expect(result).toEqual({
      fieldErrors: { email: "Enter a valid email address." },
    });
  });

  it("rejects a website that is not http or https", () => {
    const result = parseEntityInput({
      ...validBase,
      website_url: "ftp://example.com",
    });

    expect(result).toEqual({
      fieldErrors: {
        website_url: "Enter a website URL starting with http:// or https://.",
      },
    });
  });

  it("rejects an impractical phone number", () => {
    const result = parseEntityInput({
      ...validBase,
      phone: "call-me",
    });

    expect(result).toEqual({
      fieldErrors: {
        phone: "Enter a phone number using digits and common symbols only.",
      },
    });
  });
});

describe("isUniqueSlugError", () => {
  it("detects Postgres unique violations", () => {
    expect(isUniqueSlugError({ code: "23505" })).toBe(true);
    expect(isUniqueSlugError(null)).toBe(false);
    expect(DUPLICATE_SLUG_MESSAGE).toContain("already used");
  });
});

describe("isRestrictDeleteError", () => {
  it("detects foreign-key restrict violations", () => {
    expect(isRestrictDeleteError({ code: "23503" })).toBe(true);
    expect(isRestrictDeleteError({ code: "23505" })).toBe(false);
    expect(isRestrictDeleteError(null)).toBe(false);
  });
});
