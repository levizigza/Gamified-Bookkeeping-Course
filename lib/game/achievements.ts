import type { AchievementEvent, AchievementEventType, Badge } from "@/lib/game/types";

export function createAchievementEvent(
  type: AchievementEventType,
  title: string,
  description: string,
  extras?: Partial<AchievementEvent>,
): AchievementEvent {
  return {
    id: `evt-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    timestamp: new Date().toISOString(),
    title,
    description,
    ...extras,
  };
}

export function achievementForXp(xpEarned: number, challengeTitle: string): AchievementEvent {
  return createAchievementEvent(
    "xp_earned",
    `+${xpEarned} XP`,
    `Earned from ${challengeTitle}.`,
    { xpDelta: xpEarned },
  );
}

export function achievementForLevelUp(newLevel: number): AchievementEvent {
  return createAchievementEvent(
    "level_up",
    `Level ${newLevel}!`,
    "Your bookkeeping skills are leveling up.",
    { metadata: { level: newLevel } },
  );
}

export function achievementForBadge(badge: Badge): AchievementEvent {
  return createAchievementEvent(
    "badge_unlocked",
    `Badge: ${badge.name}`,
    badge.learningOutcome,
    { badgeId: badge.id },
  );
}

export function achievementForModuleUnlock(
  moduleTitle: string,
  moduleId: string,
): AchievementEvent {
  return createAchievementEvent(
    "module_unlocked",
    `${moduleTitle} unlocked`,
    "You collected the key stars and opened the next week.",
    { moduleId: moduleId as AchievementEvent["moduleId"] },
  );
}

export function sortAchievementsNewestFirst(
  events: AchievementEvent[],
): AchievementEvent[] {
  return [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}
