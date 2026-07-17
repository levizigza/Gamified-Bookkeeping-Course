/**
 * Shared fixtures for accounting and game logic tests.
 */

import type { JournalLine } from "@/lib/types/accounting";
import type { ChallengeAttempt, ModuleId } from "@/lib/game/types";

export function balancedEntry(
  debitAccountId: string,
  debitCents: number,
  creditAccountId: string,
  creditCents: number,
  description = "Fixture entry",
) {
  return {
    description,
    lines: [
      { accountId: debitAccountId, debitCents },
      { accountId: creditAccountId, creditCents },
    ] as JournalLine[],
  };
}

export function unbalancedEntry(
  debitCents: number,
  creditCents: number,
) {
  return balancedEntry("supplies", debitCents, "bank-cash", creditCents);
}

export function makeAttempt(
  overrides: Partial<ChallengeAttempt> & {
    challengeId: string;
    moduleId: ModuleId;
    scorePercent: number;
  },
): ChallengeAttempt {
  return {
    id: overrides.id ?? `att-${overrides.challengeId}`,
    attemptNumber: overrides.attemptNumber ?? 1,
    correct: overrides.correct ?? overrides.scorePercent >= 80,
    firstTry: overrides.firstTry ?? true,
    xpEarned: overrides.xpEarned ?? 100,
    timestamp: overrides.timestamp ?? "2024-06-01T12:00:00.000Z",
    weakTags: overrides.weakTags ?? [],
    ...overrides,
  };
}

/** First-try scores that unlock the next module at 80% threshold. */
export function masteryAttemptsForModule(
  moduleId: ModuleId,
  scorePercent: number,
): ChallengeAttempt[] {
  const byModule: Record<ModuleId, string[]> = {
    "daily-ledger": [
      "challenge-classify-transaction",
      "challenge-double-entry-duel",
    ],
    "account-sorter": ["challenge-sort-accounts"],
    "reports-room": ["challenge-insight-detective"],
    "year-end-boss": ["challenge-year-end-boss"],
  };

  return byModule[moduleId].map((challengeId, index) =>
    makeAttempt({
      id: `${moduleId}-${index}`,
      challengeId,
      moduleId,
      scorePercent,
    }),
  );
}
