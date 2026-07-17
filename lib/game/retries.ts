import type { ChallengeAttempt } from "@/lib/game/types";

export type RetrySummary = {
  challengeId: string;
  totalAttempts: number;
  firstTryCorrect: boolean;
  retriesBeforeSuccess: number;
  neverSucceeded: boolean;
};

export function countAttemptsForChallenge(
  attempts: ChallengeAttempt[],
  challengeId: string,
): number {
  return attempts.filter((a) => a.challengeId === challengeId).length;
}

export function getRetrySummary(
  attempts: ChallengeAttempt[],
  challengeId: string,
): RetrySummary {
  const challengeAttempts = attempts
    .filter((a) => a.challengeId === challengeId)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);

  const firstTry = challengeAttempts.find((a) => a.firstTry);
  const firstSuccess = challengeAttempts.find((a) => a.correct);
  const firstTryCorrect = firstTry?.correct ?? false;

  let retriesBeforeSuccess = 0;
  if (firstSuccess && !firstTryCorrect) {
    retriesBeforeSuccess = firstSuccess.attemptNumber - 1;
  }

  return {
    challengeId,
    totalAttempts: challengeAttempts.length,
    firstTryCorrect,
    retriesBeforeSuccess,
    neverSucceeded: challengeAttempts.length > 0 && !challengeAttempts.some((a) => a.correct),
  };
}

export function getChallengesNeedingRetry(
  attempts: ChallengeAttempt[],
  challengeIds: string[],
): string[] {
  return challengeIds.filter((id) => {
    const summary = getRetrySummary(attempts, id);
    return summary.neverSucceeded || (!summary.firstTryCorrect && summary.totalAttempts > 0);
  });
}

export function getNextAttemptNumber(
  attempts: ChallengeAttempt[],
  challengeId: string,
): number {
  const existing = countAttemptsForChallenge(attempts, challengeId);
  return existing + 1;
}
