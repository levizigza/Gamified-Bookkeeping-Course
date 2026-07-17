/**
 * Maps existing lib/data challenge files into canonical content schemas.
 */

import { classifyTransactionChallenge } from "@/lib/data/week1Challenges";
import { doubleEntryDuelChallenge } from "@/lib/data/week1JournalChallenges";
import { accountSorterChallenge } from "@/lib/data/week2Challenges";
import { getInsightDetectiveChallenge } from "@/lib/data/week3Challenges";
import { getYearEndBossChallenge } from "@/lib/data/week4Challenges";
import type {
  ChallengeContent,
  CorrectAnswer,
  FeedbackRule,
  TransactionScenario,
} from "@/lib/content/schemas";

function classificationScenario(
  tx: (typeof classifyTransactionChallenge.transactions)[number],
): TransactionScenario {
  return {
    id: tx.id,
    scenarioType: "classification",
    title: tx.description,
    narrative: tx.narrative,
    date: tx.date,
    vendor: tx.vendor,
    amountCents: tx.amountCents,
    xpReward: tx.xpReward,
    correctAnswer: {
      accountType: tx.answer.accountType,
      accountId: tx.answer.accountId,
      cashEffect: tx.answer.cashEffect,
      salesTaxApplies: tx.answer.salesTaxApplies,
    },
    feedback: {
      explanation: tx.answer.explanation,
      consistencyPrinciple: tx.answer.consistencyPrinciple,
      doubleEntryEffect: tx.answer.doubleEntryEffect,
    },
  };
}

function journalScenario(
  scenario: (typeof doubleEntryDuelChallenge.scenarios)[number],
): TransactionScenario {
  return {
    id: scenario.id,
    scenarioType: "journal",
    title: scenario.title,
    narrative: scenario.narrative,
    date: scenario.date,
    amountCents: scenario.displayAmountCents,
    xpReward: scenario.maxXp,
    correctAnswer: {
      expectedLines: scenario.expectedLines,
      salesTaxApplies: scenario.salesTaxApplies,
    },
    feedback: {
      ownerExplanation: scenario.ownerExplanation,
      consistencyTip: scenario.consistencyTip,
    },
  };
}

function sortScenario(
  item: (typeof accountSorterChallenge.items)[number],
): TransactionScenario {
  return {
    id: item.id,
    scenarioType: "sort",
    title: item.name,
    narrative: `Sort "${item.name}" into the correct account category.`,
    correctAnswer: {
      correctCategory: item.correctCategory,
    },
    feedback: {
      correctFeedback: item.correctFeedback,
      incorrectFeedback: item.incorrectFeedback,
    },
    xpReward: item.baseXp,
  };
}

function quizScenario(
  question: (typeof insightDetectiveChallenge.questions)[number],
): TransactionScenario {
  return {
    id: question.id,
    scenarioType: "quiz",
    title: question.type.replace(/_/g, " "),
    narrative: question.prompt,
    correctAnswer: {
      correctOptionId: question.correctOptionId,
      correctNumericCents: question.correctNumericCents,
    },
    feedback: {
      hint: question.hint,
      correctFeedback: question.correctFeedback,
      incorrectFeedback: question.incorrectFeedback,
    },
    xpReward: question.baseXp,
  };
}

function yearEndScenario(
  scenario: (typeof yearEndBossChallenge.scenarios)[number],
): TransactionScenario {
  return {
    id: scenario.id,
    scenarioType: "year_end",
    title: scenario.title,
    narrative: scenario.narrative,
    correctAnswer: {
      correctAmountCents: scenario.correctAmountCents,
      expectedLines: scenario.expectedLines,
    },
    feedback: {
      hint: scenario.calculationHint,
      ownerExplanation: scenario.ownerExplanation,
      consistencyTip: scenario.consistencyTip,
      explanation: scenario.calculationPrompt,
    },
    xpReward: scenario.maxXp,
  };
}

