import type { Metadata } from "next";
import Link from "next/link";
import { AiWritingHelper } from "@/app/dashboard/articles/ai-writing-helper";
import { ArticleForm } from "@/app/dashboard/articles/article-form";
import { OriginalityPanel } from "@/app/dashboard/articles/originality-panel";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Article",
};

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/articles"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to Articles
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Create Article
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Write the Article. Save as Draft until it is ready. You can add a hero
          image after it exists.
        </p>
      </div>

      <Card className="max-w-4xl">
        <AiWritingHelper />
      </Card>

      <Card className="max-w-4xl">
        <OriginalityPanel />
      </Card>

      <Card className="max-w-4xl">
        <ArticleForm />
      </Card>
    </div>
  );
}
