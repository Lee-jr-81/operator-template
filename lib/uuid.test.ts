import { describe, expect, it } from "vitest";
import { isUuid } from "@/lib/uuid";

describe("isUuid", () => {
  it("accepts a canonical UUID", () => {
    expect(isUuid("11111111-1111-1111-1111-111111111111")).toBe(true);
  });

  it("rejects missing, truncated, or SQL-like values", () => {
    expect(isUuid("")).toBe(false);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("11111111-1111-1111-1111-11111111111")).toBe(false);
    expect(isUuid("11111111-1111-1111-1111-111111111111; drop table")).toBe(
      false,
    );
  });
});
