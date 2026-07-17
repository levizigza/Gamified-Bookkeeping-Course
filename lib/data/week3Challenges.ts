import { getJune2024FinancialReports } from "@/lib/data/reportsData";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";

export const INSIGHT_DETECTIVE_CHALLENGE_ID = "challenge-insight-detective";
export const INSIGHT_DETECTIVE_BADGE_ID = "insight-detective";
export const INSIGHT_DETECTIVE_PASS_THRESHOLD = 80;

export type InsightReportId =
  | "trial-balance"
  | "profit-loss"
  | "balance-sheet"
  | "insights";

export type InsightQuestionType =
  | "multiple_choice"
  | "numeric"
  | "select_report"
  | "identify_account"
  | "business_decision";

export type InsightOption = {
  id: string;
  label: string;
};

export type InsightDetectiveQuestion = {
  id: string;
  type: InsightQuestionType;
  prompt: string;
  hint: string;
  suggestedReport: InsightReportId;
  options?: InsightOption[];
  correctOptionId?: string;
  correctNumericCents?: number;
  correctFeedback: string;
  incorrectFeedback: string;
  baseXp: number;
};

export type InsightDetectiveChallenge = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  worldId: "reports-room";
  xpReward: number;
  passThresholdPercent: number;
  badgeId: string;
  badgeName: string;
  questions: InsightDetectiveQuestion[];
};

const REPORT_OPTIONS: InsightOption[] = [
  { id: "profit-loss", label: "Profit & Loss" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "trial-balance", label: "Trial Balance" },
  { id: "insights", label: "Business Insights" },
];

