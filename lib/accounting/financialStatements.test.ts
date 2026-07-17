import { describe, expect, it } from "vitest";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { getJune2024FinancialReports } from "@/lib/data/reportsData";
import { brightPathJune2024Entries } from "@/lib/data/sampleJournalEntries";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import { buildFormattedTrialBalance } from "@/lib/accounting/trialBalance";
import {
  calculateGrossProfit,
  calculateNetIncome,
  generateBalanceSheet,
  generateBusinessInsights,
  generateProfitAndLoss,
  validateBalanceSheetEquation,
} from "@/lib/accounting/financialStatements";

describe("financialStatements", () => {
  const period = {
    startDate: sampleBusiness.simulatedMonth.startDate,
    endDate: sampleBusiness.simulatedMonth.endDate,
    label: sampleBusiness.simulatedMonth.label,
  };

  const tb = buildFormattedTrialBalance(
    brightPathJune2024Entries,
    chartOfAccounts,
    sampleBusiness.simulatedMonth.endDate,
  );

  it("generates P&L with gross profit and net income", () => {
    const pl = generateProfitAndLoss(tb.trialBalance.rows, chartOfAccounts, period);
    expect(pl.totalRevenueCents).toBeGreaterThan(0);
    expect(pl.grossProfitCents).toBe(
      calculateGrossProfit(pl.totalRevenueCents, pl.totalDirectCostsCents),
    );
    expect(pl.netIncomeCents).toBe(
      calculateNetIncome(
        pl.totalRevenueCents,
        pl.totalDirectCostsCents,
        pl.totalOperatingExpensesCents,
      ),
    );
  });

  it("generates a balanced balance sheet including net income in equity", () => {
    const pl = generateProfitAndLoss(tb.trialBalance.rows, chartOfAccounts, period);
    const bs = generateBalanceSheet(
      tb.trialBalance.rows,
      chartOfAccounts,
      sampleBusiness.simulatedMonth.endDate,
      pl.netIncomeCents,
    );
    expect(bs.balanced).toBe(true);
    expect(bs.totalAssetsCents).toBe(bs.totalLiabilitiesCents + bs.totalEquityCents);
  });

  it("validates the accounting equation", () => {
    const reports = getJune2024FinancialReports();
    const result = validateBalanceSheetEquation(
      reports.balanceSheet.totalAssetsCents,
      reports.balanceSheet.totalLiabilitiesCents,
      reports.balanceSheet.totalEquityCents,
    );
    expect(result.balanced).toBe(true);
  });

  it("generates four business insights", () => {
    const reports = getJune2024FinancialReports();
    const insights = generateBusinessInsights(reports.profitAndLoss, reports.balanceSheet);
    expect(insights.insights).toHaveLength(4);
    expect(insights.insights.map((i) => i.question)).toContain(
      "Is this business profitable?",
    );
    expect(insights.insights.map((i) => i.question)).toContain(
      "Does the balance sheet balance?",
    );
  });

  it("identifies June as profitable for Bright Path sample data", () => {
    const reports = getJune2024FinancialReports();
    expect(reports.profitAndLoss.netIncomeCents).toBeGreaterThan(0);
    const profitable = reports.insights.insights.find((i) => i.id === "profitable");
    expect(profitable?.answer).toContain("Yes");
  });
});
