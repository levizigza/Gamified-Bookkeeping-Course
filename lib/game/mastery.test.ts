import { describe, expect, it } from "vitest";
import {
  calculateMasteryPercent,
  calculateOverallMastery,
  countCompletedChallenges,
  getModuleMasterySummary,
} from "@/lib/game/mastery";
import { makeAttempt } from "@/tests/helpers/fixtures";

describe("mastery scoring", () => {
  it("averages first-try scores across key challenges", () => {
    const attempts = [
      makeAttempt({
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 90,
      }),
      makeAttempt({
        challengeId: "challenge-double-entry-duel",
        moduleId: "daily-ledger",
        scorePercent: 70,
      }),
    ];

    expect(
      calculateMasteryPercent(attempts, [
        "challenge-classify-transaction",
        "challenge-double-entry-duel",
      ]),
    ).toBe(80);
  });

  it("ignores retry attempts when calculating mastery", () => {
    const attempts = [
      makeAttempt({
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 40,
        firstTry: true,
      }),
      makeAttempt({
        id: "retry",
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 95,
        firstTry: false,
        attemptNumber: 2,
      }),
    ];

    expect(
      calculateMasteryPercent(attempts, ["challenge-classify-transaction"]),
    ).toBe(40);
  });

  it("returns zero when no first-try attempts exist", () => {
    expect(calculateMasteryPercent([], ["challenge-sort-accounts"])).toBe(0);
  });

  it("counts challenges completed at or above the pass threshold", () => {
    const attempts = [
      makeAttempt({
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 80,
      }),
      makeAttempt({
        challengeId: "challenge-double-entry-duel",
        moduleId: "daily-ledger",
        scorePercent: 79,
      }),
    ];

    expect(
      countCompletedChallenges(attempts, [
        "challenge-classify-transaction",
        "challenge-double-entry-duel",
      ]),
    ).toBe(1);
  });

  it("summarizes module mastery for the dashboard", () => {
    const attempts = [
      makeAttempt({
        challengeId: "challenge-sort-accounts",
        moduleId: "account-sorter",
        scorePercent: 85,
      }),
    ];

    const summary = getModuleMasterySummary(attempts, ["challenge-sort-accounts"]);
    expect(summary.masteryPercent).toBe(85);
    expect(summary.challengesCompleted).toBe(1);
    expect(summary.challengesTotal).toBe(1);
  });

  it("averages mastery across unlocked modules only", () => {
    const overall = calculateOverallMastery([
      { masteryPercent: 80, unlocked: true },
      { masteryPercent: 60, unlocked: true },
      { masteryPercent: 0, unlocked: false },
    ]);
    expect(overall).toBe(70);
  });
});
