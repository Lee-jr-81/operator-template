"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ARTICLE_TOPIC_EMPTY_MESSAGE,
  ARTICLE_TOPIC_MAX,
  buildArticleWritingPrompt,
} from "@/lib/articles/writing-prompt";

export function AiWritingHelper() {
  const [topic, setTopic] = useState("");
  const [topicError, setTopicError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fallbackPrompt, setFallbackPrompt] = useState<string | null>(null);

  async function copyPrompt() {
    const prompt = buildArticleWritingPrompt(topic);
    if (!prompt) {
      setTopicError(ARTICLE_TOPIC_EMPTY_MESSAGE);
      setCopied(false);
      setFallbackPrompt(null);
      return;
    }

    setTopicError(null);

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setFallbackPrompt(null);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setFallbackPrompt(prompt);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-medium">Need help getting started?</h2>
        <p className="mt-2 text-sm leading-6 text-(--dash-muted-fg)">
          Enter what you&apos;d like to write about and copy a ready-made
          writing prompt into your preferred AI assistant, for example ChatGPT,
          Claude or Gemini.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="article-topic">Article topic</Label>
        <Input
          id="article-topic"
          value={topic}
          onChange={(event) => {
            setTopic(event.target.value);
            if (topicError) {
              setTopicError(null);
            }
          }}
          maxLength={ARTICLE_TOPIC_MAX}
          placeholder="How to choose a reliable provider"
          aria-describedby={topicError ? "article-topic-error" : undefined}
          aria-invalid={Boolean(topicError)}
        />
        {topicError ? (
          <FormError id="article-topic-error">{topicError}</FormError>
        ) : null}
      </div>

      <div className="space-y-2">
        <Button type="button" variant="secondary" onClick={() => void copyPrompt()}>
          Copy AI writing prompt
        </Button>
        {copied ? (
          <p className="text-sm text-(--dash-muted-fg)" role="status">
            Prompt copied
          </p>
        ) : null}
        {fallbackPrompt ? (
          <div className="space-y-1.5">
            <p className="text-sm text-(--dash-muted-fg)" role="status">
              Could not copy automatically. Select the prompt below and copy it
              yourself.
            </p>
            <Textarea
              readOnly
              value={fallbackPrompt}
              rows={12}
              aria-label="AI writing prompt"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
