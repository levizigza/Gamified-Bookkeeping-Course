import type { AccountType } from "@/lib/types/accounting";
import type { CashBankEffect } from "@/lib/data/week1Challenges";
import type { ClassifyTransactionAnswer } from "@/lib/data/week1Challenges";

export type ClassificationField =
  | "accountType"
  | "accountId"
  | "cashEffect"
  | "salesTaxApplies";

export const FIELD_LABELS: Record<ClassificationField, string> = {
  accountType: "Account category",
  accountId: "Specific account",
  cashEffect: "Bank/Cash effect",
  salesTaxApplies: "Sales tax (GST)",
};

export type UserClassification = {
  accountType: AccountType | "";
  accountId: string;
  cashEffect: CashBankEffect | "";
  salesTaxApplies: boolean | null;
};

export type FieldResults = Record<ClassificationField, boolean>;

export type GradeResult = {
  correct: boolean;
  fieldResults: FieldResults;
  wrongFields: ClassificationField[];
};

export type AttemptRecord = {
  transactionId: string;
  firstTryCorrect: boolean;
  attempts: number;
  xpEarned: number;
  wrongFieldsOnFirstTry: ClassificationField[];
};

export type ChallengeSummary = {
  totalXp: number;
  accuracyPercent: number;
  correctOnFirstTry: number;
  totalQuestions: number;
  weakAreas: string[];
  recommendation: "retry" | "next_lesson";
  recommendationMessage: string;
};

/** Grade a single transaction classification against the answer key. */
export function gradeClassification(
  user: UserClassification,
  answer: ClassifyTransactionAnswer,
): GradeResult {
  const fieldResults: FieldResults = {
    accountType: user.accountType === answer.accountType,
    accountId: user.accountId === answer.accountId,
    cashEffect: user.cashEffect === answer.cashEffect,
    salesTaxApplies: user.salesTaxApplies === answer.salesTaxApplies,
  };

  const wrongFields = (
    Object.entries(fieldResults) as [ClassificationField, boolean][]
  )
    .filter(([, ok]) => !ok)
    .map(([field]) => field);

  return {
    correct: wrongFields.length === 0,
    fieldResults,
    wrongFields,
  };
}

/** XP awarded when the learner gets a transaction correct. */
export function xpForCorrectAnswer(baseXp: number): number {
  return baseXp;
}

/** First-try accuracy across all attempts. */
export function calculateAccuracyPercent(
  correctOnFirstTry: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((correctOnFirstTry / total) * 100);
}

/** Aggregate wrong fields into human-readable weak areas. */
export function identifyWeakAreas(
  records: AttemptRecord[],
): string[] {
  const fieldCounts: Partial<Record<ClassificationField, number>> = {};

  for (const record of records) {
    for (const field of record.wrongFieldsOnFirstTry) {
      fieldCounts[field] = (fieldCounts[field] ?? 0) + 1;
    }
  }

  return (Object.entries(fieldCounts) as [ClassificationField, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([field, count]) => `${FIELD_LABELS[field]} (${count} miss${count > 1 ? "es" : ""})`);
}

/** Build end-of-challenge summary with retry vs next-lesson recommendation. */
export function buildChallengeSummary(
  records: AttemptRecord[],
  accuracyThreshold = 70,
): ChallengeSummary {
  const totalQuestions = records.length;
  const correctOnFirstTry = records.filter((r) => r.firstTryCorrect).length;
  const totalXp = records.reduce((sum, r) => sum + r.xpEarned, 0);
  const accuracyPercent = calculateAccuracyPercent(correctOnFirstTry, totalQuestions);
  const weakAreas = identifyWeakAreas(records);

  const recommendation: "retry" | "next_lesson" =
    accuracyPercent >= accuracyThreshold ? "next_lesson" : "retry";

  const recommendationMessage =
    recommendation === "next_lesson"
      ? "Great work! You are ready for the June Ledger Sprint — recording full transactions."
      : "Review the transactions you missed and try again. Focus on your weak areas before moving on.";

  return {
    totalXp,
    accuracyPercent,
    correctOnFirstTry,
    totalQuestions,
    weakAreas,
    recommendation,
    recommendationMessage,
  };
}

export function isClassificationComplete(user: UserClassification): boolean {
  return (
    user.accountType !== "" &&
    user.accountId !== "" &&
    user.cashEffect !== "" &&
    user.salesTaxApplies !== null
  );
}

export function createEmptyClassification(): UserClassification {
  return {
    accountType: "",
    accountId: "",
    cashEffect: "",
    salesTaxApplies: null,
  };
}
