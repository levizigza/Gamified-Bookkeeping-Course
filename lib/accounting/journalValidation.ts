import type {
  JournalEntry,
  JournalLine,
  ValidationError,
  ValidationResult,
} from "@/lib/types/accounting";

/** Minimal journal entry shape accepted by validation helpers. */
export type JournalEntryLike = {
  lines: JournalLine[];
  description?: string;
  date?: string;
  id?: string;
};

export type CorrectionDifference = {
  kind:
    | "missing_line"
    | "extra_line"
    | "wrong_account"
    | "wrong_side"
    | "wrong_amount"
    | "unbalanced"
    | "line_count";
  message: string;
  lineIndex?: number;
};

export type CorrectionSuggestion = {
  summary: string;
  steps: string[];
  differences: CorrectionDifference[];
};

/** Optional map of account id → display name for readable explanations. */
export type AccountNameLookup = Record<string, string>;

const DEFAULT_ACCOUNT_NAMES: AccountNameLookup = {
  "bank-cash": "Bank/Cash",
  "accounts-receivable": "Accounts Receivable",
  "accounts-payable": "Accounts Payable",
  "credit-card-payable": "Credit Card Payable",
  "gst-hst-payable": "GST/HST Payable",
  "consulting-income": "Consulting Income",
  supplies: "Supplies",
  "telephone-expense": "Telephone Expense",
  equipment: "Equipment",
};

// ---------------------------------------------------------------------------
// Line helpers (cents only)
// ---------------------------------------------------------------------------

export function getLineDebitCents(line: JournalLine): number {
  return "debitCents" in line && line.debitCents !== undefined ? line.debitCents : 0;
}

export function getLineCreditCents(line: JournalLine): number {
  return "creditCents" in line && line.creditCents !== undefined ? line.creditCents : 0;
}

export function formatCentsForMessage(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(dollars);
}

function accountLabel(accountId: string, lookup: AccountNameLookup): string {
  return lookup[accountId] ?? accountId;
}

function lineSideLabel(line: JournalLine): "debit" | "credit" {
  return getLineDebitCents(line) > 0 ? "debit" : "credit";
}

function lineAmountCents(line: JournalLine): number {
  const debit = getLineDebitCents(line);
  return debit > 0 ? debit : getLineCreditCents(line);
}

// ---------------------------------------------------------------------------
// Core calculations
// ---------------------------------------------------------------------------

/** Sum all debit amounts in cents across every line. */
export function calculateDebits(entry: JournalEntryLike): number {
  return entry.lines.reduce((sum, line) => sum + getLineDebitCents(line), 0);
}

/** Sum all credit amounts in cents across every line. */
export function calculateCredits(entry: JournalEntryLike): number {
  return entry.lines.reduce((sum, line) => sum + getLineCreditCents(line), 0);
}

