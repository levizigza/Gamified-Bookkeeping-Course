import { describe, expect, it } from "vitest";
import { evaluateBadgeUnlocks } from "@/lib/game/badges";
import { getMockGamificationProgress, MOCK_PROGRESS_INPUT } from "@/lib/game/mockProgress";
import { buildUserProgress } from "@/lib/game/progress";
import { getRetrySummary } from "@/lib/game/retries";
import { updateAnswerStreak, updateDailyStreak } from "@/lib/game/streaks";
import { detectWeakAreas } from "@/lib/game/weakAreas";

describe("daily and answer streaks", () => {
  it("extends daily streak on consecutive days", () => {
    expect(
      updateDailyStreak({
        lastActiveDate: "2024-06-03",
        currentStreakDays: 2,
        today: "2024-06-04",
      }),
    ).toBe(3);
  });

  it("resets streak after a gap", () => {
    expect(
      updateDailyStreak({
        lastActiveDate: "2024-06-01",
        currentStreakDays: 5,
        today: "2024-06-04",
      }),
    ).toBe(1);
  });

  it("tracks answer streak within a challenge", () => {
    const update = updateAnswerStreak(true, 2, 2);
    expect(update.currentStreak).toBe(3);
    expect(update.earnedStreakBonus).toBe(true);
  });
});

describe("retries and weak areas", () => {
  it("summarizes retry attempts", () => {
    const summary = getRetrySummary(
      MOCK_PROGRESS_INPUT.attempts,
      "challenge-classify-transaction",
    );
    expect(summary.totalAttempts).toBe(2);
    expect(summary.firstTryCorrect).toBe(true);
  });

  it("detects weak areas from failed attempts", () => {
    const areas = detectWeakAreas(MOCK_PROGRESS_INPUT.attempts);
    expect(areas.length).toBeGreaterThan(0);
    expect(areas[0].missCount).toBeGreaterThan(0);
  });
});

describe("badges and progress assembly", () => {
  it("evaluates learning-outcome badges", () => {
    const ids = evaluateBadgeUnlocks({
      attempts: MOCK_PROGRESS_INPUT.attempts,
      streakDays: 3,
      earnedBadgeIds: [],
    });
    expect(ids).toContain("first-entry");
    expect(ids).toContain("streak-3");
  });

  it("builds mock user progress with dashboard fields", () => {
    const progress = getMockGamificationProgress();
    expect(progress.level).toBeGreaterThanOrEqual(1);
    expect(progress.modules).toHaveLength(4);
    expect(progress.nextChallengeId).toBe("challenge-classify-transaction");
    expect(progress.weakAreas.length).toBeGreaterThan(0);
    expect(progress.earnedBadgeCount).toBeGreaterThanOrEqual(2);
  });

  it("recommends next challenge after mastery completions", () => {
    const progress = buildUserProgress({
      ...MOCK_PROGRESS_INPUT,
      attempts: [
        ...MOCK_PROGRESS_INPUT.attempts,
        {
          id: "att-5",
          challengeId: "challenge-double-entry-duel",
          moduleId: "daily-ledger",
          attemptNumber: 2,
          correct: true,
          firstTry: false,
          scorePercent: 95,
          xpEarned: 200,
          timestamp: "2024-06-05T10:00:00.000Z",
          weakTags: [],
        },
      ],
    });
    expect(progress.nextChallengeId).not.toBe("challenge-why-books");
  });
});
