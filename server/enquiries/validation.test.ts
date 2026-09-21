import { describe, expect, it } from "vitest";
import { isEnquiryStatus } from "@/lib/enquiries/status";
import {
  ENQUIRY_LISTING_UNAVAILABLE_MESSAGE,
  ENQUIRY_MESSAGE_MAX,
  ENQUIRY_NAME_MAX,
  canAcceptPublicEnquiry,
  enquirySubmitSuccess,
  isHoneypotTriggered,
  parseEnquiryInput,
} from "@/server/enquiries/validation";

const valid = {
  listing_id: "11111111-1111-1111-1111-111111111111",
  name: "Sam Taylor",
  email: "sam@example.com",
  phone: "0121 555 0101",
  message: "Do you cover DY8 on weekday mornings?",
};

describe("parseEnquiryInput", () => {
  it("requires name, email, message, and a Listing", () => {
    const result = parseEnquiryInput({
      listing_id: "  ",
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    expect(result).toEqual({
      fieldErrors: {
        listing_id: ENQUIRY_LISTING_UNAVAILABLE_MESSAGE,
        name: "Enter your name.",
        email: "Enter your email address.",
        message: "Enter a message.",
      },
    });
  });

  it("accepts a valid enquiry and treats blank phone as omitted", () => {
    const result = parseEnquiryInput({ ...valid, phone: "  " });

    expect(result).toEqual({
      data: {
        listing_id: valid.listing_id,
        name: "Sam Taylor",
        email: "sam@example.com",
        phone: null,
        message: valid.message,
      },
    });
  });

  it("keeps an optional phone number", () => {
    const result = parseEnquiryInput(valid);

    expect("data" in result && result.data.phone).toBe("0121 555 0101");
  });

  it("rejects an invalid email", () => {
    const result = parseEnquiryInput({ ...valid, email: "not-an-email" });

    expect(result).toEqual({
      fieldErrors: { email: "Enter a valid email address." },
    });
  });

  it("rejects a malformed Listing id without querying", () => {
    const result = parseEnquiryInput({ ...valid, listing_id: "not-a-uuid" });

    expect(result).toEqual({
      fieldErrors: { listing_id: ENQUIRY_LISTING_UNAVAILABLE_MESSAGE },
    });
  });

  it("rejects a message that is too short", () => {
    const result = parseEnquiryInput({ ...valid, message: "Hi there" });

    expect(result).toEqual({
      fieldErrors: { message: "Use at least 10 characters." },
    });
  });

  it("rejects field values that are too long", () => {
    const result = parseEnquiryInput({
      ...valid,
      name: "x".repeat(ENQUIRY_NAME_MAX + 1),
      message: "x".repeat(ENQUIRY_MESSAGE_MAX + 1),
    });

    expect(result).toEqual({
      fieldErrors: {
        name: `Use ${ENQUIRY_NAME_MAX} characters or fewer.`,
        message: `Use ${ENQUIRY_MESSAGE_MAX} characters or fewer.`,
      },
    });
  });
});

describe("public listing eligibility", () => {
  it("accepts only an active Listing", () => {
    expect(
      canAcceptPublicEnquiry({ id: valid.listing_id, status: "active" }),
    ).toBe(true);
    expect(
      canAcceptPublicEnquiry({ id: valid.listing_id, status: "inactive" }),
    ).toBe(false);
    expect(canAcceptPublicEnquiry(null)).toBe(false);
  });
});

describe("spam and success shape", () => {
  it("treats a filled honeypot as triggered", () => {
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered("   ")).toBe(false);
    expect(isHoneypotTriggered("Acme Bots")).toBe(true);
  });

  it("returns a success result with no stored Enquiry row", () => {
    const result = enquirySubmitSuccess();

    expect(result).toEqual({ success: true });
    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("message");
    expect(result).not.toHaveProperty("enquiry");
  });
});

describe("enquiry status", () => {
  it("allows only new, reviewed, and closed", () => {
    expect(isEnquiryStatus("new")).toBe(true);
    expect(isEnquiryStatus("reviewed")).toBe(true);
    expect(isEnquiryStatus("closed")).toBe(true);
    expect(isEnquiryStatus("contacted")).toBe(false);
    expect(isEnquiryStatus("open")).toBe(false);
    expect(isEnquiryStatus("won")).toBe(false);
  });
});
