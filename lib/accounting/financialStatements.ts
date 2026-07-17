import type {
  BalanceSheetLine,
  BalanceSheetReport,
  FinancialStatementPeriod,
  ProfitAndLossLine,
  ProfitAndLossReport,
  TrialBalanceRow,
} from "@/lib/types/accounting";
import type { ChartAccount } from "@/lib/data/chartOfAccounts";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";

export type BalanceSheetEquationResult = {
  balanced: boolean;
  totalAssetsCents: number;
  totalLiabilitiesCents: number;
  totalEquityCents: number;
  differenceCents: number;
  explanation: string;
};

export type BusinessInsight = {
  id: string;
  question: string;
  answer: string;
  detail: string;
};

export type BusinessInsightsReport = {
  insights: BusinessInsight[];
};

function accountLookup(chart: ChartAccount[]): Map<string, ChartAccount> {
  return new Map(chart.map((a) => [a.id, a]));
}

/** Positive balance amount from a trial balance row (always >= 0 for active accounts). */
export function rowBalanceCents(row: TrialBalanceRow): number {
  return Math.max(row.debitCents, row.creditCents);
}

function toProfitAndLossLine(row: TrialBalanceRow): ProfitAndLossLine {
  return {
    accountId: row.accountId,
    accountName: row.accountName,
    accountSubType: row.accountSubType,
    amountCents: rowBalanceCents(row),
  };
}

function toBalanceSheetLine(row: TrialBalanceRow): BalanceSheetLine {
  return {
    accountId: row.accountId,
    accountName: row.accountName,
    accountSubType: row.accountSubType,
    balanceCents: rowBalanceCents(row),
  };
}

/** Revenue minus direct costs (cents). */
export function calculateGrossProfit(
  totalRevenueCents: number,
  totalDirectCostsCents: number,
): number {
  return totalRevenueCents - totalDirectCostsCents;
}

/** Revenue minus direct costs and operating expenses (cents). */
export function calculateNetIncome(
  totalRevenueCents: number,
  totalDirectCostsCents: number,
  totalOperatingExpensesCents: number,
): number {
  return totalRevenueCents - totalDirectCostsCents - totalOperatingExpensesCents;
}

export function calculateTotalAssets(assetLines: BalanceSheetLine[]): number {
  return assetLines.reduce((sum, line) => sum + line.balanceCents, 0);
}

export function calculateTotalLiabilities(
  liabilityLines: BalanceSheetLine[],
): number {
  return liabilityLines.reduce((sum, line) => sum + line.balanceCents, 0);
}

export function calculateTotalEquity(
  equityLines: BalanceSheetLine[],
  netIncomeCents = 0,
): number {
  const equityAccounts = equityLines.reduce((sum, line) => sum + line.balanceCents, 0);
  return equityAccounts + netIncomeCents;
}

/**
 * Verify Assets = Liabilities + Equity (including current-period net income when books are not closed).
 */
export function validateBalanceSheetEquation(
  totalAssetsCents: number,
  totalLiabilitiesCents: number,
  totalEquityCents: number,
): BalanceSheetEquationResult {
  const differenceCents = totalAssetsCents - (totalLiabilitiesCents + totalEquityCents);
  const balanced = differenceCents === 0;

  const explanation = balanced
    ? `The balance sheet balances: assets (${formatCentsForMessage(totalAssetsCents)}) equal liabilities plus equity (${formatCentsForMessage(totalLiabilitiesCents + totalEquityCents)}). The accounting equation holds.`
    : `The balance sheet is off by ${formatCentsForMessage(Math.abs(differenceCents))}. Assets (${formatCentsForMessage(totalAssetsCents)}) should equal liabilities (${formatCentsForMessage(totalLiabilitiesCents)}) plus equity (${formatCentsForMessage(totalEquityCents)}). Review your trial balance and statement mapping.`;

  return {
    balanced,
    totalAssetsCents,
    totalLiabilitiesCents,
    totalEquityCents,
    differenceCents,
    explanation,
  };
}

/**
 * Build a Profit & Loss report from trial balance rows.
 * Income appears as revenue; expenses split into direct costs and operating expenses.
 */
