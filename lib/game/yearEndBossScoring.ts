import type { JournalLine } from "@/lib/types/accounting";
import type { ExpectedJournalLine } from "@/lib/data/week1JournalChallenges";
import {
  calculateCredits,
  calculateDebits,
  explainJournalEntry,
  formatCentsForMessage,
  isBalanced,
} from "@/lib/accounting/journalValidation";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import {
  builderLinesToJournalLines,
  type BuilderJournalLine,
} from "@/lib/game/journalScoring";

export const YEAR_END_BOSS_PASS_THRESHOLD = 80;

export const YEAR_END_BOSS_BADGES = {
  depreciationDefender: "depreciation-defender",
  homeOfficeHero: "home-office-hero",
  mileageMaster: "mileage-master",
  accountantReady: "accountant-ready",
} as const;

export type YearEndScenarioKind = "depreciation" | "home_office" | "mileage";

export type YearEndBossScenario = {
  id: string;
  kind: YearEndScenarioKind;
  title: string;
  narrative: string;
  calculationPrompt: string;
  calculationHint: string;
  inputsSummary: string;
  correctAmountCents: number;
  expectedLines: ExpectedJournalLine[];
  ownerExplanation: string;
  consistencyTip: string;
  badgeId: string;
  badgeName: string;
  maxXp: number;
};

export type YearEndXpBreakdown = {
  calculatedAmount: number;
  balanced: number;
  accounts: number;
  direction: number;
  lineAmounts: number;
  total: number;
  max: number;
};

export type YearEndBossGradeResult = {
  amountCorrect: boolean;
  balanced: boolean;
  scorePercent: number;
  isPerfect: boolean;
  headline: string;
  ownerExplanation: string;
  whatYouDidWell: string[];
  whatToImprove: string[];
  correctEntrySummary: string;
  xpBreakdown: YearEndXpBreakdown;
};

export type YearEndScenarioAttempt = {
  scenarioId: string;
  kind: YearEndScenarioKind;
  firstTry: boolean;
  amountCorrect: boolean;
  scorePercent: number;
  xpEarned: number;
  perfect: boolean;
  badgeEarned: boolean;
  badgeId: string;
};

export type YearEndBossSessionResult = {
  attempts: YearEndScenarioAttempt[];
  totalXp: number;
  masteryPercent: number;
  badgesEarned: string[];
  readinessScore: number;
  checklist: YearEndReadinessChecklist;
};

export type YearEndReadinessChecklist = {
  dailyTransactionsRecorded: boolean;
  trialBalanceReviewed: boolean;
  profitAndLossGenerated: boolean;
  balanceSheetGenerated: boolean;
  yearEndJournalsPrepared: boolean;
  readyForAccountantHandover: boolean;
};

const XP_WEIGHTS = {
  calculatedAmount: 25,
  balanced: 15,
  accounts: 20,
  direction: 20,
  lineAmounts: 20,
} as const;

const ACCOUNT_NAME_LOOKUP = Object.fromEntries(
  chartOfAccounts.map((a) => [a.id, a.name]),
);

function accountName(id: string): string {
  return ACCOUNT_NAME_LOOKUP[id] ?? id;
}

function expectedSide(line: ExpectedJournalLine): "debit" | "credit" {
  return line.debitCents > 0 ? "debit" : "credit";
}

function expectedAmount(line: ExpectedJournalLine): number {
  return line.debitCents > 0 ? line.debitCents : line.creditCents;
}

function findUserLine(
  userLines: BuilderJournalLine[],
  expected: ExpectedJournalLine,
): BuilderJournalLine | undefined {
  const side = expectedSide(expected);
  return userLines.find(
    (u) =>
      u.accountId === expected.accountId &&
      u.side === side &&
      u.amountCents > 0,
  );
}

export function gradeCalculatedAmount(
  userAmountCents: number,
  correctAmountCents: number,
): boolean {
  return userAmountCents === correctAmountCents;
}

function scoreCalculatedAmount(amountCorrect: boolean): number {
  return amountCorrect ? XP_WEIGHTS.calculatedAmount : 0;
}

function scoreBalanced(userJournalLines: JournalLine[]): number {
  if (userJournalLines.length < 2) return 0;
  return isBalanced({ lines: userJournalLines }) ? XP_WEIGHTS.balanced : 0;
}

function scoreAccounts(
  userLines: BuilderJournalLine[],
  scenario: YearEndBossScenario,
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
  scenario: YearEndBossScenario,
): number {
  let matched = 0;
  for (const expected of scenario.expectedLines) {
    const user = findUserLine(userLines, expected);
    if (user) matched += 1;
  }
  const ratio =
    scenario.expectedLines.length > 0 ? matched / scenario.expectedLines.length : 0;
  return Math.round(ratio * XP_WEIGHTS.direction);
}

function scoreLineAmounts(
  userLines: BuilderJournalLine[],
  scenario: YearEndBossScenario,
): number {
  let matched = 0;
  for (const expected of scenario.expectedLines) {
    const user = findUserLine(userLines, expected);
    if (user && user.amountCents === expectedAmount(expected)) {
      matched += 1;
    }
  }
  const ratio =
    scenario.expectedLines.length > 0 ? matched / scenario.expectedLines.length : 0;
  return Math.round(ratio * XP_WEIGHTS.lineAmounts);
}

export function calculateScenarioScorePercent(xpTotal: number, maxXp: number): number {
  if (maxXp === 0) return 0;
  return Math.round((xpTotal / maxXp) * 100);
}

