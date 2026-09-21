import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/app/(public)/login/login-form";

vi.mock("@/lib/auth/actions", () => ({
  signIn: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders email, password, and sign-in controls", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });
});