export function generateProfitAndLoss(
  trialBalanceRows: TrialBalanceRow[],
  chartOfAccounts: ChartAccount[],
  period: FinancialStatementPeriod,
): ProfitAndLossReport {
  const accounts = accountLookup(chartOfAccounts);
  const activeRows = trialBalanceRows.filter(
    (r) => (r.debitCents > 0 || r.creditCents > 0) && accounts.has(r.accountId),
  );

  const revenueLines: ProfitAndLossLine[] = [];
  const directCostLines: ProfitAndLossLine[] = [];
  const operatingExpenseLines: ProfitAndLossLine[] = [];

  for (const row of activeRows) {
    if (row.accountType !== "income" && row.accountType !== "expense") continue;

    const line = toProfitAndLossLine(row);

    if (row.accountType === "income" || row.accountSubType === "revenue") {
      revenueLines.push(line);
    } else if (row.accountSubType === "direct_cost") {
      directCostLines.push(line);
    } else if (row.accountSubType === "operating_expense") {
      operatingExpenseLines.push(line);
    }
  }

  revenueLines.sort((a, b) => a.accountName.localeCompare(b.accountName));
  directCostLines.sort((a, b) => a.accountName.localeCompare(b.accountName));
  operatingExpenseLines.sort((a, b) => a.accountName.localeCompare(b.accountName));

  const totalRevenueCents = revenueLines.reduce((s, l) => s + l.amountCents, 0);
  const totalDirectCostsCents = directCostLines.reduce((s, l) => s + l.amountCents, 0);
  const totalOperatingExpensesCents = operatingExpenseLines.reduce(
    (s, l) => s + l.amountCents,
    0,
  );

  const grossProfitCents = calculateGrossProfit(totalRevenueCents, totalDirectCostsCents);
  const netIncomeCents = calculateNetIncome(
    totalRevenueCents,
    totalDirectCostsCents,
    totalOperatingExpensesCents,
  );

  return {
    period,
    revenueLines,
    directCostLines,
    operatingExpenseLines,
    totalRevenueCents,
    totalDirectCostsCents,
    totalOperatingExpensesCents,
    grossProfitCents,
    netIncomeCents,
  };
}

/**
 * Build a Balance Sheet from trial balance rows.
 * Includes current-period net income in equity when income/expense accounts have not been closed.
 */
export function generateBalanceSheet(
  trialBalanceRows: TrialBalanceRow[],
  chartOfAccounts: ChartAccount[],
  asOfDate: string,
  netIncomeCents: number,
): BalanceSheetReport {
  const accounts = accountLookup(chartOfAccounts);
  const activeRows = trialBalanceRows.filter(
    (r) => (r.debitCents > 0 || r.creditCents > 0) && accounts.has(r.accountId),
  );

  const assetLines: BalanceSheetLine[] = [];
  const liabilityLines: BalanceSheetLine[] = [];
  const equityLines: BalanceSheetLine[] = [];

  for (const row of activeRows) {
    if (row.accountType === "income" || row.accountType === "expense") continue;

    const line = toBalanceSheetLine(row);

    if (row.accountType === "asset") {
      assetLines.push(line);
    } else if (row.accountType === "liability") {
      liabilityLines.push(line);
    } else if (row.accountType === "equity") {
      equityLines.push(line);
    }
  }

  if (netIncomeCents !== 0) {
    equityLines.push({
      accountId: "current-period-net-income",
      accountName: "Net income (current period)",
      accountSubType: "equity",
      balanceCents: netIncomeCents,
    });
  }

  assetLines.sort((a, b) => a.accountName.localeCompare(b.accountName));
  liabilityLines.sort((a, b) => a.accountName.localeCompare(b.accountName));
  equityLines.sort((a, b) => a.accountName.localeCompare(b.accountName));

  const totalAssetsCents = calculateTotalAssets(assetLines);
  const totalLiabilitiesCents = calculateTotalLiabilities(liabilityLines);
  const totalEquityCents = calculateTotalEquity(
    equityLines.filter((l) => l.accountId !== "current-period-net-income"),
    netIncomeCents,
  );

  const equation = validateBalanceSheetEquation(
    totalAssetsCents,
    totalLiabilitiesCents,
    totalEquityCents,
  );

  return {
    asOfDate,
    assetLines,
    liabilityLines,
    equityLines,
    totalAssetsCents,
    totalLiabilitiesCents,
    totalEquityCents,
    balanced: equation.balanced,
  };
}

