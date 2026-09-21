import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OriginalityPanel } from "@/app/dashboard/articles/originality-panel";

describe("OriginalityPanel", () => {
  it("explains why original knowledge belongs in the Article", () => {
    render(<OriginalityPanel />);

    expect(
      screen.getByRole("heading", { name: "Make this article yours" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/starting point/i)).toBeInTheDocument();
    expect(
      screen.getByText(/experience, opinions, examples, local knowledge/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/not simply repeating generic AI text/i)).toBeInTheDocument();
  });
});
