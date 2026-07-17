/**
 * Core accounting types for Ledger Quest.
 *
 * Money is always stored in whole cents (e.g. 1050 = $10.50) to avoid
 * floating-point rounding errors. These types model how real bookkeeping works,
 * from everyday transactions through to year-end reports.
 */

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/** Supported currencies in the practice scenario. */
export type Currency = "USD" | "CAD";

/**
 * An amount of money stored as whole cents.
 * Example: $10.50 is represented as `{ amountCents: 1050, currency: "USD" }`.
 */
export type MoneyAmount = {
  amountCents: number;
  currency: Currency;
};

// ---------------------------------------------------------------------------
// Chart of accounts
// ---------------------------------------------------------------------------

/**
 * The five main account groups every business uses.
 * Think of these as the top-level folders in your chart of accounts.
 */
export type AccountType = "asset" | "liability" | "equity" | "income" | "expense";

/**
 * More specific labels that sit under each AccountType.
 * For example, "Cash" is a current_asset; "Equipment" is a fixed_asset.
 */
export type AccountSubType =
  | "current_asset"
  | "fixed_asset"
  | "current_liability"
  | "long_term_liability"
  | "revenue"
  | "direct_cost"
  | "operating_expense"
  | "equity";

/**
 * A single account in the chart of accounts — like "Cash", "Accounts Receivable",
 * or "Office Supplies Expense". Every journal line points to one account.
 */
export type Account = {
  id: string;
  /** Short numeric or alphanumeric code (e.g. "1000" for Cash). */
  code: string;
  name: string;
  type: AccountType;
  subType: AccountSubType;
  /** When false, the account cannot receive new journal lines. */
  active: boolean;
  description?: string;
};

// ---------------------------------------------------------------------------
// Transactions (business events)
// ---------------------------------------------------------------------------

/**
 * How sales tax is handled on a transaction.
 * In the simulator we use a simplified model — real rules vary by location.
 */
export type SalesTaxTreatment =
  | {
      /** Tax is collected on a sale and owed to the government. */
      kind: "collected";
      /** Tax rate as a decimal (e.g. 0.08 = 8%). */
      rate: number;
      /** Tax amount in cents, calculated from the taxable base. */
      taxCents: number;
    }
  | {
      /** Tax paid on a purchase that may be recoverable as an input credit. */
      kind: "paid";
      rate: number;
      taxCents: number;
    }
  | {
      /** No sales tax applies to this transaction. */
      kind: "exempt";
    };

/**
 * One side of a business transaction before it is posted as a journal entry.
 * Each line points to an account and is either a debit or a credit.
 */
export type DebitTransactionLine = {
  accountId: string;
  side: "debit";
  amountCents: number;
  memo?: string;
};

export type CreditTransactionLine = {
  accountId: string;
  side: "credit";
  amountCents: number;
  memo?: string;
};

export type TransactionLine = DebitTransactionLine | CreditTransactionLine;

/**
 * A real-world business event — a sale, purchase, or payment — described in
 * plain language before it becomes a formal journal entry in the ledger.
 */
export type Transaction = {
  id: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  description: string;
  vendorOrCustomer?: string;
  lines: TransactionLine[];
  salesTax?: SalesTaxTreatment;
  /** Links to the journal entry once this transaction is posted. */
  journalEntryId?: string;
};

// ---------------------------------------------------------------------------
// Journal entries (double-entry bookkeeping)
// ---------------------------------------------------------------------------

/**
 * One line in a journal entry. Each line affects exactly one account and is
 * either a debit OR a credit — never both on the same line.
 */
export type DebitJournalLine = {
  accountId: string;
  debitCents: number;
  creditCents?: never;
  memo?: string;
};

export type CreditJournalLine = {
  accountId: string;
  debitCents?: never;
  creditCents: number;
  memo?: string;
};

export type JournalLine = DebitJournalLine | CreditJournalLine;

/**
 * A formal accounting record of a transaction using double-entry bookkeeping.
 * Every entry must have at least two lines, and total debits must equal total credits.
 */
export type JournalEntry = {
  id: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  description: string;
  /** At least two lines — one debit and one credit at minimum. */
  lines: [JournalLine, JournalLine, ...JournalLine[]];
  /** Optional link back to the source transaction. */
  transactionId?: string;
};

// ---------------------------------------------------------------------------
// Trial balance
// ---------------------------------------------------------------------------

/**
 * One row in a trial balance — the total debits and credits for a single account
 * after all journal entries have been posted.
 */
export type TrialBalanceRow = {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  accountSubType: AccountSubType;
  debitCents: number;
  creditCents: number;
};

/**
 * A list of all account balances at a point in time. If bookkeeping is correct,
 * total debits will equal total credits.
 */
export type TrialBalance = {
  asOfDate: string;
  rows: TrialBalanceRow[];
  totalDebitsCents: number;
  totalCreditsCents: number;
  balanced: boolean;
};

// ---------------------------------------------------------------------------
// Financial statements
// ---------------------------------------------------------------------------

