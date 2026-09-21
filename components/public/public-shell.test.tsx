import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicShell } from "@/components/public/public-shell";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";

describe("PublicShell", () => {
  it("shows configured business identity and terminology in chrome", () => {
    render(
      <PublicShell>
        <p>Content</p>
      </PublicShell>,
    );

    expect(
      screen.getByRole("link", { name: BUSINESS.name }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getAllByRole("link", { name: TERMINOLOGY.listing.plural })[0],
    ).toHaveAttribute("href", "/listings");
    const headerNav = screen.getByRole("navigation", { name: "Public" });
    expect(
      headerNav.querySelector(`a[href="/categories"]`),
    ).toBeNull();
    expect(screen.getByText(BUSINESS.tagline)).toBeInTheDocument();
    expect(
      screen.getByText(`© ${new Date().getFullYear()} ${BUSINESS.name}`),
    ).toBeInTheDocument();
  });

  it("opens and closes the mobile menu", () => {
    render(
      <PublicShell>
        <p>Content</p>
      </PublicShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("does not expose Build Specs in public navigation", () => {
    render(
      <PublicShell>
        <p>Content</p>
      </PublicShell>,
    );

    expect(
      screen.queryByRole("link", { name: "Build Specs" }),
    ).not.toBeInTheDocument();
  });
});

describe("dashboard boundary", () => {
  it("does not add Build Specs to the operator dashboard shell", () => {
    const source = readFileSync(
      path.join(process.cwd(), "app/dashboard/dashboard-shell.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/build-specs/i);
  });
});
