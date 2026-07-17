import type { ChallengeAttempt, WeakArea } from "@/lib/game/types";
import {
  REMEDIATION_CONTENT,
  buildWeakAreaSummary,
  classifyMistake,
  type MistakeContext,
  type RemediationWeakAreaId,
} from "@/lib/game/remediation";

const REMEDIATION_IDS = new Set<string>(Object.keys(REMEDIATION_CONTENT));

function isRemediationWeakAreaId(tag: string): tag is RemediationWeakAreaId {
  return REMEDIATION_IDS.has(tag);
}

/** Aggregate weak-area tags from incorrect or low-scoring attempts. */
export function detectWeakAreas(attempts: ChallengeAttempt[]): WeakArea[] {
  const ids: RemediationWeakAreaId[] = [];

  for (const attempt of attempts) {
    if (attempt.correct && attempt.scorePercent >= 80) continue;
    for (const tag of attempt.weakTags) {
      if (isRemediationWeakAreaId(tag)) {
        ids.push(tag);
      }
    }
  }

  return buildWeakAreaSummary(ids, 4);
}

/** Classify a single missed question into one weak-area tag for attempt storage. */
export function tagsFromMistake(context: MistakeContext): RemediationWeakAreaId[] {
  return [classifyMistake(context)];
}

/** Fallback tags when only challenge-level score is known (e.g. mock data). */
export function inferWeakTagsFromChallenge(
  challengeId: string,
  scorePercent: number,
): RemediationWeakAreaId[] {
  if (scorePercent >= 80) return [];
  return [classifyMistake({ challengeId, scorePercent })];
}
