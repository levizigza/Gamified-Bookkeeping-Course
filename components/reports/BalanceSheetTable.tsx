import type { BalanceSheetReport } from "@/lib/types/accounting";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ExplanationCard } from "@/components/reports/ExplanationCard";

type BalanceSheetTableProps = {
  report: BalanceSheetReport;
  explanation: string;
  embedded?: boolean;
};

function BsSection({
  title,
  lines,
  total,
  totalLabel,
}: {
  title: string;
  lines: { accountId: string; accountName: string; balanceCents: number }[];
  total: number;
  totalLabel: string;
}) {
  return (
    <div className="border-b border-ledger-100 pb-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ledger-600">
        {title}
      </h3>
      <ul className="space-y-1">
        {lines.map((line) => (
          <li
            key={line.accountId}
            className="flex justify-between text-sm text-ledger-800"
          >
            <span>{line.accountName}</span>
            <span className="tabular-nums">{formatCentsForMessage(line.balanceCents)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t border-ledger-200 pt-2 font-semibold text-ledger-900">
        <span>{totalLabel}</span>
        <span className="tabular-nums">{formatCentsForMessage(total)}</span>
      </div>
    </div>
  );
}

export function BalanceSheetTable({
  report,
  explanation,
  embedded = false,
}: BalanceSheetTableProps) {
  const liabilitiesAndEquity = report.totalLiabilitiesCents + report.totalEquityCents;

  const table = (
    <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ledger-200 p-6">
          <div>
            <CardTitle>Balance Sheet</CardTitle>
            <CardDescription className="mt-1">
              As of June 30, 2024 · Bright Path Consulting
            </CardDescription>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
              report.balanced
                ? "bg-ledger-600 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {report.balanced ? "✓ Balanced" : "! Out of balance"}
          </span>
        </div>
        <div className="space-y-4 p-6">
          <BsSection
            title="Assets"
            lines={report.assetLines}
            total={report.totalAssetsCents}
            totalLabel="Total Assets"
          />
          <BsSection
            title="Liabilities"
            lines={report.liabilityLines}
            total={report.totalLiabilitiesCents}
            totalLabel="Total Liabilities"
          />
          <BsSection
            title="Equity"
            lines={report.equityLines}
            total={report.totalEquityCents}
            totalLabel="Total Equity"
          />
          <div className="flex justify-between rounded-lg bg-ledger-900 px-4 py-3 font-bold text-white">
            <span>Total Liabilities &amp; Equity</span>
            <span className="tabular-nums">
              {formatCentsForMessage(liabilitiesAndEquity)}
            </span>
          </div>
        </div>
      </Card>
  );

  if (embedded) return table;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">{table}</div>
      <ExplanationCard title="What this report means">{explanation}</ExplanationCard>
    </div>
  );
}
