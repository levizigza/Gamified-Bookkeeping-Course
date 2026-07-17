"use client";

import type { TrialBalance } from "@/lib/types/accounting";
import type { FormattedTrialBalanceRow } from "@/lib/accounting/trialBalance";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ExplanationCard } from "@/components/reports/ExplanationCard";

type TrialBalanceTableProps = {
  trialBalance: TrialBalance;
  formattedRows: FormattedTrialBalanceRow[];
  explanation: string;
  asOfLabel?: string;
  layout?: "stacked" | "side-by-side";
};

export function TrialBalanceTable({
  trialBalance,
  formattedRows,
  explanation,
  asOfLabel = "June 30, 2024",
  layout = "side-by-side",
}: TrialBalanceTableProps) {
  const activeRows = formattedRows.filter((r) => r.hasActivity);

  const table = (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-ledger-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Trial Balance</CardTitle>
            <CardDescription className="mt-1">
              As of {asOfLabel} · Bright Path Consulting
            </CardDescription>
          </div>
          <BalancedBadge balanced={trialBalance.balanced} />
        </div>
        {layout === "stacked" && explanation && (
          <p className="mt-4 text-sm leading-relaxed text-ledger-600">{explanation}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm">
          <thead>
            <tr className="border-b border-ledger-200 bg-ledger-50 text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-ledger-700">
                Code
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-ledger-700">
                Account
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-ledger-700">
                Debit
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-ledger-700">
                Credit
              </th>
            </tr>
          </thead>
          <tbody>
            {activeRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ledger-500">
                  No account activity to display.
                </td>
              </tr>
            ) : (
              activeRows.map((row) => (
                <tr
                  key={row.accountId}
                  className={`border-b border-ledger-100 ${
                    row.isAbnormalBalance ? "bg-amber-50/60" : ""
                  }`}
                  title={row.abnormalExplanation}
                >
                  <td className="px-4 py-2.5 tabular-nums text-ledger-500">
                    {row.accountCode}
                  </td>
                  <td className="px-4 py-2.5 text-ledger-900">
                    {row.accountName}
                    {row.isAbnormalBalance && (
                      <span className="ml-2 text-xs text-amber-700">(unusual)</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ledger-900">
                    {row.debitDisplay}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ledger-900">
                    {row.creditDisplay}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-ledger-100 font-semibold">
              <td colSpan={2} className="px-4 py-3 text-ledger-800">
                Totals
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ledger-900">
                {formatCentsForMessage(trialBalance.totalDebitsCents)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ledger-900">
                {formatCentsForMessage(trialBalance.totalCreditsCents)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );

  if (layout === "side-by-side") {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">{table}</div>
        <ExplanationCard title="What this report means">{explanation}</ExplanationCard>
      </div>
    );
  }

  return table;
}

function BalancedBadge({ balanced }: { balanced: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
        balanced
          ? "bg-ledger-600 text-white"
          : "bg-amber-100 text-amber-800"
      }`}
      role="status"
    >
      <span aria-hidden="true">{balanced ? "✓" : "!"}</span>
      {balanced ? "Balanced" : "Out of balance"}
    </span>
  );
}
