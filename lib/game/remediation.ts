/**
 * Adaptive learning feedback — classifies mistakes and serves encouraging remediation.
 */

export type RemediationWeakAreaId =
  | "account_category_confusion"
  | "debit_credit_confusion"
  | "sales_tax_confusion"
  | "trial_balance_confusion"
  | "financial_statement_confusion"
  | "year_end_journal_confusion"
  | "calculation_error";

export type SimplerPracticeQuestion = {
  prompt: string;
  /** Short model answer shown after the learner tries. */
  answer: string;
  hint: string;
};

export type RemediationContent = {
  id: RemediationWeakAreaId;
  label: string;
  /** Warm opener when the learner misses a question. */
  encouragement: string;
  explanation: string;
  tip: string;
  lessonId: string;
  lessonTitle: string;
  simplerQuestion: SimplerPracticeQuestion;
};

export type MistakeContext = {
  challengeId: string;
  questionType?: string;
  /** Classifier wrong fields: accountType, accountId, cashEffect, salesTaxApplies */
  wrongFields?: string[];
  amountCorrect?: boolean;
  balanced?: boolean;
  accountsScore?: number;
  accountsMax?: number;
  directionScore?: number;
  directionMax?: number;
  salesTaxScore?: number;
  salesTaxMax?: number;
  balancedScore?: number;
  balancedMax?: number;
  scorePercent?: number;
};

