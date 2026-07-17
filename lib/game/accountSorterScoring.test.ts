import { describe, expect, it } from "vitest";
import {
  buildSortSessionResult,
  calculateMasteryPercent,
  calculateStreakBonus,
  isReportsRoomUnlockedByMastery,
} from "@/lib/game/accountSorterScoring";
import { REPORTS_ROOM_MASTERY_THRESHOLD } from "@/lib/data/week2Challenges";

describe("accountSorterScoring", () => {
  it("calculates mastery from first-try correct answers", () => {
    expect(calculateMasteryPercent(14, 18)).toBe(78);
    expect(calculateMasteryPercent(15, 18)).toBe(83);
  });

  it("unlocks reports room at 80%", () => {
    expect(isReportsRoomUnlockedByMastery(79)).toBe(false);
    expect(isReportsRoomUnlockedByMastery(REPORTS_ROOM_MASTERY_THRESHOLD)).toBe(true);
  });

  it("awards streak bonus after 3 consecutive correct", () => {
    expect(calculateStreakBonus(2, 3, 5)).toBe(0);
    expect(calculateStreakBonus(3, 3, 5)).toBe(5);
    expect(calculateStreakBonus(5, 3, 5)).toBe(15);
  });

  it("builds session result with partial mastery", () => {
    const attempts = Array.from({ length: 18 }, (_, i) => ({
      itemId: `item-${i}`,
      selectedCategory: "current_asset" as const,
      correct: i < 14,
      firstTry: true,
    }));
    const result = buildSortSessionResult(attempts, 10, 3, 5, 4);
    expect(result.masteryPercent).toBe(78);
    expect(result.reportsRoomUnlocked).toBe(false);
    expect(result.correctCount).toBe(14);
  });
});
