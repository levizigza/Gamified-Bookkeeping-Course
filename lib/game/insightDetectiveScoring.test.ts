import { describe, expect, it } from "vitest";
import { getInsightDetectiveChallenge } from "@/lib/data/week3Challenges";
import {
  buildInsightSessionResult,
  calculateInsightScorePercent,
  gradeNumericAnswer,
  gradeOptionAnswer,
  isInsightDetectiveBadgeEarned,
  parseNumericDollarsToCents,
} from "@/lib/game/insightDetectiveScoring";

describe("insightDetectiveScoring", () => {
  it("parses dollar amounts into cents", () => {
    expect(parseNumericDollarsToCents("5758")).toBe(575800);
    expect(parseNumericDollarsToCents("$5,758.00")).toBe(575800);
    expect(parseNumericDollarsToCents("95")).toBe(9500);
  });

  it("grades numeric answers against expected cents", () => {
    expect(gradeNumericAnswer("5758", 575800)).toBe(true);
    expect(gradeNumericAnswer("5757", 575800)).toBe(false);
  });

  it("grades option answers", () => {
    expect(gradeOptionAnswer("profit-loss", "profit-loss")).toBe(true);
    expect(gradeOptionAnswer("trial-balance", "profit-loss")).toBe(false);
  });

  it("awards badge at 80% first-try score", () => {
    expect(calculateInsightScorePercent(8, 10)).toBe(80);
    expect(isInsightDetectiveBadgeEarned(80)).toBe(true);
    expect(isInsightDetectiveBadgeEarned(79)).toBe(false);
  });

  it("builds session result from attempts", () => {
    const challenge = getInsightDetectiveChallenge();
    const attempts = challenge.questions.slice(0, 10).map((q) => ({
      questionId: q.id,
      correct: true,
      firstTry: true,
    }));

    const result = buildInsightSessionResult(attempts, 15);
    expect(result.totalCount).toBe(10);
    expect(result.scorePercent).toBe(100);
    expect(result.badgeEarned).toBe(true);
  });
});

describe("insightDetectiveChallenge", () => {
  it("includes at least 10 questions covering all answer types", () => {
    const challenge = getInsightDetectiveChallenge();
    expect(challenge.questions.length).toBeGreaterThanOrEqual(10);

    const types = new Set(challenge.questions.map((q) => q.type));
    expect(types.has("multiple_choice")).toBe(true);
    expect(types.has("numeric")).toBe(true);
    expect(types.has("select_report")).toBe(true);
    expect(types.has("identify_account")).toBe(true);
    expect(types.has("business_decision")).toBe(true);
  });

  it("derives net income numeric answer from June reports", () => {
    const challenge = getInsightDetectiveChallenge();
    const numericQ = challenge.questions.find((q) => q.id === "q-net-income-numeric");
    expect(numericQ?.correctNumericCents).toBe(575800);
  });
});
