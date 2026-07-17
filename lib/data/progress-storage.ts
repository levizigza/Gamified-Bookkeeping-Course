/**
 * Challenge progress helpers — thin facade over the storage adapter.
 * Keeps existing imports working while centralizing persistence.
 */

import { REPORTS_ROOM_MASTERY_THRESHOLD } from "@/lib/data/week2Challenges";
import {
  LOCAL_USER_ID,
  syncAwardUserBadge,
  syncGetChallengeMetrics,
  syncHasUserBadge,
  syncUpsertChallengeMetrics,
} from "@/lib/storage";

const CHALLENGE_IDS = {
  accountSorter: "challenge-sort-accounts",
  insightDetective: "challenge-insight-detective",
  yearEndBoss: "challenge-year-end-boss",
} as const;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getAccountSorterMastery(): number {
  if (!isClient()) return 0;
  return syncGetChallengeMetrics(CHALLENGE_IDS.accountSorter)?.bestMasteryPercent ?? 0;
}

export function saveAccountSorterMastery(masteryPercent: number): void {
  if (!isClient()) return;

  const existing = getAccountSorterMastery();
  const best = Math.max(existing, masteryPercent);
  const unlocked = best >= REPORTS_ROOM_MASTERY_THRESHOLD;

  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.accountSorter,
    bestMasteryPercent: best,
    unlocked,
  });
}

export function isReportsRoomUnlocked(): boolean {
  if (!isClient()) return false;
  const metrics = syncGetChallengeMetrics(CHALLENGE_IDS.accountSorter);
  if (metrics?.unlocked) return true;
  return (metrics?.bestMasteryPercent ?? 0) >= REPORTS_ROOM_MASTERY_THRESHOLD;
}

export function getAccountSorterBestStreak(): number {
  if (!isClient()) return 0;
  return syncGetChallengeMetrics(CHALLENGE_IDS.accountSorter)?.bestStreak ?? 0;
}

export function saveAccountSorterBestStreak(streak: number): void {
  if (!isClient()) return;
  const best = Math.max(getAccountSorterBestStreak(), streak);
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.accountSorter,
    bestStreak: best,
  });
}

export function getReportsRoomLockMessage(): string {
  return `Score ${REPORTS_ROOM_MASTERY_THRESHOLD}% on Account Sorter to unlock`;
}

export function getInsightDetectiveBestScore(): number {
  if (!isClient()) return 0;
  return syncGetChallengeMetrics(CHALLENGE_IDS.insightDetective)?.bestScorePercent ?? 0;
}

export function saveInsightDetectiveBestScore(scorePercent: number): void {
  if (!isClient()) return;
  const best = Math.max(getInsightDetectiveBestScore(), scorePercent);
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.insightDetective,
    bestScorePercent: best,
  });
}

export function isInsightDetectiveBadgeEarned(): boolean {
  if (!isClient()) return false;
  const metrics = syncGetChallengeMetrics(CHALLENGE_IDS.insightDetective);
  if (metrics?.earnedBadgeIds.includes("insight-detective")) return true;
  return syncHasUserBadge("insight-detective");
}

export function saveInsightDetectiveBadgeEarned(): void {
  if (!isClient()) return;
  syncAwardUserBadge("insight-detective");
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.insightDetective,
    earnedBadgeIds: ["insight-detective"],
  });
}

export function getYearEndBossMastery(): number {
  if (!isClient()) return 0;
  return syncGetChallengeMetrics(CHALLENGE_IDS.yearEndBoss)?.bestMasteryPercent ?? 0;
}

export function saveYearEndBossMastery(masteryPercent: number): void {
  if (!isClient()) return;
  const best = Math.max(getYearEndBossMastery(), masteryPercent);
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.yearEndBoss,
    bestMasteryPercent: best,
  });
}

export function getYearEndBossReadiness(): number {
  if (!isClient()) return 0;
  return syncGetChallengeMetrics(CHALLENGE_IDS.yearEndBoss)?.readinessScore ?? 0;
}

export function saveYearEndBossReadiness(score: number): void {
  if (!isClient()) return;
  const best = Math.max(getYearEndBossReadiness(), score);
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.yearEndBoss,
    readinessScore: best,
  });
}

export function getYearEndBossEarnedBadgeIds(): string[] {
  if (!isClient()) return [];
  return syncGetChallengeMetrics(CHALLENGE_IDS.yearEndBoss)?.earnedBadgeIds ?? [];
}

export function saveYearEndBossBadges(badgeIds: string[]): void {
  if (!isClient()) return;
  const existing = new Set(getYearEndBossEarnedBadgeIds());
  for (const id of badgeIds) existing.add(id);
  syncUpsertChallengeMetrics({
    userId: LOCAL_USER_ID,
    challengeId: CHALLENGE_IDS.yearEndBoss,
    earnedBadgeIds: [...existing],
  });
}

export function isYearEndBossBadgeEarned(badgeId: string): boolean {
  return getYearEndBossEarnedBadgeIds().includes(badgeId);
}
