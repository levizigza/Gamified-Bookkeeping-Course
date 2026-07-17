import {
  INSIGHT_DETECTIVE_BADGE_ID,
  INSIGHT_DETECTIVE_PASS_THRESHOLD,
} from "@/lib/data/week3Challenges";

export type InsightAttempt = {
  questionId: string;
  correct: boolean;
  firstTry: boolean;
};

export type InsightSessionResult = {
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  firstTryCorrect: number;
  baseXp: number;
  totalXp: number;
  badgeEarned: boolean;
};

/** Parse a user-entered dollar amount into cents. Accepts $, commas, and decimals. */
export function parseNumericDollarsToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[$,\s]/g, "");
  if (!cleaned || !/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null;

  const dollars = Number(cleaned);
  if (Number.isNaN(dollars)) return null;

  return Math.round(dollars * 100);
}

export function gradeNumericAnswer(
  input: string,
  expectedCents: number,
  toleranceCents = 0,
): boolean {
  const parsed = parseNumericDollarsToCents(input);
  if (parsed === null) return false;
  return Math.abs(parsed - expectedCents) <= toleranceCents;
}

export function gradeOptionAnswer(selectedId: string, correctId: string): boolean {
  return selectedId === correctId;
}

export function calculateInsightScorePercent(
  firstTryCorrect: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((firstTryCorrect / total) * 100);
}

export function isInsightDetectiveBadgeEarned(scorePercent: number): boolean {
  return scorePercent >= INSIGHT_DETECTIVE_PASS_THRESHOLD;
}

export function buildInsightSessionResult(
  attempts: InsightAttempt[],
  baseXpPerCorrect: number,
): InsightSessionResult {
  const totalCount = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const firstTryCorrect = attempts.filter((a) => a.firstTry && a.correct).length;
  const scorePercent = calculateInsightScorePercent(firstTryCorrect, totalCount);
  const baseXp = correctCount * baseXpPerCorrect;

  return {
    correctCount,
    totalCount,
    scorePercent,
    firstTryCorrect,
    baseXp,
    totalXp: baseXp,
    badgeEarned: isInsightDetectiveBadgeEarned(scorePercent),
  };
}

export {
  INSIGHT_DETECTIVE_BADGE_ID,
  INSIGHT_DETECTIVE_PASS_THRESHOLD,
};
