import type { ChallengeAttempt } from "@/lib/game/types";

/** Compute mastery % from first-try attempts for a set of challenges. */
export function calculateMasteryPercent(
  attempts: ChallengeAttempt[],
  challengeIds: string[],
): number {
  if (challengeIds.length === 0) return 0;

  const firstTries = challengeIds.map((challengeId) =>
    attempts.find((a) => a.challengeId === challengeId && a.firstTry),
  );

  const scored = firstTries.filter((a): a is ChallengeAttempt => a !== undefined);
  if (scored.length === 0) return 0;

  const total = scored.reduce((sum, a) => sum + a.scorePercent, 0);
  return Math.round(total / challengeIds.length);
}

export function calculateOverallMastery(
  moduleMasteries: { masteryPercent: number; unlocked: boolean }[],
): number {
  const active = moduleMasteries.filter((m) => m.unlocked);
  if (active.length === 0) return 0;
  const total = active.reduce((sum, m) => sum + m.masteryPercent, 0);
  return Math.round(total / active.length);
}

export function countCompletedChallenges(
  attempts: ChallengeAttempt[],
  challengeIds: string[],
  passThreshold = 80,
): number {
  return challengeIds.filter((challengeId) => {
    const first = attempts.find(
      (a) => a.challengeId === challengeId && a.firstTry,
    );
    return first !== undefined && first.scorePercent >= passThreshold;
  }).length;
}

export function getModuleMasterySummary(
  attempts: ChallengeAttempt[],
  keyChallengeIds: string[],
): {
  masteryPercent: number;
  challengesCompleted: number;
  challengesTotal: number;
} {
  return {
    masteryPercent: calculateMasteryPercent(attempts, keyChallengeIds),
    challengesCompleted: countCompletedChallenges(attempts, keyChallengeIds),
    challengesTotal: keyChallengeIds.length,
  };
}
