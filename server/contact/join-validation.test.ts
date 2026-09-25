import { describe, expect, it } from "vitest";
import {
  JOIN_SUBMIT_FAILED_MESSAGE,
  parseJoinInput,
} from "@/server/contact/join-validation";
import { isHoneypotTriggered } from "@/server/enquiries/validation";

describe("parseJoinInput", () => {
  it("accepts a supplier message and an optional phone", () => {
    const parsed = parseJoinInput({
      name: "Alex Meadow",
      email: "alex@example.com",
      phone: "",
      message: "We would like to list what we offer on this platform.",
    });

    expect(parsed).toEqual({
      data: {
        name: "Alex Meadow",
        email: "alex@example.com",
        phone: null,
        message: "We would like to list what we offer on this platform.",
      },
    });
  });

  it("rejects a missing email and a short message", () => {
    const parsed = parseJoinInput({
      name: "Alex",
      email: "",
      phone: "",
      message: "Hello",
    });

    expect("fieldErrors" in parsed).toBe(true);
    if ("fieldErrors" in parsed) {
      expect(parsed.fieldErrors.email).toBeTruthy();
      expect(parsed.fieldErrors.message).toBeTruthy();
      expect(parsed.fieldErrors.phone).toBeUndefined();
    }
  });

  it("rejects a phone number that is too short", () => {
    const parsed = parseJoinInput({
      name: "Alex",
      email: "alex@example.com",
      phone: "12",
      message: "We would like to list what we offer on this platform.",
    });

    expect("fieldErrors" in parsed && parsed.fieldErrors.phone).toBeTruthy();
  });
});

describe("join request safety", () => {
  it("treats a filled honeypot as triggered and keeps the failure message generic", () => {
    expect(isHoneypotTriggered("Acme Ltd")).toBe(true);
    expect(isHoneypotTriggered("")).toBe(false);
    expect(JOIN_SUBMIT_FAILED_MESSAGE).toBe(
      "That message could not be sent. Please try again.",
    );
    expect(JOIN_SUBMIT_FAILED_MESSAGE.toLowerCase()).not.toContain("resend");
  });
});
