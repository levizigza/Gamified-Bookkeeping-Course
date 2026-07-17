import { describe, expect, it } from "vitest";
import {
  calculateXpAward,
  levelFromXp,
  sumXpFromAttempts,
  xpProgressInLevel,
} from "@/lib/game/xp";
import { makeAttempt } from "@/tests/helpers/fixtures";

describe("XP scoring", () => {
  it("awards full XP on a correct first try", () => {
    const result = calculateXpAward({
      baseXp: 100,
      correct: true,
      attemptNumber: 1,
      currentAnswerStreak: 1,
    });
    expect(result.xpEarned).toBe(100);
    expect(result.appliedMultiplier).toBe(1);
    expect(result.isFirstTry).toBe(true);
  });

  it("awards half XP on a correct retry", () => {
    const result = calculateXpAward({
      baseXp: 100,
      correct: true,
      attemptNumber: 2,
      currentAnswerStreak: 0,
    });
    expect(result.xpEarned).toBe(50);
    expect(result.appliedMultiplier).toBe(0.5);
  });

  it("awards zero XP when the answer is incorrect", () => {
    const result = calculateXpAward({
      baseXp: 100,
      correct: false,
      attemptNumber: 1,
      currentAnswerStreak: 0,
    });
    expect(result.xpEarned).toBe(0);
    expect(result.streakBonus).toBe(0);
  });

  it("adds a streak bonus after three consecutive correct answers", () => {
    const result = calculateXpAward({
      baseXp: 100,
      correct: true,
      attemptNumber: 1,
      currentAnswerStreak: 3,
    });
    expect(result.streakBonus).toBe(5);
    expect(result.xpEarned).toBe(105);
  });

  it("maps total XP to levels on a linear curve", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(499)).toBe(1);
    expect(levelFromXp(500)).toBe(2);
    expect(levelFromXp(999)).toBe(2);
    expect(levelFromXp(1000)).toBe(3);
  });

  it("reports progress within the current level", () => {
    const progress = xpProgressInLevel(350);
    expect(progress.level).toBe(1);
    expect(progress.current).toBe(350);
    expect(progress.max).toBe(500);
    expect(progress.percent).toBe(70);
  });

  it("sums XP from challenge attempts", () => {
    const total = sumXpFromAttempts([
      makeAttempt({
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 90,
        xpEarned: 60,
      }),
      makeAttempt({
        challengeId: "challenge-double-entry-duel",
        moduleId: "daily-ledger",
        scorePercent: 45,
        xpEarned: 0,
      }),
    ]);
    expect(total).toBe(60);
  });
});