export function gradeYearEndBossSubmission(
  userAmountCents: number,
  userLines: BuilderJournalLine[],
  scenario: YearEndBossScenario,
): YearEndBossGradeResult {
  const userJournalLines = builderLinesToJournalLines(userLines);
  const amountCorrect = gradeCalculatedAmount(
    userAmountCents,
    scenario.correctAmountCents,
  );
  const balanced =
    userJournalLines.length >= 2 && isBalanced({ lines: userJournalLines });

  const calculatedXp = scoreCalculatedAmount(amountCorrect);
  const balancedXp = scoreBalanced(userJournalLines);
  const accountsXp = scoreAccounts(userLines, scenario);
  const directionXp = scoreDirection(userLines, scenario);
  const lineAmountsXp = scoreLineAmounts(userLines, scenario);

  const xpBreakdown: YearEndXpBreakdown = {
    calculatedAmount: calculatedXp,
    balanced: balancedXp,
    accounts: accountsXp,
    direction: directionXp,
    lineAmounts: lineAmountsXp,
    total: calculatedXp + balancedXp + accountsXp + directionXp + lineAmountsXp,
    max: scenario.maxXp,
  };

  const scorePercent = calculateScenarioScorePercent(
    xpBreakdown.total,
    xpBreakdown.max,
  );
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

  const whatYouDidWell: string[] = [];
  if (amountCorrect) {
    whatYouDidWell.push(
      `You calculated ${formatCentsForMessage(scenario.correctAmountCents)} correctly.`,
    );
  }
  if (balanced) {
    whatYouDidWell.push("Your journal entry balances — debits equal credits.");
  }
  if (accountsXp >= XP_WEIGHTS.accounts * 0.75) {
    whatYouDidWell.push("You selected the right accounts for this adjusting entry.");
  }
  if (directionXp >= XP_WEIGHTS.direction * 0.75) {
    whatYouDidWell.push("Expense debits and liability credits are in the right places.");
  }
  if (whatYouDidWell.length === 0) {
    whatYouDidWell.push(
      "You worked through a real year-end adjustment — each attempt builds confidence.",
    );
  }

  const whatToImprove: string[] = [];
  if (!amountCorrect) {
    whatToImprove.push(
      `The correct amount is ${formatCentsForMessage(scenario.correctAmountCents)}. ` +
        `Re-read the scenario inputs and try the calculator if you are stuck.`,
    );
  }
  if (!balanced) {
    const debits = calculateDebits({ lines: userJournalLines });
    const credits = calculateCredits({ lines: userJournalLines });
    whatToImprove.push(
      `Debits (${formatCentsForMessage(debits)}) must equal credits (${formatCentsForMessage(credits)}).`,
    );
  }
  if (accountsXp < XP_WEIGHTS.accounts) {
    whatToImprove.push(
      `This entry uses: ${scenario.expectedLines.map((l) => accountName(l.accountId)).join(" and ")}.`,
    );
  }
  if (directionXp < XP_WEIGHTS.direction) {
    whatToImprove.push(
      "Adjusting entries usually debit an expense and credit a balance sheet account (accumulated amortization or shareholder loan).",
    );
  }
  if (lineAmountsXp < XP_WEIGHTS.lineAmounts) {
    whatToImprove.push(
      "Each journal line should use the amount you calculated — not a rounded guess.",
    );
  }

  let headline: string;
  if (isPerfect) {
    headline = "Perfect adjusting entry! Ready for your year-end package.";
  } else if (scorePercent >= 80) {
    headline = "Strong work — this entry would support a clean handoff.";
  } else if (balanced && amountCorrect) {
    headline = "Good foundation — refine the accounts and line amounts.";
  } else {
    headline = "Keep going — double-check the calculation, then balance the entry.";
  }

  return {
    amountCorrect,
    balanced,
    scorePercent,
    isPerfect,
    headline,
    ownerExplanation: scenario.ownerExplanation,
    whatYouDidWell,
    whatToImprove,
    correctEntrySummary,
    xpBreakdown,
  };
}

export function buildYearEndBossSessionResult(
  attempts: YearEndScenarioAttempt[],
): YearEndBossSessionResult {
  const firstTryAttempts = attempts.filter((a) => a.firstTry);
  const masteryPercent =
    firstTryAttempts.length > 0
      ? Math.round(
          firstTryAttempts.reduce((sum, a) => sum + a.scorePercent, 0) /
            firstTryAttempts.length,
        )
      : 0;

  const badgesEarned = attempts
    .filter((a) => a.badgeEarned)
    .map((a) => a.badgeId);

  if (masteryPercent >= YEAR_END_BOSS_PASS_THRESHOLD && attempts.length >= 3) {
    badgesEarned.push(YEAR_END_BOSS_BADGES.accountantReady);
  }

  const uniqueBadges = [...new Set(badgesEarned)];
  const allAmountsCorrect = attempts.every((a) => a.amountCorrect);
  const readinessScore = Math.round(
    (masteryPercent + (allAmountsCorrect ? 100 : 60)) / 2,
  );

  const checklist: YearEndReadinessChecklist = {
    dailyTransactionsRecorded: true,
    trialBalanceReviewed: true,
    profitAndLossGenerated: true,
    balanceSheetGenerated: true,
    yearEndJournalsPrepared: attempts.length >= 3 && allAmountsCorrect,
    readyForAccountantHandover: masteryPercent >= YEAR_END_BOSS_PASS_THRESHOLD,
  };

  return {
    attempts,
    totalXp: attempts.reduce((sum, a) => sum + a.xpEarned, 0),
    masteryPercent,
    badgesEarned: uniqueBadges,
    readinessScore,
    checklist,
  };
}

export function isScenarioBadgeEarned(scorePercent: number): boolean {
  return scorePercent >= YEAR_END_BOSS_PASS_THRESHOLD;
}
