import { describe, expect, it } from "vitest";
import { isLoginPath, isProtectedDashboardPath } from "@/lib/auth/paths";

describe("isProtectedDashboardPath", () => {
  it("protects the dashboard and its child routes", () => {
    expect(isProtectedDashboardPath("/dashboard")).toBe(true);
    expect(isProtectedDashboardPath("/dashboard/listings")).toBe(true);
  });

  it("does not protect public routes", () => {
    expect(isProtectedDashboardPath("/")).toBe(false);
    expect(isProtectedDashboardPath("/login")).toBe(false);
  });
});

describe("isLoginPath", () => {
  it("matches only the login route", () => {
    expect(isLoginPath("/login")).toBe(true);
    expect(isLoginPath("/dashboard")).toBe(false);
  });
});
