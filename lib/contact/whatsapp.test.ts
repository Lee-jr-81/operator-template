import { describe, expect, it } from "vitest";
import {
  toWhatsAppDigits,
  toWhatsAppUrl,
  WHATSAPP_DEFAULT_DIAL_CODE,
} from "@/lib/contact/whatsapp";

describe("toWhatsAppDigits", () => {
  it("normalizes UK local numbers with a leading 0", () => {
    expect(toWhatsAppDigits("07700 900123")).toBe("447700900123");
    expect(toWhatsAppDigits("0121 555 0101")).toBe("441215550101");
  });

  it("keeps explicit international numbers", () => {
    expect(toWhatsAppDigits("+44 7700 900123")).toBe("447700900123");
    expect(toWhatsAppDigits("0044 7700 900123")).toBe("447700900123");
    expect(toWhatsAppDigits("447700900123")).toBe("447700900123");
  });

  it("rejects numbers that are too short", () => {
    expect(toWhatsAppDigits("12345")).toBeNull();
    expect(toWhatsAppDigits("")).toBeNull();
    expect(toWhatsAppDigits(null)).toBeNull();
  });

  it("uses the clone-local default dial code", () => {
    expect(WHATSAPP_DEFAULT_DIAL_CODE).toBe("44");
    expect(toWhatsAppDigits("0612345678", "33")).toBe("33612345678");
  });
});

describe("toWhatsAppUrl", () => {
  it("builds a wa.me URL with no pre-filled message", () => {
    const url = toWhatsAppUrl("07700 900123");

    expect(url).toBe("https://wa.me/447700900123");
    expect(url).not.toContain("text=");
    expect(url).not.toContain("?");
  });

  it("does not invent a URL when the number is unusable", () => {
    expect(toWhatsAppUrl("not-a-number")).toBeNull();
  });
});
