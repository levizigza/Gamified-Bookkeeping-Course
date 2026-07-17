import {
  CHALLENGE_RECOMMENDATION_ORDER,
  IMPLEMENTED_CHALLENGE_IDS,
  MODULE_KEY_CHALLENGES,
  MODULE_ORDER,
  MODULE_TITLES,
} from "@/lib/game/constants";
import { evaluateBadgeUnlocks, mergeBadgesWithEarnedState } from "@/lib/game/badges";
import { calculateOverallMastery, getModuleMasterySummary } from "@/lib/game/mastery";
import { evaluateModuleUnlocks } from "@/lib/game/unlocks";
import { detectWeakAreas } from "@/lib/game/weakAreas";
import { sumXpFromAttempts, xpProgressInLevel } from "@/lib/game/xp";
import type {
  AchievementEvent,
  ChallengeAttempt,
  ModuleProgress,
  UserProgress,
} from "@/lib/game/types";

export type BuildUserProgressInput = {
  businessName: string;
  attempts: ChallengeAttempt[];
  streakDays: number;
  bestAnswerStreak: number;
  earnedBadgeIds?: string[];
  earnedBadgeDates?: Record<string, string>;
  yearEndScenarioBadges?: string[];
  challengeTitles?: Record<string, string>;
  recentAchievements?: AchievementEvent[];
  /** Bonus XP from non-challenge sources (e.g. lesson completion). */
  bonusXp?: number;
};

export function recommendNextChallengeId(
  attempts: ChallengeAttempt[],
  unlocks: { moduleId: string; unlocked: boolean }[],
): string | null {
  const passed = new Set(
    attempts
      .filter((a) => a.firstTry && a.scorePercent >= 80)
      .map((a) => a.challengeId),
  );

  const unlockedModules = new Set(
    unlocks.filter((u) => u.unlocked).map((u) => u.moduleId),
  );

  for (const challengeId of CHALLENGE_RECOMMENDATION_ORDER) {
    if (passed.has(challengeId)) continue;
    if (!IMPLEMENTED_CHALLENGE_IDS.includes(challengeId)) continue;

    const moduleEntry = MODULE_ORDER.find(({ moduleId }) =>
      MODULE_KEY_CHALLENGES[moduleId].includes(challengeId),
    );

    if (moduleEntry && !unlockedModules.has(moduleEntry.moduleId)) {
      continue;
    }

    return challengeId;
  }

  return (
    IMPLEMENTED_CHALLENGE_IDS.find((id) => !passed.has(id)) ??
    CHALLENGE_RECOMMENDATION_ORDER.find((id) => !passed.has(id)) ??
    null
  );
}

export function buildUserProgress(input: BuildUserProgressInput): UserProgress {
  const {
    businessName,
    attempts,
    streakDays,
    bestAnswerStreak,
    earnedBadgeIds = [],
    earnedBadgeDates = {},
    yearEndScenarioBadges = [],
    challengeTitles = {},
    recentAchievements = [],
    bonusXp = 0,
  } = input;

  const unlocks = evaluateModuleUnlocks(attempts);
  const earnedIds = evaluateBadgeUnlocks({
    attempts,
    streakDays,
    earnedBadgeIds,
    yearEndScenarioBadges,
  });
  const badges = mergeBadgesWithEarnedState(earnedIds, earnedBadgeDates);

  const modules: ModuleProgress[] = MODULE_ORDER.map(({ moduleId, week }) => {
    const unlock = unlocks.find((u) => u.moduleId === moduleId)!;
    const keyChallenges = MODULE_KEY_CHALLENGES[moduleId];
    const summary = getModuleMasterySummary(attempts, keyChallenges);
    const moduleXp = attempts
      .filter((a) => a.moduleId === moduleId)
      .reduce((sum, a) => sum + a.xpEarned, 0);

    return {
      moduleId,
      week,
      title: MODULE_TITLES[moduleId],
      unlocked: unlock.unlocked,
      masteryPercent: summary.masteryPercent,
      challengesCompleted: summary.challengesCompleted,
      challengesTotal: summary.challengesTotal,
      xpEarned: moduleXp,
      lockMessage: unlock.lockMessage,
    };
  });

  const challengeXp = sumXpFromAttempts(attempts);
  const totalXp = challengeXp + bonusXp;
  const levelInfo = xpProgressInLevel(totalXp);
  const masteryPercent = calculateOverallMastery(modules);
  const nextChallengeId = recommendNextChallengeId(attempts, unlocks);

  return {
    businessName,
    totalXp,
    level: levelInfo.level,
    xpInCurrentLevel: levelInfo.current,
    xpToNextLevel: levelInfo.max,
    levelProgressPercent: levelInfo.percent,
    streakDays,
    bestAnswerStreak,
    masteryPercent,
    modules,
    badges,
    earnedBadgeCount: badges.filter((b) => b.earned).length,
    attempts,
    weakAreas: detectWeakAreas(attempts),
    nextChallengeId,
    nextChallengeTitle: nextChallengeId
      ? challengeTitles[nextChallengeId] ?? nextChallengeId
      : null,
    recentAchievements,
  };
}

/** Record a challenge attempt and return updated progress. */
export function recordChallengeAttempt(
  current: BuildUserProgressInput,
  attempt: ChallengeAttempt,
): UserProgress {
  return buildUserProgress({
    ...current,
    attempts: [...current.attempts, attempt],
  });
}
