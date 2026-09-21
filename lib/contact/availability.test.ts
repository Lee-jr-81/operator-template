import { describe, expect, it } from "vitest";
import {
  hasAnyListingContact,
  listingContactChannels,
} from "@/lib/contact/availability";

describe("listingContactChannels", () => {
  it("shows WhatsApp and Enquiry when phone and email exist", () => {
    const channels = listingContactChannels({
      phone: "07700 900123",
      hasEmail: true,
    });

    expect(channels.whatsappUrl).toBe("https://wa.me/447700900123");
    expect(channels.canEnquire).toBe(true);
    expect(hasAnyListingContact(channels)).toBe(true);
    expect(channels).not.toHaveProperty("email");
    expect(channels).not.toHaveProperty("phone");
  });

  it("shows WhatsApp only when there is a usable phone and no email", () => {
    const channels = listingContactChannels({
      phone: "07700 900123",
      hasEmail: false,
    });

    expect(channels.whatsappUrl).toBeTruthy();
    expect(channels.canEnquire).toBe(false);
  });

  it("shows Enquiry only when there is an email and no usable phone", () => {
    const channels = listingContactChannels({
      phone: null,
      hasEmail: true,
    });

    expect(channels.whatsappUrl).toBeNull();
    expect(channels.canEnquire).toBe(true);
  });

  it("shows neither when the Entity has no usable contact", () => {
    const channels = listingContactChannels({
      phone: "123",
      hasEmail: false,
    });

    expect(channels.whatsappUrl).toBeNull();
    expect(channels.canEnquire).toBe(false);
    expect(hasAnyListingContact(channels)).toBe(false);
  });
});
