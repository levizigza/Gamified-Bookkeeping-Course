import type { LegacyUserProgressSnapshot, World } from "@/lib/types";
import type { UserProgress } from "@/lib/game/types";
import { getMockGamificationProgress } from "@/lib/game/mockProgress";

/** Map gamified progress to the legacy snapshot shape used by older components. */
export function toLegacyProgressSnapshot(
  progress: UserProgress,
  worlds: World[],
): LegacyUserProgressSnapshot {
  const mergedWorlds = worlds.map((world) => {
    const mod = progress.modules.find((m) => m.moduleId === world.id);
    return {
      ...world,
      unlocked: mod?.unlocked ?? world.unlocked,
      progressPercent: mod?.masteryPercent ?? world.progressPercent,
    };
  });

  return {
    businessName: progress.businessName,
    xp: progress.totalXp,
    level: progress.level,
    streakDays: progress.streakDays,
    masteryPercent: progress.masteryPercent,
    badges: progress.badges,
    worlds: mergedWorlds,
    nextChallengeId: progress.nextChallengeId ?? "challenge-classify-transaction",
  };
}

export function getDefaultUserProgress(): UserProgress {
  return getMockGamificationProgress();
}