export const REMEDIATION_CONTENT: Record<RemediationWeakAreaId, RemediationContent> = {
  account_category_confusion: {
    id: "account_category_confusion",
    label: "Account categories",
    encouragement:
      "Sorting accounts into the right category is a skill every owner builds — you are on the right track.",
    explanation:
      "Each transaction belongs to one of five groups: assets, liabilities, equity, income, or expenses. " +
      "Picking the right group is the first step before you choose a specific account.",
    tip: "Ask: \"Did the business gain something, owe something, earn revenue, or spend money?\" That points to the category.",
    lessonId: "lesson-account-types",
    lessonTitle: "Account Categories",
    simplerQuestion: {
      prompt:
        "You bought printer paper with your business debit card. Which category fits best?",
      answer: "Expense — the business spent money on supplies.",
      hint: "Cash went down, but the main story is an operating cost, not buying a long-term asset.",
    },
  },
  debit_credit_confusion: {
    id: "debit_credit_confusion",
    label: "Debits & credits",
    encouragement:
      "Debits and credits trip up everyone at first — what matters is that you are practicing the habit.",
    explanation:
      "Debits and credits are simply left and right sides of an entry. Assets and expenses usually increase on the debit side; " +
      "liabilities, equity, and income usually increase on the credit side. Both sides must equal.",
    tip: "After you pick accounts, say out loud: \"Cash went down, expense went up\" — then place each on the correct side.",
    lessonId: "lesson-double-entry",
    lessonTitle: "Double-Entry Basics",
    simplerQuestion: {
      prompt:
        "Bright Path pays $50 for internet from the business bank account. " +
        "Which side gets Telephone Expense, and which gets Bank/Cash?",
      answer: "Debit Telephone Expense $50, credit Bank/Cash $50.",
      hint: "An expense increases with a debit; cash (an asset) decreases with a credit.",
    },
  },
  sales_tax_confusion: {
    id: "sales_tax_confusion",
    label: "GST / sales tax",
    encouragement:
      "GST splits are easy to miss — noticing them now saves headaches at remittance time.",
    explanation:
      "In Alberta, GST is often 5% on top of a purchase or sale. On a sale you collect GST and credit GST/HST Payable. " +
      "On a purchase you may debit GST/HST Payable as an input tax credit. The expense or revenue line is the pre-tax amount.",
    tip: "Separate the tax: if the receipt total is $105, $100 is the expense and $5 is GST.",
    lessonId: "lesson-double-entry",
    lessonTitle: "Double-Entry Basics",
    simplerQuestion: {
      prompt:
        "You sell consulting for $1,000 plus 5% GST ($1,050 total collected). " +
        "What amount goes to Consulting Income?",
      answer: "$1,000 to Consulting Income; $50 to GST/HST Payable (credit).",
      hint: "Revenue is the fee before tax; the tax portion is owed to the government.",
    },
  },
  trial_balance_confusion: {
    id: "trial_balance_confusion",
    label: "Trial balance",
    encouragement:
      "A trial balance is your safety check — catching an imbalance now is a win, not a failure.",
    explanation:
      "A trial balance lists every account with its debit or credit balance. Total debits must equal total credits. " +
      "If they do not, a journal entry is missing, duplicated, or off by amount.",
    tip: "When totals differ, scan recent entries first — June meal and supply entries are common culprits.",
    lessonId: "lesson-trial-balance",
    lessonTitle: "Trial Balance Puzzle",
    simplerQuestion: {
      prompt: "Total debits are $10,000 and total credits are $9,950. What does that tell you?",
      answer:
        "The books are out of balance by $50 — find the entry that is missing a line or has a wrong amount.",
      hint: "Every journal entry must have equal debits and credits before the trial balance can balance.",
    },
  },
  financial_statement_confusion: {
    id: "financial_statement_confusion",
    label: "Financial statements",
    encouragement:
      "Reading statements is like learning a new language — each attempt makes the next report clearer.",
    explanation:
      "The Profit & Loss shows performance over a period (income minus expenses). " +
      "The Balance Sheet shows position at a point in time (assets, liabilities, equity). " +
      "They answer different questions, so the same dollar may appear on only one statement.",
    tip: "Net income lives on the P&L; cash and equipment live on the Balance Sheet.",
    lessonId: "lesson-profit-loss",
    lessonTitle: "Profit & Loss",
    simplerQuestion: {
      prompt: "Where would you find how much Bright Path earned in consulting fees for June?",
      answer: "On the Profit & Loss statement, in the Income section.",
      hint: "Revenue and expenses are period activities — they belong on the P&L, not the Balance Sheet snapshot.",
    },
  },
  year_end_journal_confusion: {
    id: "year_end_journal_confusion",
    label: "Year-end adjusting entries",
    encouragement:
      "Year-end entries feel advanced, but you are building exactly the skills accountants want owners to understand.",
    explanation:
      "Adjusting entries update your books before tax season — depreciation spreads asset cost, home office allocates business-use share of home costs, " +
      "and mileage claims vehicle expense. They usually debit an expense and credit accumulated amortization or shareholder loan.",
    tip: "Calculate the amount first, then build a two-line entry that balances.",
    lessonId: "lesson-depreciation",
    lessonTitle: "Year-End Adjustments",
    simplerQuestion: {
      prompt:
        "Bright Path records $9,000 vehicle depreciation. Which accounts are involved?",
      answer: "Debit Depreciation Expense; credit Accumulated Amortization - Vehicle.",
      hint: "Depreciation records expense without paying cash — the credit goes to a contra-asset account.",
    },
  },
  calculation_error: {
    id: "calculation_error",
    label: "Amount calculations",
    encouragement:
      "The math is the easy part to fix once the concept clicks — you are closer than it feels.",
    explanation:
      "Many bookkeeping answers start with a dollar amount: amortization (cost × rate), home office (area % × costs), " +
      "or mileage (km × per-km rate). Write the formula, then post that number to both sides of the entry.",
    tip: "Use the year-end calculators to check your work, then type the same amount into each journal line.",
    lessonId: "lesson-depreciation",
    lessonTitle: "Year-End Adjustments",
    simplerQuestion: {
      prompt: "Office area is 150 sq ft of a 1,500 sq ft home. What is the business-use percentage?",
      answer: "10% (150 ÷ 1,500). Multiply eligible home costs by 10% for the claim.",
      hint: "Divide the smaller area by the total area before applying costs.",
    },
  },
};

const CHALLENGE_DEFAULT_WEAK_AREA: Record<string, RemediationWeakAreaId> = {
  "challenge-classify-transaction": "account_category_confusion",
  "challenge-double-entry-duel": "debit_credit_confusion",
  "challenge-sort-accounts": "account_category_confusion",
  "challenge-trial-balance": "trial_balance_confusion",
  "challenge-insight-detective": "financial_statement_confusion",
  "challenge-year-end-boss": "year_end_journal_confusion",
  "challenge-build-pl": "financial_statement_confusion",
  "challenge-build-bs": "financial_statement_confusion",
  "challenge-depreciation": "year_end_journal_confusion",
};

