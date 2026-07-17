"use client";

import { useState } from "react";
import { getJune2024FinancialReports } from "@/lib/data/reportsData";
import type { InsightReportId } from "@/lib/data/week3Challenges";
import { TrialBalanceTable } from "@/components/reports/TrialBalanceTable";
import { ProfitAndLossTable } from "@/components/reports/ProfitAndLossTable";
import { BalanceSheetTable } from "@/components/reports/BalanceSheetTable";
import { BusinessInsightsPanel } from "@/components/reports/BusinessInsightsPanel";

const TABS: { id: InsightReportId; label: string }[] = [
  { id: "trial-balance", label: "Trial Balance" },
  { id: "profit-loss", label: "Profit & Loss" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "insights", label: "Insights" },
];

type InsightDetectiveReportsPanelProps = {
  suggestedReport?: InsightReportId;
};

export function InsightDetectiveReportsPanel({
  suggestedReport = "profit-loss",
}: InsightDetectiveReportsPanelProps) {
  const [activeTab, setActiveTab] = useState<InsightReportId>(suggestedReport);
  const [expanded, setExpanded] = useState(true);
  const reports = getJune2024FinancialReports();

  return (
    <div className="rounded-2xl border border-ledger-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ledger-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-ledger-900">June 2024 reports</p>
          <p className="text-xs text-ledger-500">Bright Path Consulting</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ledger-600 hover:bg-ledger-100"
          aria-expanded={expanded}
        >
          {expanded ? "Hide reports" : "Show reports"}
        </button>
      </div>

      {expanded && (
        <>
          <div
            className="flex flex-wrap gap-1 border-b border-ledger-100 px-3 py-2"
            role="tablist"
            aria-label="Reference reports"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-ledger-600 text-white"
                    : "bg-ledger-50 text-ledger-700 hover:bg-ledger-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-[28rem] overflow-y-auto p-3">
            {activeTab === "trial-balance" && (
              <TrialBalanceTable
                trialBalance={reports.trialBalance.trialBalance}
                formattedRows={reports.trialBalance.formattedRows}
                explanation=""
                asOfLabel="June 30, 2024"
                layout="stacked"
              />
            )}
            {activeTab === "profit-loss" && (
              <ProfitAndLossTable
                report={reports.profitAndLoss}
                explanation=""
                embedded
              />
            )}
            {activeTab === "balance-sheet" && (
              <BalanceSheetTable
                report={reports.balanceSheet}
                explanation=""
                embedded
              />
            )}
            {activeTab === "insights" && (
              <BusinessInsightsPanel
                report={reports.insights}
                explanation=""
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
