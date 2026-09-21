"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function PromotionDraft({
  heading,
  channelId,
  initialText,
}: {
  heading: string;
  channelId: string;
  initialText: string;
}) {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }

  return (
    <Card className="space-y-3">
      <h2 className="text-base font-medium">{heading}</h2>
      <div className="space-y-1.5">
        <Label htmlFor={channelId}>{heading} post</Label>
        <Textarea
          id={channelId}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setCopyFailed(false);
          }}
          rows={8}
        />
      </div>
      <p className="text-sm text-(--dash-muted-fg)">{text.length} characters</p>
      <div className="space-y-2">
        <Button type="button" variant="secondary" onClick={() => void copyPost()}>
          Copy post
        </Button>
        {copied ? (
          <p className="text-sm text-(--dash-muted-fg)" role="status">
            Copied
          </p>
        ) : null}
        {copyFailed ? (
          <p className="text-sm text-(--dash-muted-fg)" role="status">
            Could not copy automatically. Select the post and copy it yourself.
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export function ArticlePromotionDrafts({
  facebook,
  instagram,
  linkedin,
  x,
}: {
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
}) {
  return (
    <div className="grid max-w-3xl gap-6">
      <PromotionDraft
        heading="Facebook"
        channelId="facebook-post"
        initialText={facebook}
      />
      <PromotionDraft
        heading="Instagram"
        channelId="instagram-post"
        initialText={instagram}
      />
      <PromotionDraft
        heading="LinkedIn"
        channelId="linkedin-post"
        initialText={linkedin}
      />
      <PromotionDraft heading="X" channelId="x-post" initialText={x} />
    </div>
  );
}