const insightDetectiveChallenge = getInsightDetectiveChallenge();
const yearEndBossChallenge = getYearEndBossChallenge();

/** Rich challenge content authored in lib/data — keyed by challenge id. */
export const RICH_CHALLENGE_ADAPTERS: ChallengeContent[] = [
  {
    id: classifyTransactionChallenge.id,
    kind: "classify_transaction",
    title: classifyTransactionChallenge.title,
    description: classifyTransactionChallenge.description,
    lessonId: classifyTransactionChallenge.lessonId,
    moduleId: "daily-ledger",
    nextLessonId: classifyTransactionChallenge.nextLessonId,
    scenarios: classifyTransactionChallenge.transactions.map(classificationScenario),
  },
  {
    id: doubleEntryDuelChallenge.id,
    kind: "journal_entry",
    title: doubleEntryDuelChallenge.title,
    description: doubleEntryDuelChallenge.description,
    lessonId: doubleEntryDuelChallenge.lessonId,
    moduleId: "daily-ledger",
    nextLessonId: doubleEntryDuelChallenge.nextLessonId,
    scenarios: doubleEntryDuelChallenge.scenarios.map(journalScenario),
  },
  {
    id: accountSorterChallenge.id,
    kind: "account_sort",
    title: accountSorterChallenge.title,
    description: accountSorterChallenge.description,
    lessonId: accountSorterChallenge.lessonId,
    moduleId: "account-sorter",
    scenarios: accountSorterChallenge.items.map(sortScenario),
  },
  {
    id: insightDetectiveChallenge.id,
    kind: "insight_quiz",
    title: insightDetectiveChallenge.title,
    description: insightDetectiveChallenge.description,
    lessonId: insightDetectiveChallenge.lessonId,
    moduleId: insightDetectiveChallenge.worldId,
    passThresholdPercent: insightDetectiveChallenge.passThresholdPercent,
    xpReward: insightDetectiveChallenge.xpReward,
    badgeId: insightDetectiveChallenge.badgeId,
    scenarios: insightDetectiveChallenge.questions.map(quizScenario),
  },
  {
    id: yearEndBossChallenge.id,
    kind: "year_end_boss",
    title: yearEndBossChallenge.title,
    description: yearEndBossChallenge.description,
    lessonId: yearEndBossChallenge.lessonId,
    moduleId: yearEndBossChallenge.worldId,
    passThresholdPercent: yearEndBossChallenge.passThresholdPercent,
    xpReward: yearEndBossChallenge.xpReward,
    scenarios: yearEndBossChallenge.scenarios.map(yearEndScenario),
  },
];

export function adaptCatalogChallengeToPlaceholder(
  challenge: {
    id: string;
    title: string;
    description: string;
    lessonId: string;
    worldId: import("@/lib/types").WorldId;
    xpReward: number;
  },
): ChallengeContent {
  return {
    id: challenge.id,
    kind: "placeholder",
    title: challenge.title,
    description: challenge.description,
    lessonId: challenge.lessonId,
    moduleId: challenge.worldId,
    xpReward: challenge.xpReward,
    scenarios: [],
  };
}

/** Utility for tests and admin tools. */
export function hasFeedbackContent(feedback: FeedbackRule): boolean {
  return Object.values(feedback).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}

export function hasCorrectAnswer(
  answer: CorrectAnswer,
  scenarioType: TransactionScenario["scenarioType"],
): boolean {
  switch (scenarioType) {
    case "classification":
      return Boolean(answer.accountId?.trim() && answer.accountType);
    case "journal":
      return (answer.expectedLines?.length ?? 0) >= 2;
    case "sort":
      return Boolean(answer.correctCategory?.trim());
    case "quiz":
      return Boolean(
        answer.correctOptionId?.trim() ||
          answer.correctNumericCents !== undefined,
      );
    case "year_end":
      return (
        answer.correctAmountCents !== undefined &&
        (answer.expectedLines?.length ?? 0) >= 2
      );
    default:
      return false;
  }
}
