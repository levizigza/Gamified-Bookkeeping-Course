import type { SortCategory } from "@/lib/data/week2Challenges";
import {
  ACCOUNT_SORTER_CHALLENGE_ID,
  REPORTS_ROOM_MASTERY_THRESHOLD,
} from "@/lib/data/week2Challenges";

export type SortAttempt = {
  itemId: string;
  selectedCategory: SortCategory;
  correct: boolean;
  firstTry: boolean;
};

export type SortSessionResult = {
  correctCount: number;
  totalCount: number;
  masteryPercent: number;
  baseXp: number;
  streakBonusXp: number;
  totalXp: number;
  longestStreak: number;
  reportsRoomUnlocked: boolean;
};

export function calculateMasteryFromCounts(
  correctOnFirstTry: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((correctOnFirstTry / total) * 100);
}

/** @deprecated Use calculateMasteryFromCounts */
export const calculateMasteryPercent = calculateMasteryFromCounts;

export function isReportsRoomUnlockedByMastery(masteryPercent: number): boolean {
  return masteryPercent >= REPORTS_ROOM_MASTERY_THRESHOLD;
}

/** Streak bonus: +bonusXp for each correct answer at or above streakStartsAt consecutive. */
export function calculateStreakBonus(
  longestStreak: number,
  streakStartsAt: number,
  bonusXpPerStep: number,
): number {
  if (longestStreak < streakStartsAt) return 0;
  const bonusSteps = longestStreak - streakStartsAt + 1;
  return bonusSteps * bonusXpPerStep;
}

/** Track running streak and return updated longest streak. */
export function updateStreak(
  wasCorrect: boolean,
  currentStreak: number,
  longestStreak: number,
): { currentStreak: number; longestStreak: number; earnedStreakBonus: number } {
  if (wasCorrect) {
    const next = currentStreak + 1;
    return {
      currentStreak: next,
      longestStreak: Math.max(longestStreak, next),
      earnedStreakBonus: 0,
    };
  }
  return { currentStreak: 0, longestStreak, earnedStreakBonus: 0 };
}

export function gradeSortAnswer(
  selected: SortCategory,
  correct: SortCategory,
): boolean {
  return selected === correct;
}

export function buildSortSessionResult(
  attempts: SortAttempt[],
  baseXpPerCorrect: number,
  streakStartsAt: number,
  streakBonusXp: number,
  longestStreak: number,
): SortSessionResult {
  const totalCount = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const firstTryCorrect = attempts.filter((a) => a.firstTry && a.correct).length;
  const masteryPercent = calculateMasteryFromCounts(firstTryCorrect, totalCount);
  const baseXp = correctCount * baseXpPerCorrect;
  const streakBonus = calculateStreakBonus(
    longestStreak,
    streakStartsAt,
    streakBonusXp,
  );

  return {
    correctCount,
    totalCount,
    masteryPercent,
    baseXp,
    streakBonusXp: streakBonus,
    totalXp: baseXp + streakBonus,
    longestStreak,
    reportsRoomUnlocked: isReportsRoomUnlockedByMastery(masteryPercent),
  };
}

export { ACCOUNT_SORTER_CHALLENGE_ID, REPORTS_ROOM_MASTERY_THRESHOLD };
