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
        <Link href="/board" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to game board
        </Link>
      </nav>
      <VisualBanner
        variant="reports"
        eyebrow={progress.businessName}
        title="Reports Room"
        description="Use the tabs below to follow Bright Path’s June account balances into two financial reports and then into practical business insights."
      />
      <span className="-mt-5 mb-6 inline-flex rounded-full bg-ledger-100 px-3 py-1 text-xs font-semibold text-ledger-700">
        As of June 30, 2024
      </span>

      <aside className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="font-semibold text-blue-950">Read the tabs from left to right</p>
        <ol className="mt-2 grid gap-2 text-sm leading-relaxed text-blue-900 sm:grid-cols-3">
          <li><strong>1. Trial Balance:</strong> check that total debits equal total credits.</li>
          <li><strong>2. Financial reports:</strong> read profit and what the business owns and owes.</li>
          <li><strong>3. Business Insights:</strong> use the numbers to choose a sensible next step.</li>
        </ol>
      </aside>

      <ReportsRoomTabs />

      <div className="mt-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/board">
            <Button>Return to board</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">View dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