/** True when total debits equal total credits (and both are greater than zero). */
export function isBalanced(entry: JournalEntryLike): boolean {
  const debits = calculateDebits(entry);
  const credits = calculateCredits(entry);
  return debits > 0 && debits === credits;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateJournalEntry(entry: JournalEntryLike): ValidationResult {
  const errors: ValidationError[] = [];

  if (entry.lines.length < 2) {
    errors.push({
      code: "MIN_LINES",
      message:
        "Add at least two lines — every transaction needs both a debit and a credit. " +
        "For example, buying supplies with cash debits Supplies and credits Bank/Cash.",
    });
  }

  let totalDebits = 0;
  let totalCredits = 0;

  entry.lines.forEach((line, index) => {
    const debitCents = getLineDebitCents(line);
    const creditCents = getLineCreditCents(line);
    const field = `lines[${index}]`;
    const lineNum = index + 1;

    if (debitCents < 0 || creditCents < 0) {
      errors.push({
        code: "NEGATIVE_AMOUNT",
        message: `Line ${lineNum} has a negative amount. Enter positive cents on either the debit or credit side only.`,
        field,
      });
    }

    if (debitCents > 0 && creditCents > 0) {
      errors.push({
        code: "BOTH_SIDES",
        message: `Line ${lineNum} has both a debit and a credit. Pick one side per line — debits and credits live on separate lines.`,
        field,
      });
    }

    if (debitCents === 0 && creditCents === 0) {
      errors.push({
        code: "ZERO_AMOUNT",
        message: `Line ${lineNum} is empty. Enter an amount on the debit side or the credit side.`,
        field,
      });
    }

    totalDebits += debitCents;
    totalCredits += creditCents;
  });

  if (entry.lines.length >= 2 && totalDebits !== totalCredits) {
    const diff = Math.abs(totalDebits - totalCredits);
    const heavier = totalDebits > totalCredits ? "debits" : "credits";
  const lighter = totalDebits > totalCredits ? "credits" : "debits";
    errors.push({
      code: "UNBALANCED",
      message:
        `This entry is out of balance by ${formatCentsForMessage(diff)}. ` +
        `Total debits are ${formatCentsForMessage(totalDebits)} but total credits are ${formatCentsForMessage(totalCredits)}. ` +
        `Increase ${lighter} or decrease ${heavier} by ${formatCentsForMessage(diff)} so both sides match.`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: undefined };
}

// ---------------------------------------------------------------------------
// Explanation
// ---------------------------------------------------------------------------

export function explainJournalEntry(
  entry: JournalEntryLike,
  accountNames: AccountNameLookup = DEFAULT_ACCOUNT_NAMES,
): string {
  const validation = validateJournalEntry(entry);
  const debits = calculateDebits(entry);
  const credits = calculateCredits(entry);
  const parts: string[] = [];

  if (entry.description) {
    parts.push(`This entry records: ${entry.description}.`);
  }

  if (entry.lines.length === 0) {
    return "This journal entry has no lines yet. Add at least one debit and one credit.";
  }

  const lineDescriptions = entry.lines.map((line, i) => {
    const name = accountLabel(line.accountId, accountNames);
    const amount = lineAmountCents(line);
    const side = lineSideLabel(line);
    return `Line ${i + 1}: ${side} ${name} ${formatCentsForMessage(amount)}`;
  });

  parts.push(lineDescriptions.join(". ") + ".");

  if (!validation.ok) {
    const primary = validation.errors[0];
    parts.push(primary.message);
    return parts.join(" ");
  }

  parts.push(
    `The entry is balanced — total debits (${formatCentsForMessage(debits)}) ` +
      `equal total credits (${formatCentsForMessage(credits)}). ` +
      `Every dollar that left one account was recorded on another side, which is the heart of double-entry bookkeeping.`,
  );

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Correction suggestions
// ---------------------------------------------------------------------------

type NormalizedLine = {
  accountId: string;
  side: "debit" | "credit";
  amountCents: number;
};

function normalizeLines(lines: JournalLine[]): NormalizedLine[] {
  return lines.map((line) => ({
    accountId: line.accountId,
    side: lineSideLabel(line),
    amountCents: lineAmountCents(line),
  }));
}

function linesMatch(a: NormalizedLine, b: NormalizedLine): boolean {
  return (
    a.accountId === b.accountId &&
    a.side === b.side &&
    a.amountCents === b.amountCents
  );
}

export function suggestCorrection(
  entry: JournalEntryLike,
  expectedEntry: JournalEntryLike,
  accountNames: AccountNameLookup = DEFAULT_ACCOUNT_NAMES,
): CorrectionSuggestion {
  const differences: CorrectionDifference[] = [];
  const steps: string[] = [];

  const actual = normalizeLines(entry.lines);
  const expected = normalizeLines(expectedEntry.lines);
  const actualDebits = calculateDebits(entry);
  const actualCredits = calculateCredits(entry);
  const expectedDebits = calculateDebits(expectedEntry);
  const expectedCredits = calculateCredits(expectedEntry);

  if (entry.lines.length < 2) {
    differences.push({
      kind: "line_count",
      message:
        `You have ${entry.lines.length} line(s), but this transaction needs at least two. ` +
        `Add the missing side of the exchange.`,
    });
  }

  if (actualDebits !== actualCredits) {
    const diff = Math.abs(actualDebits - actualCredits);
    differences.push({
      kind: "unbalanced",
      message:
        `Your debits (${formatCentsForMessage(actualDebits)}) and credits (${formatCentsForMessage(actualCredits)}) ` +
        `differ by ${formatCentsForMessage(diff)}. Adjust amounts until both totals match.`,
    });
  }

  const matchedExpected = new Set<number>();
  const matchedActual = new Set<number>();

  for (let ei = 0; ei < expected.length; ei++) {
    const exp = expected[ei];
    const matchIdx = actual.findIndex(
      (act, ai) => !matchedActual.has(ai) && linesMatch(act, exp),
    );
    if (matchIdx >= 0) {
      matchedExpected.add(ei);
      matchedActual.add(matchIdx);
    }
  }

  for (let ei = 0; ei < expected.length; ei++) {
    if (matchedExpected.has(ei)) continue;
    const exp = expected[ei];
    const name = accountLabel(exp.accountId, accountNames);

    const partialIdx = actual.findIndex(
      (act, ai) =>
        !matchedActual.has(ai) &&
        act.accountId === exp.accountId &&
        act.side === exp.side,
    );

    if (partialIdx >= 0) {
      const act = actual[partialIdx];
      matchedActual.add(partialIdx);
      differences.push({
        kind: "wrong_amount",
        lineIndex: partialIdx,
        message:
          `${name} is on the correct ${exp.side} side, but the amount should be ` +
          `${formatCentsForMessage(exp.amountCents)}, not ${formatCentsForMessage(act.amountCents)}. ` +
          `Change the amount by ${formatCentsForMessage(Math.abs(exp.amountCents - act.amountCents))}.`,
      });
      continue;
    }

    const wrongSideIdx = actual.findIndex(
      (act, ai) =>
        !matchedActual.has(ai) &&
        act.accountId === exp.accountId &&
        act.side !== exp.side,
    );

    if (wrongSideIdx >= 0) {
      matchedActual.add(wrongSideIdx);
      differences.push({
        kind: "wrong_side",
        lineIndex: wrongSideIdx,
        message:
          `${name} should be a ${exp.side} of ${formatCentsForMessage(exp.amountCents)}, ` +
          `but you placed it on the ${actual[wrongSideIdx].side} side. Swap to the ${exp.side} column.`,
      });
      continue;
    }

    differences.push({
      kind: "missing_line",
      message:
        `Add a ${exp.side} to ${name} for ${formatCentsForMessage(exp.amountCents)}. ` +
        `This line is part of the correct double-entry for this transaction.`,
    });
  }

  for (let ai = 0; ai < actual.length; ai++) {
    if (matchedActual.has(ai)) continue;
    const act = actual[ai];
    const name = accountLabel(act.accountId, accountNames);
    differences.push({
      kind: "extra_line",
      lineIndex: ai,
      message:
        `Remove or replace the ${act.side} to ${name} (${formatCentsForMessage(act.amountCents)}). ` +
        `It does not belong in the correct entry for this transaction.`,
    });
  }

  if (differences.length === 0) {
    return {
      summary: "Your entry matches the expected journal entry. Well done!",
      steps: ["Post this entry to the ledger — it is balanced and complete."],
      differences: [],
    };
  }

  if (actualDebits !== expectedDebits || actualCredits !== expectedCredits) {
    steps.push(
      `Aim for total debits of ${formatCentsForMessage(expectedDebits)} and total credits of ` +
        `${formatCentsForMessage(expectedCredits)}.`,
    );
  }

  for (const diff of differences) {
    if (diff.kind === "missing_line") {
      steps.push(diff.message);
    }
    if (diff.kind === "wrong_amount" || diff.kind === "wrong_side") {
      steps.push(diff.message);
    }
    if (diff.kind === "extra_line") {
      steps.push(diff.message);
    }
    if (diff.kind === "unbalanced") {
      steps.push(diff.message);
    }
  }

  steps.push("Recheck that debits equal credits before submitting again.");

  const summary =
    differences.length === 1
      ? differences[0].message
      : `Your entry needs ${differences.length} adjustment(s) to match the correct recording for this transaction.`;

  return { summary, steps, differences };
}

// ---------------------------------------------------------------------------
// Teaching examples (June 2024 — Bright Path Consulting)
// ---------------------------------------------------------------------------

function entry(
  id: string,
  description: string,
  lines: JournalLine[],
  date = "2024-06-01",
): JournalEntry {
  return {
    id,
    date,
    description,
    lines: lines as [JournalLine, JournalLine, ...JournalLine[]],
  };
}

/** Reference journal entries illustrating common June 2024 transactions. */
export const JOURNAL_ENTRY_EXAMPLES = {
  /** Debit Supplies, Credit Bank/Cash — cash leaves, supplies received. */
  buyingSuppliesWithCash: entry("ex-supplies-cash", "Office supplies paid with cash from bank", [
    { accountId: "supplies", debitCents: 8_000 },
    { accountId: "bank-cash", creditCents: 8_000 },
  ]),

  /** Debit Telephone Expense, Credit Credit Card Payable — no bank movement yet. */
  payingTelephoneByCreditCard: entry(
    "ex-telephone-cc",
    "Monthly business phone bill on Visa",
    [
      { accountId: "telephone-expense", debitCents: 9_500 },
      { accountId: "credit-card-payable", creditCents: 9_500 },
    ],
    "2024-06-10",
  ),

  /** Debit Bank, Credit Consulting Income + GST Payable — client payment with tax split. */
  receivingConsultingIncomeByDeposit: entry(
    "ex-consulting-deposit",
    "Client consulting payment deposited to bank (including GST)",
    [
      { accountId: "bank-cash", debitCents: 420_000 },
      { accountId: "consulting-income", creditCents: 400_000 },
      { accountId: "gst-hst-payable", creditCents: 20_000 },
    ],
    "2024-06-05",
  ),

  /** Debit Equipment, Credit Bank/Cash — capitalize a long-term asset. */
  buyingEquipment: entry("ex-equipment", "Laptop purchased for consulting work", [
    { accountId: "equipment", debitCents: 240_000 },
    { accountId: "bank-cash", creditCents: 240_000 },
  ], "2024-06-15"),

  /** Debit Accounts Receivable, Credit Income + GST — invoice sent, tax separated. */
  recordingSalesTaxPayable: entry(
    "ex-gst-on-invoice",
    "Consulting invoice issued with GST separated from revenue",
    [
      { accountId: "accounts-receivable", debitCents: 210_000 },
      { accountId: "consulting-income", creditCents: 200_000 },
      { accountId: "gst-hst-payable", creditCents: 10_000 },
    ],
    "2024-06-22",
  ),

  /** Debit Credit Card Payable, Credit Bank — paying down a liability. */
  payingALiability: entry(
    "ex-pay-credit-card",
    "Paying the business credit card bill from bank",
    [
      { accountId: "credit-card-payable", debitCents: 50_000 },
      { accountId: "bank-cash", creditCents: 50_000 },
    ],
    "2024-06-30",
  ),
} as const;
