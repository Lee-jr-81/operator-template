import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ArticlePromotionDrafts } from "@/app/dashboard/articles/promotion-drafts";

describe("ArticlePromotionDrafts", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows editable drafts for each channel", () => {
    render(
      <ArticlePromotionDrafts
        facebook="Facebook draft"
        instagram="Instagram draft"
        linkedin="LinkedIn draft"
        x="X draft"
      />,
    );

    expect(screen.getByLabelText("Facebook post")).toHaveValue("Facebook draft");
    expect(screen.getByLabelText("Instagram post")).toHaveValue("Instagram draft");
    expect(screen.getByLabelText("LinkedIn post")).toHaveValue("LinkedIn draft");
    expect(screen.getByLabelText("X post")).toHaveValue("X draft");
    expect(screen.getAllByRole("button", { name: "Copy post" })).toHaveLength(4);
  });

  it("copies the edited draft, not the original", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <ArticlePromotionDrafts
        facebook="Original Facebook"
        instagram="Instagram draft"
        linkedin="LinkedIn draft"
        x="X draft"
      />,
    );

    fireEvent.change(screen.getByLabelText("Facebook post"), {
      target: { value: "Edited Facebook" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Copy post" })[0]);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("Edited Facebook");
    });
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
