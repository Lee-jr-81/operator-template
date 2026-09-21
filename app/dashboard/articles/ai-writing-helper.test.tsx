import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiWritingHelper } from "@/app/dashboard/articles/ai-writing-helper";
import {
  ARTICLE_TOPIC_EMPTY_MESSAGE,
  buildArticleWritingPrompt,
} from "@/lib/articles/writing-prompt";

describe("AiWritingHelper", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the topic field and copy action", () => {
    render(<AiWritingHelper />);

    expect(
      screen.getByRole("heading", { name: "Need help getting started?" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Article topic")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy AI writing prompt" }),
    ).toBeInTheDocument();
  });

  it("requires a useful topic before copying", () => {
    render(<AiWritingHelper />);

    fireEvent.click(
      screen.getByRole("button", { name: "Copy AI writing prompt" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      ARTICLE_TOPIC_EMPTY_MESSAGE,
    );
  });

  it("copies the constructed prompt and shows feedback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<AiWritingHelper />);

    fireEvent.change(screen.getByLabelText("Article topic"), {
      target: { value: "How to choose a reliable provider" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Copy AI writing prompt" }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
    });

    const prompt = writeText.mock.calls[0]?.[0] as string;
    expect(prompt).toContain("How to choose a reliable provider");
    expect(prompt).toContain("TITLE");
    expect(prompt).toContain("BODY");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Prompt copied",
    );
  });

  it("shows the prompt when the clipboard is unavailable", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<AiWritingHelper />);

    fireEvent.change(screen.getByLabelText("Article topic"), {
      target: { value: "Choosing a provider" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Copy AI writing prompt" }),
    );

    expect(
      await screen.findByText(/Could not copy automatically/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("AI writing prompt")).toHaveValue(
      buildArticleWritingPrompt("Choosing a provider") ?? "",
    );
  });
});
