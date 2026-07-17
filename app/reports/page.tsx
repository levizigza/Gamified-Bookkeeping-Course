import Link from "next/link";
import { ReportsRoomTabs } from "@/components/reports/ReportsRoomTabs";
import { Button } from "@/components/ui/Button";
import { VisualBanner } from "@/components/visuals/VisualBanner";
import { getMockUserProgress } from "@/lib/data/mock-data";

export const metadata = {
  title: "Reports — Ledger Quest",
};

export default function ReportsPage() {
  const progress = getMockUserProgress();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-5">
        <Link href="/dashboard" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to dashboard
        </Link>
      </nav>
      <VisualBanner
        variant="reports"
        eyebrow={progress.businessName}
        title="Reports Room"
        description="Watch your June 2024 books transform from trial balance rows into a clear financial story."
      />
      <span className="-mt-5 mb-6 inline-flex rounded-full bg-ledger-100 px-3 py-1 text-xs font-semibold text-ledger-700">
        As of June 30, 2024
      </span>

      <ReportsRoomTabs />

      <div className="mt-8">
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