function buildQuestions(): InsightDetectiveQuestion[] {
  const reports = getJune2024FinancialReports();
  const { profitAndLoss: pl, trialBalance: tb } = reports;

  const largestExpense = [...pl.operatingExpenseLines].sort(
    (a, b) => b.amountCents - a.amountCents,
  )[0];
  const profitable = pl.netIncomeCents > 0;
  const ownerInsight = reports.insights.insights.find((i) => i.id === "owner-decision");

  const expenseAccountOptions: InsightOption[] = [
    { id: "meals-and-entertainment", label: "Meals and Entertainment" },
    { id: "telephone-expense", label: "Telephone Expense" },
    { id: "supplies", label: "Supplies" },
    { id: "bank-service-charges", label: "Bank Service Charges" },
  ];

  const balanceSheetAccountOptions: InsightOption[] = [
    { id: "consulting-income", label: "Consulting Income" },
    { id: "bank-cash", label: "Bank/Cash" },
    { id: "telephone-expense", label: "Telephone Expense" },
    { id: "meals-and-entertainment", label: "Meals and Entertainment" },
  ];

  const profitAndLossAccountOptions: InsightOption[] = [
    { id: "bank-cash", label: "Bank/Cash" },
    { id: "equipment", label: "Equipment" },
    { id: "consulting-income", label: "Consulting Income" },
    { id: "credit-card-payable", label: "Credit Card Payable" },
  ];

  return [
    {
      id: "q-net-income-report",
      type: "select_report",
      prompt: "Which report shows net income?",
      hint: "Look for the bottom-line performance number after income and expenses.",
      suggestedReport: "profit-loss",
      options: REPORT_OPTIONS,
      correctOptionId: "profit-loss",
      correctFeedback:
        "Correct — the Profit & Loss statement ends with net income. It answers whether the business made or lost money during the period.",
      incorrectFeedback:
        "Net income lives on the Profit & Loss statement. The Balance Sheet shows what you own and owe; the trial balance lists every account balance before statements are built.",
      baseXp: 15,
    },
    {
      id: "q-assets-liabilities-report",
      type: "select_report",
      prompt: "Which report shows assets and liabilities?",
      hint: "This snapshot report uses the accounting equation: Assets = Liabilities + Equity.",
      suggestedReport: "balance-sheet",
      options: REPORT_OPTIONS,
      correctOptionId: "balance-sheet",
      correctFeedback:
        "Correct — the Balance Sheet groups assets, liabilities, and equity as of a specific date. It shows business position, not monthly performance.",
      incorrectFeedback:
        "Assets and liabilities appear on the Balance Sheet. The Profit & Loss covers income and expenses for a period, not what you own or owe today.",
      baseXp: 15,
    },
    {
      id: "q-largest-expense",
      type: "identify_account",
      prompt: "What is the business's largest operating expense?",
      hint: "Open the Profit & Loss and compare expense line amounts for June.",
      suggestedReport: "profit-loss",
      options: expenseAccountOptions,
      correctOptionId: largestExpense?.accountId ?? "telephone-expense",
      correctFeedback: largestExpense
        ? `Correct — ${largestExpense.accountName} was the largest operating expense at ${formatCentsForMessage(largestExpense.amountCents)}. Spotting your biggest costs helps you negotiate, cut waste, or plan cash flow.`
        : "Correct — you identified the largest operating expense on the Profit & Loss.",
      incorrectFeedback: largestExpense
        ? `Not quite — compare expense amounts on the P&L. ${largestExpense.accountName} was largest at ${formatCentsForMessage(largestExpense.amountCents)}.`
        : "Check the Expenses section on the Profit & Loss and compare dollar amounts.",
      baseXp: 15,
    },
    {
      id: "q-net-income-numeric",
      type: "numeric",
      prompt: "What is Bright Path's net income for June 2024? Enter the amount in whole dollars.",
      hint: "Find net income at the bottom of the Profit & Loss report.",
      suggestedReport: "profit-loss",
      correctNumericCents: pl.netIncomeCents,
      correctFeedback: `Correct — net income was ${formatCentsForMessage(pl.netIncomeCents)}. That is income minus direct costs and operating expenses for June.`,
      incorrectFeedback: `The June net income on the Profit & Loss is ${formatCentsForMessage(pl.netIncomeCents)}. Revenue was ${formatCentsForMessage(pl.totalRevenueCents)} minus ${formatCentsForMessage(pl.totalDirectCostsCents + pl.totalOperatingExpensesCents)} in costs.`,
      baseXp: 20,
    },
    {
      id: "q-profitable",
      type: "multiple_choice",
      prompt: "Is the business profitable for June 2024?",
      hint: "Profitable means net income is greater than zero.",
      suggestedReport: "profit-loss",
      options: [
        { id: "yes", label: "Yes — June was profitable" },
        { id: "no", label: "No — June showed a loss" },
        { id: "break-even", label: "Break-even — net income is exactly zero" },
        { id: "unknown", label: "Cannot tell from these reports" },
      ],
      correctOptionId: profitable ? "yes" : "no",
      correctFeedback: profitable
        ? `Correct — net income of ${formatCentsForMessage(pl.netIncomeCents)} means revenue exceeded expenses. Bright Path had a profitable June.`
        : `Correct — expenses exceeded revenue by ${formatCentsForMessage(Math.abs(pl.netIncomeCents))}. The business was not profitable this month.`,
      incorrectFeedback: profitable
        ? `June was profitable. Net income of ${formatCentsForMessage(pl.netIncomeCents)} is positive, meaning the business earned more than it spent.`
        : "When net income is negative, the business lost money for the period even if cash in the bank looks healthy.",
      baseXp: 15,
    },
    {
      id: "q-tb-balanced",
      type: "multiple_choice",
      prompt: "Does the trial balance balance?",
      hint: "A balanced trial balance has equal total debits and total credits.",
      suggestedReport: "trial-balance",
      options: [
        { id: "yes", label: "Yes — debits equal credits" },
        { id: "no", label: "No — debits and credits differ" },
        { id: "partial", label: "Only asset accounts balance" },
        { id: "unknown", label: "Cannot tell without the P&L" },
      ],
      correctOptionId: tb.trialBalance.balanced ? "yes" : "no",
      correctFeedback: tb.trialBalance.balanced
        ? `Correct — total debits (${formatCentsForMessage(tb.trialBalance.totalDebitsCents)}) equal total credits (${formatCentsForMessage(tb.trialBalance.totalCreditsCents)}). A balanced trial balance is the foundation for financial statements.`
        : "Correct — the trial balance is out of balance. Fix journal entries before building P&L or Balance Sheet reports.",
      incorrectFeedback: tb.trialBalance.balanced
        ? `The trial balance does balance. Debits and credits both total ${formatCentsForMessage(tb.trialBalance.totalDebitsCents)} — check the totals row on the Trial Balance tab.`
        : "When debits do not equal credits, something is wrong in the journal. The trial balance must balance before statements are reliable.",
      baseXp: 15,
    },
    {
      id: "q-expenses-up",
      type: "multiple_choice",
      prompt: "What happens to net income if operating expenses increase (with revenue unchanged)?",
      hint: "Net income is what is left after expenses are subtracted from revenue.",
      suggestedReport: "profit-loss",
      options: [
        { id: "decrease", label: "Net income decreases" },
        { id: "increase", label: "Net income increases" },
        { id: "unchanged", label: "Net income stays the same" },
        { id: "assets-only", label: "Only total assets change" },
      ],
      correctOptionId: "decrease",
      correctFeedback:
        "Correct — higher expenses leave less profit. Net income = revenue − direct costs − operating expenses, so more spending pulls the bottom line down.",
      incorrectFeedback:
        "Expenses reduce profit. If you spend more on meals, phone, or supplies without earning more revenue, net income falls — even when cash in the bank does not change immediately.",
      baseXp: 15,
    },
    {
      id: "q-cash-equipment",
      type: "multiple_choice",
      prompt: "What happens to total assets when cash is used to buy equipment?",
      hint: "Think about which accounts change — cash goes down, equipment goes up.",
      suggestedReport: "balance-sheet",
      options: [
        { id: "same", label: "Total assets stay the same — cash down, equipment up" },
        { id: "up", label: "Total assets increase" },
        { id: "down", label: "Total assets decrease" },
        { id: "liabilities", label: "Only liabilities change" },
      ],
      correctOptionId: "same",
      correctFeedback:
        "Correct — you traded one asset for another. Cash decreases and equipment increases by the same amount, so total assets are unchanged. No profit or loss occurs on the purchase itself.",
      incorrectFeedback:
        "Buying equipment with cash is an asset swap. Bank/Cash goes down and Equipment goes up by the same dollar amount — total assets on the Balance Sheet stay the same.",
      baseXp: 15,
    },
    {
      id: "q-bs-account",
      type: "identify_account",
      prompt: "Which account belongs on the Balance Sheet?",
      hint: "Balance Sheet accounts are assets, liabilities, and equity — not monthly income or expenses.",
      suggestedReport: "balance-sheet",
      options: balanceSheetAccountOptions,
      correctOptionId: "bank-cash",
      correctFeedback:
        "Correct — Bank/Cash is an asset and belongs on the Balance Sheet. It shows how much cash the business holds at month-end.",
      incorrectFeedback:
        "Bank/Cash is an asset on the Balance Sheet. Consulting Income and expense accounts like Meals or Telephone appear on the Profit & Loss, not the Balance Sheet snapshot.",
      baseXp: 15,
    },
    {
      id: "q-pl-account",
      type: "identify_account",
      prompt: "Which account belongs on the Profit & Loss?",
      hint: "P&L accounts are income and expenses that explain monthly performance.",
      suggestedReport: "profit-loss",
      options: profitAndLossAccountOptions,
      correctOptionId: "consulting-income",
      correctFeedback:
        "Correct — Consulting Income is revenue and belongs on the Profit & Loss. It shows fees earned during June, whether or not cash was collected yet.",
      incorrectFeedback:
        "Consulting Income is revenue on the P&L. Bank/Cash and Equipment are assets on the Balance Sheet; Credit Card Payable is a liability.",
      baseXp: 15,
    },
    {
      id: "q-owner-decision",
      type: "business_decision",
      prompt: "What decision could the owner make from this June data?",
      hint: "Combine P&L profit with Balance Sheet cash and liabilities.",
      suggestedReport: "insights",
      options: [
        {
          id: "reserve-gst",
          label: "Set aside GST remittance funds and consider paying down the credit card",
        },
        {
          id: "ignore-books",
          label: "Stop tracking expenses until revenue doubles",
        },
        {
          id: "skip-tb",
          label: "Skip the trial balance next month to save time",
        },
        {
          id: "close-equity",
          label: "Remove equity accounts so the balance sheet shows only assets",
        },
      ],
      correctOptionId: "reserve-gst",
      correctFeedback: ownerInsight
        ? `Correct — ${ownerInsight.detail}`
        : "Correct — profitable months with cash on hand are a good time to set aside tax/GST funds and reduce liabilities like credit card balances.",
      incorrectFeedback:
        "Strong reports support practical choices: reserve GST, pay down debt, or save for equipment. Ignoring bookkeeping or removing equity accounts would break accurate financial records.",
      baseXp: 20,
    },
  ];
}

let cachedChallenge: InsightDetectiveChallenge | null = null;

export function getInsightDetectiveChallenge(): InsightDetectiveChallenge {
  if (!cachedChallenge) {
    const questions = buildQuestions();
    cachedChallenge = {
      id: INSIGHT_DETECTIVE_CHALLENGE_ID,
      title: "Insight Detective",
      description:
        "Follow the Week 3 flow: Trial Balance → Profit & Loss + Balance Sheet → Insights → Decisions. " +
        "Score 80% or higher on your first try to earn the Insight Detective badge.",
      lessonId: "lesson-balance-sheet",
      worldId: "reports-room",
      xpReward: questions.reduce((sum, q) => sum + q.baseXp, 0),
      passThresholdPercent: INSIGHT_DETECTIVE_PASS_THRESHOLD,
      badgeId: INSIGHT_DETECTIVE_BADGE_ID,
      badgeName: "Insight Detective",
      questions,
    };
  }
  return cachedChallenge;
}
