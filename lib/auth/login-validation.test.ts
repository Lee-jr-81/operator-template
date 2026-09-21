import { describe, expect, it } from "vitest";
import {
  hasLoginFieldErrors,
  validateLoginInput,
} from "@/lib/auth/login-validation";

describe("validateLoginInput", () => {
  it("requires an email address", () => {
    expect(validateLoginInput("", "password123").email).toBe(
      "Enter your email address.",
    );
  });

  it("rejects an invalid email address", () => {
    expect(validateLoginInput("not-an-email", "password123").email).toBe(
      "Enter a valid email address.",
    );
  });

  it("requires a password", () => {
    expect(validateLoginInput("operator@example.com", "").password).toBe(
      "Enter your password.",
    );
  });

  it("accepts a valid email and password", () => {
    const fieldErrors = validateLoginInput(
      "operator@example.com",
      "password123",
    );

    expect(fieldErrors).toEqual({});
    expect(hasLoginFieldErrors(fieldErrors)).toBe(false);
  });
});
