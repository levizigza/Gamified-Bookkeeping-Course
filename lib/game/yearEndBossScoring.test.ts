import { describe, expect, it } from "vitest";
import { getYearEndBossChallenge } from "@/lib/data/week4Challenges";
import {
  buildYearEndBossSessionResult,
  gradeCalculatedAmount,
  gradeYearEndBossSubmission,
  isScenarioBadgeEarned,
  YEAR_END_BOSS_BADGES,
  YEAR_END_BOSS_PASS_THRESHOLD,
  type YearEndScenarioAttempt,
} from "@/lib/game/yearEndBossScoring";
import { createEmptyBuilderLine } from "@/lib/game/journalScoring";

describe("yearEndBossScoring", () => {
  const challenge = getYearEndBossChallenge();

  it("grades a perfect depreciation submission", () => {
    const scenario = challenge.scenarios[0];
    const result = gradeYearEndBossSubmission(
      900_000,
      [
        { id: "1", accountId: "depreciation-expense", side: "debit", amountCents: 900_000 },
        {
          id: "2",
          accountId: "accumulated-amortization-vehicle",
          side: "credit",
          amountCents: 900_000,
        },
      ],
      scenario,
    );
    expect(result.amountCorrect).toBe(true);
    expect(result.balanced).toBe(true);
    expect(result.isPerfect).toBe(true);
    expect(result.scorePercent).toBe(100);
  });

  it("grades home office claim amount and entry", () => {
    const scenario = challenge.scenarios[1];
    expect(gradeCalculatedAmount(358_500, scenario.correctAmountCents)).toBe(true);

    const result = gradeYearEndBossSubmission(
      358_500,
      [
        { id: "1", accountId: "home-office-rent", side: "debit", amountCents: 358_500 },
        { id: "2", accountId: "shareholder-loan", side: "credit", amountCents: 358_500 },
      ],
      scenario,
    );
    expect(result.isPerfect).toBe(true);
  });

  it("grades mileage claim at 15600 dollars", () => {
    const scenario = challenge.scenarios[2];
    const result = gradeYearEndBossSubmission(
      1_560_000,
      [
        {
          id: "1",
          accountId: "vehicle-expense-mileage",
          side: "debit",
          amountCents: 1_560_000,
        },
        { id: "2", accountId: "shareholder-loan", side: "credit", amountCents: 1_560_000 },
      ],
      scenario,
    );
    expect(result.amountCorrect).toBe(true);
    expect(result.isPerfect).toBe(true);
  });

  it("penalizes wrong calculated amount", () => {
    const scenario = challenge.scenarios[0];
    const result = gradeYearEndBossSubmission(
      800_000,
      [
        { id: "1", accountId: "depreciation-expense", side: "debit", amountCents: 900_000 },
        {
          id: "2",
          accountId: "accumulated-amortization-vehicle",
          side: "credit",
          amountCents: 900_000,
        },
      ],
      scenario,
    );
    expect(result.amountCorrect).toBe(false);
    expect(result.xpBreakdown.calculatedAmount).toBe(0);
    expect(result.isPerfect).toBe(false);
  });

  it("penalizes unbalanced entries", () => {
    const scenario = challenge.scenarios[1];
    const result = gradeYearEndBossSubmission(
      358_500,
      [
        { id: "1", accountId: "home-office-rent", side: "debit", amountCents: 358_500 },
        { id: "2", accountId: "shareholder-loan", side: "credit", amountCents: 300_000 },
      ],
      scenario,
    );
    expect(result.balanced).toBe(false);
    expect(result.xpBreakdown.balanced).toBe(0);
  });

  it("awards scenario badges at 80% threshold", () => {
    expect(isScenarioBadgeEarned(80)).toBe(true);
    expect(isScenarioBadgeEarned(79)).toBe(false);
    expect(YEAR_END_BOSS_PASS_THRESHOLD).toBe(80);
  });

  it("builds session result with accountant ready badge", () => {
    const attempts: YearEndScenarioAttempt[] = challenge.scenarios.map((s) => ({
      scenarioId: s.id,
      kind: s.kind,
      firstTry: true,
      amountCorrect: true,
      scorePercent: 100,
      xpEarned: 100,
      perfect: true,
      badgeEarned: true,
      badgeId: s.badgeId,
    }));

    const session = buildYearEndBossSessionResult(attempts);
    expect(session.masteryPercent).toBe(100);
    expect(session.badgesEarned).toContain(YEAR_END_BOSS_BADGES.accountantReady);
    expect(session.checklist.yearEndJournalsPrepared).toBe(true);
    expect(session.checklist.readyForAccountantHandover).toBe(true);
  });

  it("requires at least two lines for submission grading", () => {
    const scenario = challenge.scenarios[0];
    const result = gradeYearEndBossSubmission(900_000, [createEmptyBuilderLine()], scenario);
    expect(result.balanced).toBe(false);
  });
});
