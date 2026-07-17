import {
  RETRY_XP_MULTIPLIER,
  STREAK_BONUS_STARTS_AT,
  STREAK_BONUS_XP,
  XP_PER_LEVEL,
} from "@/lib/game/constants";
import type { XpAwardInput, XpAwardResult } from "@/lib/game/types";

export { XP_PER_LEVEL };

export function levelFromXp(totalXp: number): number {
  if (totalXp < 0) return 1;
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * XP_PER_LEVEL;
}

export function xpProgressInLevel(totalXp: number): {
  level: number;
  current: number;
  max: number;
  percent: number;
} {
  const level = levelFromXp(totalXp);
  const levelStart = xpForLevel(level);
  const current = totalXp - levelStart;
  return {
    level,
    current,
    max: XP_PER_LEVEL,
    percent: Math.round((current / XP_PER_LEVEL) * 100),
  };
}

export function masteryLabel(percent: number): string {
  if (percent >= 90) return "Expert";
  if (percent >= 75) return "Proficient";
  if (percent >= 50) return "Developing";
  return "Getting Started";
}

/**
 * Award XP for a challenge answer.
 * - Incorrect: 0 XP (feedback still shown by caller).
 * - Correct first try: full base XP + optional streak bonus.
 * - Correct after retry: reduced XP (no streak bonus).
 */
export function calculateXpAward(input: XpAwardInput): XpAwardResult {
  const isFirstTry = input.attemptNumber === 1;

  if (!input.correct) {
    return {
      xpEarned: 0,
      streakBonus: 0,
      isFirstTry,
      appliedMultiplier: 0,
    };
  }

  const multiplier = isFirstTry ? 1 : RETRY_XP_MULTIPLIER;
  const baseAward = Math.round(input.baseXp * multiplier);

  let streakBonus = 0;
  if (isFirstTry && input.currentAnswerStreak >= STREAK_BONUS_STARTS_AT) {
    streakBonus = STREAK_BONUS_XP;
  }

  return {
    xpEarned: baseAward + streakBonus,
    streakBonus,
    isFirstTry,
    appliedMultiplier: multiplier,
  };
}

export function sumXpFromAttempts(attempts: { xpEarned: number }[]): number {
  return attempts.reduce((sum, a) => sum + a.xpEarned, 0);
}
