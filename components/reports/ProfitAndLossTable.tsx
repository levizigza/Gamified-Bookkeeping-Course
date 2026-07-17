import type { ProfitAndLossReport } from "@/lib/types/accounting";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ExplanationCard } from "@/components/reports/ExplanationCard";

type ProfitAndLossTableProps = {
  report: ProfitAndLossReport;
  explanation: string;
  embedded?: boolean;
};

function StatementSection({
  title,
  lines,
  total,
  totalLabel,
}: {
  title: string;
  lines: { accountId: string; accountName: string; amountCents: number }[];
  total?: number;
  totalLabel?: string;
}) {
  if (lines.length === 0 && total === undefined) return null;

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
            <span className="tabular-nums">{formatCentsForMessage(line.amountCents)}</span>
          </li>
        ))}
      </ul>
      {total !== undefined && totalLabel && (
        <div className="mt-2 flex justify-between border-t border-ledger-200 pt-2 font-semibold text-ledger-900">
          <span>{totalLabel}</span>
          <span className="tabular-nums">{formatCentsForMessage(total)}</span>
        </div>
      )}
    </div>
  );
}

export function ProfitAndLossTable({
  report,
  explanation,
  embedded = false,
}: ProfitAndLossTableProps) {
  const profitable = report.netIncomeCents >= 0;

  const table = (
    <Card className="overflow-hidden p-0">
        <div className="border-b border-ledger-200 p-6">
          <CardTitle>Profit &amp; Loss</CardTitle>
          <CardDescription className="mt-1">
            {report.period.label} · Bright Path Consulting
          </CardDescription>
        </div>
        <div className="space-y-4 p-6">
          <StatementSection
            title="Income"
            lines={report.revenueLines}
            total={report.totalRevenueCents}
            totalLabel="Total Income"
          />
          <StatementSection
            title="Direct Costs"
            lines={report.directCostLines}
            total={report.totalDirectCostsCents}
            totalLabel="Total Direct Costs"
          />
          <div className="flex justify-between rounded-lg bg-ledger-100 px-4 py-3 font-semibold text-ledger-900">
            <span>Gross Profit</span>
            <span className="tabular-nums">
              {formatCentsForMessage(report.grossProfitCents)}
            </span>
          </div>
          <StatementSection
            title="Expenses"
            lines={report.operatingExpenseLines}
            total={report.totalOperatingExpensesCents}
            totalLabel="Total Expenses"
          />
          <div
            className={`flex justify-between rounded-lg px-4 py-3 font-bold ${
              profitable
                ? "bg-ledger-600 text-white"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            <span>Net Income</span>
            <span className="tabular-nums">
              {formatCentsForMessage(report.netIncomeCents)}
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