/**
 * The date range a financial statement covers (e.g. June 1–30, 2024).
 */
export type FinancialStatementPeriod = {
  startDate: string;
  endDate: string;
  label: string;
};

/** One line on a Profit & Loss (Income Statement) report. */
export type ProfitAndLossLine = {
  accountId: string;
  accountName: string;
  accountSubType: AccountSubType;
  amountCents: number;
};

/**
 * Profit & Loss (Income Statement) — shows revenue minus expenses for a period.
 * Answers: "Did the business make or lose money this month?"
 */
export type ProfitAndLossReport = {
  period: FinancialStatementPeriod;
  revenueLines: ProfitAndLossLine[];
  directCostLines: ProfitAndLossLine[];
  operatingExpenseLines: ProfitAndLossLine[];
  totalRevenueCents: number;
  totalDirectCostsCents: number;
  totalOperatingExpensesCents: number;
  /** Revenue minus direct costs. */
  grossProfitCents: number;
  /** Revenue minus all expenses. */
  netIncomeCents: number;
};

/** One line on a Balance Sheet report. */
export type BalanceSheetLine = {
  accountId: string;
  accountName: string;
  accountSubType: AccountSubType;
  balanceCents: number;
};

/**
 * Balance Sheet — a snapshot of what the business owns and owes at one date.
 * The accounting equation must hold: Assets = Liabilities + Equity.
 */
export type BalanceSheetReport = {
  asOfDate: string;
  assetLines: BalanceSheetLine[];
  liabilityLines: BalanceSheetLine[];
  equityLines: BalanceSheetLine[];
  totalAssetsCents: number;
  totalLiabilitiesCents: number;
  totalEquityCents: number;
  balanced: boolean;
};

// ---------------------------------------------------------------------------
// Year-end adjusting entries
// ---------------------------------------------------------------------------

/**
 * A fixed asset (like a laptop) that is written off over time through depreciation.
 */
export type DepreciationAsset = {
  id: string;
  name: string;
  /** Original purchase price in cents. */
  purchasePriceCents: number;
  purchaseDate: string;
  /** Useful life in whole months (e.g. 36 months = 3 years). */
  usefulLifeMonths: number;
  /** Portion already depreciated in cents. */
  accumulatedDepreciationCents: number;
  linkedAccountId: string;
};

/**
 * Home office expense claim — the business-use percentage of home costs.
 */
export type HomeOfficeClaim = {
  id: string;
  period: FinancialStatementPeriod;
  /** Square footage used for business. */
  businessSquareFeet: number;
  /** Total home square footage. */
  totalSquareFeet: number;
  /** Business-use ratio (0–1), e.g. 0.15 = 15%. */
  businessUsePercent: number;
  /** Home expenses to allocate (rent, utilities, etc.) in cents. */
  eligibleExpensesCents: number;
  /** businessUsePercent × eligibleExpensesCents, rounded to whole cents. */
  claimAmountCents: number;
};

/**
 * Mileage log for vehicle expense claims using a per-mile/km rate.
 */
export type MileageClaim = {
  id: string;
  period: FinancialStatementPeriod;
  /** Total business kilometres or miles driven. */
  businessDistance: number;
  unit: "miles" | "kilometres";
  /** Rate per unit in cents (e.g. 67 = $0.67/mile). */
  rateCentsPerUnit: number;
  /** businessDistance × rateCentsPerUnit, rounded to whole cents. */
  claimAmountCents: number;
};

// ---------------------------------------------------------------------------
// Validation & challenge feedback
// ---------------------------------------------------------------------------

/** Machine-readable codes for accounting validation failures. */
export type ValidationErrorCode =
  | "MIN_LINES"
  | "UNBALANCED"
  | "NEGATIVE_AMOUNT"
  | "BOTH_SIDES"
  | "MISSING_SIDE"
  | "ZERO_AMOUNT"
  | "UNKNOWN_ACCOUNT"
  | "INVALID_DATE"
  | "STATEMENT_IMBALANCE";

/**
 * A single validation problem with a beginner-friendly explanation.
 */
export type ValidationError = {
  code: ValidationErrorCode;
  message: string;
  /** Optional field path (e.g. "lines[1].debitCents") for UI highlighting. */
  field?: string;
};

/** Result of validating accounting data — either success or a list of errors. */
export type ValidationResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };

/**
 * Educational feedback shown after a challenge attempt.
 * Every challenge should explain *why* the answer is right or wrong.
 */
export type ChallengeFeedback = {
  correct: boolean;
  /** Short headline (e.g. "Nice work — your entry balances!"). */
  summary: string;
  /** Longer explanation tied to the bookkeeping concept being taught. */
  explanation: string;
  /** Optional nudge when the learner is close but not correct. */
  hint?: string;
  /** Name of the concept reinforced (e.g. "Double-entry balance"). */
  relatedConcept?: string;
  /** Validation errors when the attempt failed due to rule violations. */
  errors?: ValidationError[];
};
