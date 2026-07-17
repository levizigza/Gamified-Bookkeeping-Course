import type { JournalLine } from "@/lib/types/accounting";
import type { JournalScenario } from "@/lib/data/week1JournalChallenges";
import {
  calculateCredits,
  calculateDebits,
  explainJournalEntry,
  formatCentsForMessage,
  isBalanced,
} from "@/lib/accounting/journalValidation";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";

/** A line the user built in the journal entry UI. */
export type BuilderJournalLine = {
  id: string;
  accountId: string;
  side: "debit" | "credit";
  amountCents: number;
};

export const XP_WEIGHTS = {
  balanced: 10,
  accounts: 15,
  direction: 15,
  salesTax: 10,
} as const;

export type JournalXpBreakdown = {
  balanced: number;
  accounts: number;
  direction: number;
  salesTax: number;
  total: number;
  max: number;
};

export type JournalGradeFeedback = {
  headline: string;
  ownerExplanation: string;
  whatYouDidWell: string[];
  whatToImprove: string[];
  correctEntrySummary: string;
  xpBreakdown: JournalXpBreakdown;
  isPerfect: boolean;
};

export type JournalGradeResult = JournalGradeFeedback & {
  balanced: boolean;
};

const ACCOUNT_NAME_LOOKUP = Object.fromEntries(
  chartOfAccounts.map((a) => [a.id, a.name]),
);

const GST_ACCOUNT_ID = "gst-hst-payable";

export function builderLinesToJournalLines(
  lines: BuilderJournalLine[],
): JournalLine[] {
  return lines
    .filter((l) => l.accountId && l.amountCents > 0)
    .map((l) =>
      l.side === "debit"
        ? { accountId: l.accountId, debitCents: l.amountCents }
        : { accountId: l.accountId, creditCents: l.amountCents },
    );
}

function accountName(id: string): string {
  return ACCOUNT_NAME_LOOKUP[id] ?? id;
}

function expectedSide(line: { debitCents: number; creditCents: number }): "debit" | "credit" {
  return line.debitCents > 0 ? "debit" : "credit";
}

function expectedAmount(line: { debitCents: number; creditCents: number }): number {
  return line.debitCents > 0 ? line.debitCents : line.creditCents;
}

function findUserLineForExpected(
  userLines: BuilderJournalLine[],
  expected: JournalScenario["expectedLines"][number],
): BuilderJournalLine | undefined {
  const side = expectedSide(expected);
  return userLines.find(
    (u) =>
      u.accountId === expected.accountId &&
      u.side === side &&
      u.amountCents > 0,
  );
}

function scoreBalanced(userJournalLines: JournalLine[]): number {
  if (userJournalLines.length < 2) return 0;
  return isBalanced({ lines: userJournalLines }) ? XP_WEIGHTS.balanced : 0;
}

function scoreAccounts(
  userLines: BuilderJournalLine[],
  scenario: JournalScenario,
): number {
  const expectedIds = scenario.expectedLines.map((l) => l.accountId);
  const userIds = new Set(
    userLines.filter((l) => l.accountId && l.amountCents > 0).map((l) => l.accountId),
  );
  const matched = expectedIds.filter((id) => userIds.has(id)).length;
  const ratio = expectedIds.length > 0 ? matched / expectedIds.length : 0;
  return Math.round(ratio * XP_WEIGHTS.accounts);
}

function scoreDirection(
  userLines: BuilderJournalLine[],
  scenario: JournalScenario,
): number {
  let matched = 0;
  for (const expected of scenario.expectedLines) {
    const user = findUserLineForExpected(userLines, expected);
    if (user && user.amountCents === expectedAmount(expected)) {
      matched++;
    } else if (user) {
      matched += 0.5;
    }
  }
  const ratio =
    scenario.expectedLines.length > 0 ? matched / scenario.expectedLines.length : 0;
  return Math.round(ratio * XP_WEIGHTS.direction);
}

function scoreSalesTax(
  userLines: BuilderJournalLine[],
  scenario: JournalScenario,
): number {
  const userGst = userLines.find(
    (l) => l.accountId === GST_ACCOUNT_ID && l.amountCents > 0,
  );
  const expectedGst = scenario.expectedLines.find((l) => l.accountId === GST_ACCOUNT_ID);

  if (!scenario.salesTaxApplies) {
    if (!userGst) return XP_WEIGHTS.salesTax;
    return Math.round(XP_WEIGHTS.salesTax * 0.25);
  }

  if (!expectedGst) return 0;

  const expectedSideValue = expectedSide(expectedGst);
  const expectedAmt = expectedAmount(expectedGst);

  if (!userGst) return 0;

  if (userGst.side === expectedSideValue && userGst.amountCents === expectedAmt) {
    return XP_WEIGHTS.salesTax;
  }

  if (userGst.side === expectedSideValue) {
    return Math.round(XP_WEIGHTS.salesTax * 0.5);
  }

  return Math.round(XP_WEIGHTS.salesTax * 0.25);
}

