import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { brightPathJune2024Entries } from "@/lib/data/sampleJournalEntries";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import { buildFormattedTrialBalance } from "@/lib/accounting/trialBalance";
import {
  explainBalanceSheet,
  explainProfitAndLoss,
  generateBalanceSheet,
  generateBusinessInsights,
  generateProfitAndLoss,
} from "@/lib/accounting/financialStatements";

export function getJune2024FinancialReports() {
  const period = {
    startDate: sampleBusiness.simulatedMonth.startDate,
    endDate: sampleBusiness.simulatedMonth.endDate,
    label: sampleBusiness.simulatedMonth.label,
  };

  const trialBalanceResult = buildFormattedTrialBalance(
    brightPathJune2024Entries,
    chartOfAccounts,
    sampleBusiness.simulatedMonth.endDate,
  );

  const profitAndLoss = generateProfitAndLoss(
    trialBalanceResult.trialBalance.rows,
    chartOfAccounts,
    period,
  );

  const balanceSheet = generateBalanceSheet(
    trialBalanceResult.trialBalance.rows,
    chartOfAccounts,
    sampleBusiness.simulatedMonth.endDate,
    profitAndLoss.netIncomeCents,
  );

  const insights = generateBusinessInsights(profitAndLoss, balanceSheet);

  return {
    trialBalance: trialBalanceResult,
    profitAndLoss,
    balanceSheet,
    insights,
    explanations: {
      trialBalance: trialBalanceResult.explanation,
      profitAndLoss: explainProfitAndLoss(profitAndLoss),
      balanceSheet: explainBalanceSheet(balanceSheet),
      insights:
        "These questions turn your numbers into decisions. A profitable month with cash in the bank suggests different choices than a loss with rising credit card debt.",
    },
  };
}
