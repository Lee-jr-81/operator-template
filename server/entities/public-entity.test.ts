import { describe, expect, it } from "vitest";
import { toPublicEntity } from "@/server/entities/public-entity";
import type { Entity } from "@/server/entities/types";

const operatorEntity: Entity = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Sample Entity",
  slug: "sample-entity",
  logo_path: "11111111-1111-1111-1111-111111111111/logo.png",
  contact_name: "Sarah",
  email: "private@example.com",
  phone: "0121 000 0000",
  website_url: "https://example.com",
  show_email: false,
  show_phone: false,
  show_website: true,
  public_description: "A short public description of this entity.",
  operator_notes: "Spoke to Sarah. Use the bookings email.",
  location_id: null,
  created_at: "2026-08-16T12:00:00.000Z",
  updated_at: "2026-08-16T12:00:00.000Z",
};

describe("toPublicEntity", () => {
  it("excludes private operator fields", () => {
    const publicEntity = toPublicEntity(operatorEntity);

    expect(publicEntity).not.toHaveProperty("contact_name");
    expect(publicEntity).not.toHaveProperty("operator_notes");
    expect(publicEntity).not.toHaveProperty("show_email");
    expect(publicEntity).not.toHaveProperty("show_phone");
    expect(publicEntity).not.toHaveProperty("show_website");
    expect(publicEntity.email).toBeNull();
    expect(publicEntity.phone).toBeNull();
    expect(publicEntity.website_url).toBe("https://example.com");
    expect(publicEntity.location).toBeNull();
  });

  it("includes contact details only when marked public", () => {
    const publicEntity = toPublicEntity({
      ...operatorEntity,
      show_email: true,
      show_phone: true,
    });

    expect(publicEntity.email).toBe("private@example.com");
    expect(publicEntity.phone).toBe("0121 000 0000");
  });

  it("includes a public Location without street address", () => {
    const publicEntity = toPublicEntity(operatorEntity, {
      id: "loc-1",
      label: "Main Service Area",
      address_line_1: "12 Private Lane",
      address_line_2: "",
      town_city: "Example Town",
      county_region: "Example County",
      postcode: "DY8 1AA",
      country: "United Kingdom",
      latitude: 52.45,
      longitude: -2.14,
      created_at: "2026-08-17T12:00:00.000Z",
      updated_at: "2026-08-17T12:00:00.000Z",
    });

    expect(publicEntity.location?.town_city).toBe("Example Town");
    expect(publicEntity.location).not.toHaveProperty("address_line_1");
  });
});
