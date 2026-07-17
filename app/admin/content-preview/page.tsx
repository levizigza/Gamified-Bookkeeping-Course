import type { Metadata } from "next";
import { ContentPreview } from "@/components/admin/ContentPreview";
import { getValidatedCourseContent } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: "Content Preview — Ledger Quest Admin",
  description: "Read-only course content review for lesson and challenge authors.",
  robots: { index: false, follow: false },
};

export default function AdminContentPreviewPage() {
  const { bundle, validation } = getValidatedCourseContent();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <ContentPreview bundle={bundle} validation={validation} />
    </div>
  );
}
