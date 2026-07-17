"use client";

import { useState } from "react";
import Link from "next/link";
import { getJune2024FinancialReports } from "@/lib/data/reportsData";
import { TrialBalanceTable } from "@/components/reports/TrialBalanceTable";
import { ProfitAndLossTable } from "@/components/reports/ProfitAndLossTable";
import { BalanceSheetTable } from "@/components/reports/BalanceSheetTable";
import { BusinessInsightsPanel } from "@/components/reports/BusinessInsightsPanel";
import { Button } from "@/components/ui/Button";

const TABS = [
  { id: "trial-balance", label: "Trial Balance" },
  { id: "profit-loss", label: "Profit & Loss" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "insights", label: "Business Insights" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ReportsRoomTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("trial-balance");
  const reports = getJune2024FinancialReports();

  return (
    <div className="space-y-6">
      <div className="card-surface overflow-hidden p-4 sm:p-6">
        <div
          className="mb-6 flex gap-2 overflow-x-auto border-b border-ledger-200 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Financial reports"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ledger-500 ${
                activeTab === tab.id
                  ? "bg-ledger-600 text-white shadow-sm"
                  : "bg-ledger-100 text-ledger-700 hover:bg-ledger-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="panel-trial-balance"
          role="tabpanel"
          aria-labelledby="tab-trial-balance"
          hidden={activeTab !== "trial-balance"}
          className="animate-fade-in"
        >
          {activeTab === "trial-balance" && (
            <TrialBalanceTable
              trialBalance={reports.trialBalance.trialBalance}
              formattedRows={reports.trialBalance.formattedRows}
              explanation={reports.explanations.trialBalance}
              asOfLabel="June 30, 2024"
            />
          )}
        </div>

        <div
          id="panel-profit-loss"
          role="tabpanel"
          aria-labelledby="tab-profit-loss"
          hidden={activeTab !== "profit-loss"}
          className="animate-fade-in"
        >
          {activeTab === "profit-loss" && (
            <ProfitAndLossTable
              report={reports.profitAndLoss}
              explanation={reports.explanations.profitAndLoss}
            />
          )}
        </div>

        <div
          id="panel-balance-sheet"
          role="tabpanel"
          aria-labelledby="tab-balance-sheet"
          hidden={activeTab !== "balance-sheet"}
          className="animate-fade-in"
        >
          {activeTab === "balance-sheet" && (
            <BalanceSheetTable
              report={reports.balanceSheet}
              explanation={reports.explanations.balanceSheet}
            />
          )}
        </div>

        <div
          id="panel-insights"
          role="tabpanel"
          aria-labelledby="tab-insights"
          hidden={activeTab !== "insights"}
          className="animate-fade-in"
        >
          {activeTab === "insights" && (
            <BusinessInsightsPanel
              report={reports.insights}
              explanation={reports.explanations.insights}
            />
          )}
        </div>
      </div>

      <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold text-ledger-900">Practice what these reports teach</p>
          <p className="text-sm text-ledger-600">
            Switch from reading statements to building the instinct owners need.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/challenges/challenge-insight-detective">
            <Button size="sm">Insight Detective</Button>
          </Link>
          <Link href="/games/report-reader">
            <Button size="sm" variant="outline">
              Report Reader game
            </Button>
          </Link>
          <Link href="/games/statement-sorter">
            <Button size="sm" variant="ghost">
              Statement Sorter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
