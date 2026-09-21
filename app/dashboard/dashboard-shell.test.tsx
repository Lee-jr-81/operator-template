import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("@/app/dashboard/sign-out-button", () => ({
  SignOutButton: () => <button type="button">Sign out</button>,
}));

describe("DashboardShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows configured brand text and terminology in dashboard nav", () => {
    render(
      <DashboardShell email="operator@example.com">
        <p>Overview</p>
      </DashboardShell>,
    );

    expect(
      screen.getByRole("img", { name: BUSINESS.shortName }),
    ).toHaveAttribute("src", BRANDING.logo.onDark);
    expect(screen.getByRole("link", { name: "Return to site" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("button", { name: "Light theme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark theme" })).toBeInTheDocument();
    expect(screen.getByText("operator@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: TERMINOLOGY.category.plural }),
    ).toHaveAttribute("href", "/dashboard/categories");
    expect(
      screen.getByRole("link", { name: TERMINOLOGY.entity.plural }),
    ).toHaveAttribute("href", "/dashboard/entities");
    expect(
      screen.getByRole("link", { name: TERMINOLOGY.listing.plural }),
    ).toHaveAttribute("href", "/dashboard/listings");
  });
});