function scoreBelow(score: number | undefined, max: number | undefined): boolean {
  if (score === undefined || max === undefined || max === 0) return false;
  return score < max;
}

/**
 * Classify a missed question into exactly one primary weak area.
 */
export function classifyMistake(context: MistakeContext): RemediationWeakAreaId {
  const { challengeId, wrongFields = [] } = context;

  if (wrongFields.includes("salesTaxApplies")) {
    return "sales_tax_confusion";
  }

  if (
    scoreBelow(context.salesTaxScore, context.salesTaxMax) &&
    (challengeId.includes("duel") || challengeId.includes("journal"))
  ) {
    return "sales_tax_confusion";
  }

  if (context.amountCorrect === false) {
    return "calculation_error";
  }

  if (
    wrongFields.includes("accountType") ||
    wrongFields.includes("accountId") ||
    scoreBelow(context.accountsScore, context.accountsMax)
  ) {
    if (challengeId.includes("sort") || wrongFields.includes("accountType")) {
      return "account_category_confusion";
    }
    if (challengeId.includes("sort-accounts")) {
      return "account_category_confusion";
    }
    if (challengeId.includes("insight") && context.questionType === "identify_account") {
      return "account_category_confusion";
    }
    if (scoreBelow(context.accountsScore, context.accountsMax)) {
      return challengeId.includes("year-end") || challengeId.includes("depreciation")
        ? "year_end_journal_confusion"
        : "account_category_confusion";
    }
    return "account_category_confusion";
  }

  if (
    wrongFields.includes("cashEffect") ||
    scoreBelow(context.directionScore, context.directionMax) ||
    scoreBelow(context.balancedScore, context.balancedMax) ||
    context.balanced === false
  ) {
    if (challengeId.includes("trial")) {
      return "trial_balance_confusion";
    }
    return "debit_credit_confusion";
  }

  if (
    challengeId.includes("insight") ||
    challengeId.includes("build-pl") ||
    challengeId.includes("build-bs") ||
    context.questionType === "select_report" ||
    context.questionType === "business_decision"
  ) {
    return "financial_statement_confusion";
  }

  if (
    challengeId.includes("trial-balance") ||
    challengeId.includes("trial_balance")
  ) {
    return "trial_balance_confusion";
  }

  if (
    challengeId.includes("year-end") ||
    challengeId.includes("depreciation")
  ) {
    return "year_end_journal_confusion";
  }

  if (context.questionType === "numeric") {
    return "calculation_error";
  }

  return CHALLENGE_DEFAULT_WEAK_AREA[challengeId] ?? "account_category_confusion";
}

export function getRemediationContent(
  weakAreaId: RemediationWeakAreaId,
): RemediationContent {
  return REMEDIATION_CONTENT[weakAreaId];
}

export function weakAreaIdToTag(id: RemediationWeakAreaId): string {
  return id;
}

export type RecommendedPractice = {
  weakArea: RemediationContent;
  missCount: number;
  encouragement: string;
};

/** Pick the most frequent weak area for dashboard recommended practice. */
export function getRecommendedPractice(
  weakAreaIds: RemediationWeakAreaId[],
): RecommendedPractice | null {
  if (weakAreaIds.length === 0) return null;

  const counts = new Map<RemediationWeakAreaId, number>();
  for (const id of weakAreaIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const [topId, missCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const weakArea = getRemediationContent(topId);

  return {
    weakArea,
    missCount,
    encouragement: `${weakArea.encouragement} Practice below to build confidence.`,
  };
}

export function buildWeakAreaSummary(
  weakAreaIds: RemediationWeakAreaId[],
  limit = 4,
): Array<{
  category: RemediationWeakAreaId;
  label: string;
  missCount: number;
  recommendation: string;
  lessonId: string;
  lessonTitle: string;
  tip: string;
  explanation: string;
}> {
  const counts = new Map<RemediationWeakAreaId, number>();
  for (const id of weakAreaIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, missCount]) => {
      const content = getRemediationContent(id);
      return {
        category: id,
        label: content.label,
        missCount,
        recommendation: content.explanation,
        lessonId: content.lessonId,
        lessonTitle: content.lessonTitle,
        tip: content.tip,
        explanation: content.explanation,
      };
    });
}