function buildWhatYouDidWell(
  breakdown: JournalXpBreakdown,
  balanced: boolean,
): string[] {
  const items: string[] = [];
  if (balanced) {
    items.push("Your debits and credits balance — the foundation of double-entry bookkeeping.");
  }
  if (breakdown.accounts >= XP_WEIGHTS.accounts * 0.75) {
    items.push("You picked most of the right accounts for this transaction.");
  }
  if (breakdown.direction >= XP_WEIGHTS.direction * 0.75) {
    items.push("You placed amounts on the correct debit and credit sides.");
  }
  if (breakdown.salesTax >= XP_WEIGHTS.salesTax * 0.75) {
    items.push("You handled GST appropriately for this scenario.");
  }
  if (items.length === 0) {
    items.push("You submitted a journal entry — building entries gets easier with practice.");
  }
  return items;
}

function buildWhatToImprove(
  userLines: BuilderJournalLine[],
  userJournalLines: JournalLine[],
  scenario: JournalScenario,
  breakdown: JournalXpBreakdown,
  balanced: boolean,
): string[] {
  const items: string[] = [];

  if (!balanced) {
    const debits = calculateDebits({ lines: userJournalLines });
    const credits = calculateCredits({ lines: userJournalLines });
    items.push(
      `Debits (${formatCentsForMessage(debits)}) must equal credits (${formatCentsForMessage(credits)}). Adjust line amounts until they match.`,
    );
  }

  if (breakdown.accounts < XP_WEIGHTS.accounts) {
    const expectedNames = scenario.expectedLines
      .map((l) => accountName(l.accountId))
      .join(", ");
    items.push(`This scenario uses: ${expectedNames}. Review which accounts belong in this entry.`);
  }

  if (breakdown.direction < XP_WEIGHTS.direction) {
    items.push(
      "Check each line: expenses and assets usually debit; liabilities, equity, and income usually credit (with exceptions like paying down a liability).",
    );
  }

  if (breakdown.salesTax < XP_WEIGHTS.salesTax) {
    if (scenario.salesTaxApplies) {
      items.push(
        scenario.salesTaxOnSale
          ? "Separate GST from your revenue — credit GST/HST Payable for the tax portion of the sale."
          : "Split GST from the purchase — debit GST/HST Payable for the input tax credit portion.",
      );
    } else if (userLines.some((l) => l.accountId === GST_ACCOUNT_ID && l.amountCents > 0)) {
      items.push("GST does not apply to this transaction — remove the GST/HST Payable line.");
    }
  }

  return items;
}

/** Grade a user-built journal entry with partial XP credit. */
export function gradeJournalEntry(
  userLines: BuilderJournalLine[],
  scenario: JournalScenario,
): JournalGradeResult {
  const userJournalLines = builderLinesToJournalLines(userLines);
  const balanced =
    userJournalLines.length >= 2 && isBalanced({ lines: userJournalLines });

  const balancedXp = scoreBalanced(userJournalLines);
  const accountsXp = scoreAccounts(userLines, scenario);
  const directionXp = scoreDirection(userLines, scenario);
  const salesTaxXp = scoreSalesTax(userLines, scenario);

  const xpBreakdown: JournalXpBreakdown = {
    balanced: balancedXp,
    accounts: accountsXp,
    direction: directionXp,
    salesTax: salesTaxXp,
    total: balancedXp + accountsXp + directionXp + salesTaxXp,
    max: scenario.maxXp,
  };

  const isPerfect = xpBreakdown.total === scenario.maxXp;

  const expectedJournalLines = scenario.expectedLines.map((line) => {
    if (line.debitCents > 0) {
      return { accountId: line.accountId, debitCents: line.debitCents };
    }
    return { accountId: line.accountId, creditCents: line.creditCents };
  }) as JournalLine[];

  const correctEntrySummary = explainJournalEntry(
    { description: scenario.title, lines: expectedJournalLines },
    ACCOUNT_NAME_LOOKUP,
  );

  const whatYouDidWell = buildWhatYouDidWell(xpBreakdown, balanced);
  const whatToImprove = buildWhatToImprove(
    userLines,
    userJournalLines,
    scenario,
    xpBreakdown,
    balanced,
  );

  let headline: string;
  if (isPerfect) {
    headline = "Perfect entry! You nailed the double-entry for this scenario.";
  } else if (xpBreakdown.total >= scenario.maxXp * 0.7) {
    headline = "Strong work — you are close. A few tweaks and this entry is textbook.";
  } else if (balanced) {
    headline = "Your entry balances — good start. Now refine the accounts and GST.";
  } else {
    headline = "Keep building — focus on balancing debits and credits first.";
  }

  return {
    balanced,
    headline,
    ownerExplanation: scenario.ownerExplanation,
    whatYouDidWell,
    whatToImprove,
    correctEntrySummary,
    xpBreakdown,
    isPerfect,
  };
}

export function createEmptyBuilderLine(): BuilderJournalLine {
  return {
    id: crypto.randomUUID(),
    accountId: "",
    side: "debit",
    amountCents: 0,
  };
}

export function parseDollarsToCents(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const dollars = parseFloat(cleaned);
  if (Number.isNaN(dollars)) return 0;
  return Math.round(dollars * 100);
}

export function formatCentsToDollarsInput(cents: number): string {
  if (cents === 0) return "";
  return (cents / 100).toFixed(2);
}
