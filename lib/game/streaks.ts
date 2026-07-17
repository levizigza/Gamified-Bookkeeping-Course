import { STREAK_BONUS_STARTS_AT } from "@/lib/game/constants";

export type AnswerStreakUpdate = {
  currentStreak: number;
  longestStreak: number;
  earnedStreakBonus: boolean;
};

/** Track consecutive correct answers within a challenge session. */
export function updateAnswerStreak(
  wasCorrect: boolean,
  currentStreak: number,
  longestStreak: number,
): AnswerStreakUpdate {
  if (wasCorrect) {
    const next = currentStreak + 1;
    return {
      currentStreak: next,
      longestStreak: Math.max(longestStreak, next),
      earnedStreakBonus: next >= STREAK_BONUS_STARTS_AT,
    };
  }
  return {
    currentStreak: 0,
    longestStreak,
    earnedStreakBonus: false,
  };
}

export type DailyStreakInput = {
  lastActiveDate: string | null;
  currentStreakDays: number;
  today: string;
};

/**
 * Update daily practice streak (YYYY-MM-DD dates).
 * Opening the app on consecutive calendar days extends the streak.
 */
export function updateDailyStreak(input: DailyStreakInput): number {
  const { lastActiveDate, currentStreakDays, today } = input;
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreakDays;

  const last = new Date(`${lastActiveDate}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 1) return currentStreakDays + 1;
  if (diffDays > 1) return 1;
  return currentStreakDays;
}

export function isStreakMilestone(streakDays: number): boolean {
  return streakDays === 3 || streakDays === 7 || streakDays === 14 || streakDays === 30;
}