/** Decision-support insights derived from P&L and Balance Sheet. */
export function generateBusinessInsights(
  profitAndLoss: ProfitAndLossReport,
  balanceSheet: BalanceSheetReport,
): BusinessInsightsReport {
  const largestExpense = [...profitAndLoss.operatingExpenseLines].sort(
    (a, b) => b.amountCents - a.amountCents,
  )[0];

  const profitable = profitAndLoss.netIncomeCents > 0;

  const insights: BusinessInsight[] = [
    {
      id: "profitable",
      question: "Is this business profitable?",
      answer: profitable ? "Yes — June was profitable." : "No — June shows a loss.",
      detail: profitable
        ? `Bright Path Consulting earned ${formatCentsForMessage(profitAndLoss.netIncomeCents)} in net income for ${profitAndLoss.period.label}. Revenue exceeded expenses.`
        : `Expenses exceeded revenue by ${formatCentsForMessage(Math.abs(profitAndLoss.netIncomeCents))} in ${profitAndLoss.period.label}. Review spending and pricing.`,
    },
    {
      id: "largest-expense",
      question: "What is the largest expense?",
      answer: largestExpense
        ? largestExpense.accountName
        : "No operating expenses recorded",
      detail: largestExpense
        ? `${largestExpense.accountName} was the largest operating expense at ${formatCentsForMessage(largestExpense.amountCents)}. Knowing your biggest costs helps you negotiate, cut waste, or plan cash flow.`
        : "No operating expenses appeared on the Profit & Loss for this period.",
    },
    {
      id: "bs-balanced",
      question: "Does the balance sheet balance?",
      answer: balanceSheet.balanced ? "Yes — the accounting equation holds." : "No — investigate the difference.",
      detail: validateBalanceSheetEquation(
        balanceSheet.totalAssetsCents,
        balanceSheet.totalLiabilitiesCents,
        balanceSheet.totalEquityCents,
      ).explanation,
    },
    {
      id: "owner-decision",
      question: "What decision should the owner consider?",
      answer: profitable
        ? "Consider reinvesting in growth or building a cash reserve."
        : "Review expenses and client pricing before expanding.",
      detail: buildOwnerDecisionDetail(profitable, profitAndLoss, balanceSheet),
    },
  ];

  return { insights };
}

function buildOwnerDecisionDetail(
  profitable: boolean,
  pl: ProfitAndLossReport,
  bs: BalanceSheetReport,
): string {
  const cashLine = bs.assetLines.find((l) => l.accountId === "bank-cash");
  const cash = cashLine?.balanceCents ?? 0;
  const ccLine = bs.liabilityLines.find((l) => l.accountId === "credit-card-payable");
  const ccDebt = ccLine?.balanceCents ?? 0;

  if (profitable && cash > 0) {
    return (
      `June net income was ${formatCentsForMessage(pl.netIncomeCents)} and bank cash is ${formatCentsForMessage(cash)}. ` +
      `The owner might set aside GST remittance funds, pay down the credit card (${formatCentsForMessage(ccDebt)} owed), or save for equipment upgrades.`
    );
  }

  return (
    `With ${formatCentsForMessage(pl.totalOperatingExpensesCents)} in operating expenses, ` +
    `track meals, travel, and subscriptions closely next month. A clear P&L each month makes pricing and hiring decisions safer.`
  );
}

export function explainProfitAndLoss(report: ProfitAndLossReport): string {
  return (
    `The Profit & Loss statement shows how Bright Path Consulting performed during ${report.period.label}. ` +
    `Total income was ${formatCentsForMessage(report.totalRevenueCents)}. ` +
    `After direct costs (${formatCentsForMessage(report.totalDirectCostsCents)}) and operating expenses ` +
    `(${formatCentsForMessage(report.totalOperatingExpensesCents)}), net income was ` +
    `${formatCentsForMessage(report.netIncomeCents)}. ` +
    `This answers: "Did we make or lose money this month?"`
  );
}

export function explainBalanceSheet(report: BalanceSheetReport): string {
  return (
    `The Balance Sheet is a snapshot as of ${report.asOfDate}. ` +
    `The business owns ${formatCentsForMessage(report.totalAssetsCents)} in assets and owes ` +
    `${formatCentsForMessage(report.totalLiabilitiesCents)} to others. ` +
    `Owner equity (including this period's profit) totals ${formatCentsForMessage(report.totalEquityCents)}. ` +
    `This answers: "What do we own and owe right now?"`
  );
}
