import { describe, expect, it } from "vitest";
import { parseStoredCoordinate } from "@/server/locations/coordinates";

describe("parseStoredCoordinate", () => {
  it("keeps finite numbers", () => {
    expect(parseStoredCoordinate(52.45)).toBe(52.45);
    expect(parseStoredCoordinate(-2.14)).toBe(-2.14);
  });

  it("parses numeric strings from Postgres/JSON", () => {
    expect(parseStoredCoordinate("52.45")).toBe(52.45);
    expect(parseStoredCoordinate(" -2.14 ")).toBe(-2.14);
  });

  it("rejects empty or invalid values", () => {
    expect(parseStoredCoordinate(null)).toBeNull();
    expect(parseStoredCoordinate("")).toBeNull();
    expect(parseStoredCoordinate("north")).toBeNull();
    expect(parseStoredCoordinate(Number.NaN)).toBeNull();
  });
});
