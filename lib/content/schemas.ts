/**
 * Canonical content schemas for Ledger Quest.
 *
 * These types are the admin-editable contract — today backed by TypeScript
 * data files in lib/data/, eventually editable via Supabase or a CMS.
 */

import type { ModuleId } from "@/lib/game/types";
import type { WorldId } from "@/lib/types";
import type { AccountType } from "@/lib/types/accounting";

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** Plain-language feedback shown after a learner answers. */
export type FeedbackRule = {
  correctFeedback?: string;
  incorrectFeedback?: string;
  explanation?: string;
  consistencyTip?: string;
  consistencyPrinciple?: string;
  doubleEntryEffect?: string;
  hint?: string;
  ownerExplanation?: string;
};

export type ExpectedJournalLineAnswer = {
  accountId: string;
  debitCents: number;
  creditCents: number;
};

export type CashBankEffect = "increase" | "decrease" | "no_change";

/** Answer key for a single practice scenario. */
export type CorrectAnswer = {
  accountType?: AccountType;
  accountId?: string;
  cashEffect?: CashBankEffect;
  salesTaxApplies?: boolean;
  expectedLines?: ExpectedJournalLineAnswer[];
  correctOptionId?: string;
  correctNumericCents?: number;
  correctCategory?: string;
  correctAmountCents?: number;
};

export type TransactionScenarioType =
  | "classification"
  | "journal"
  | "sort"
  | "quiz"
  | "year_end";

/**
 * A single practice item inside a challenge — transaction, journal scenario,
 * sort card, quiz question, or year-end adjusting entry.
 */
export type TransactionScenario = {
  id: string;
  scenarioType: TransactionScenarioType;
  title: string;
  narrative: string;
  date?: string;
  vendor?: string;
  amountCents?: number;
  correctAnswer: CorrectAnswer;
  feedback: FeedbackRule;
  xpReward?: number;
};

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export type LessonExample = {
  title: string;
  description: string;
  accountHint?: string;
};

export type BossTipContent = {
  title?: string;
  body: string;
};

export type ConsistencyRuleContent = {
  title?: string;
  body: string;
  example: string;
};

export type LessonContent = {
  id: string;
  week: number;
  worldId: WorldId;
  /** Alias for worldId — preferred name in admin/CMS tooling. */
  moduleId?: WorldId;
  title: string;
  storyIntro: string;
  learningObjectives: string[];
  explanation: string[];
  examples: LessonExample[];
  bossTip: BossTipContent;
  consistencyRule?: ConsistencyRuleContent;
  primaryChallengeId: string;
  calculatorHref?: string;
  calculatorLabel?: string;
  durationMinutes: number;
};

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

export type ChallengeKind =
  | "classify_transaction"
  | "journal_entry"
  | "account_sort"
  | "insight_quiz"
  | "year_end_boss"
  | "placeholder";

export type ChallengeContent = {
  id: string;
  kind: ChallengeKind;
  title: string;
  description: string;
  lessonId: string;
  moduleId: ModuleId;
  nextLessonId?: string;
  passThresholdPercent?: number;
  xpReward?: number;
  badgeId?: string;
  scenarios: TransactionScenario[];
};

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  learningOutcome: string;
  moduleId?: ModuleId;
  /** Human-readable unlock criteria for admins and learners. */
  criteria: string;
  /** Optional machine key for automated unlock rules (future admin tooling). */
  ruleKey?: string;
};

// ---------------------------------------------------------------------------
// Course bundle
// ---------------------------------------------------------------------------

export type CourseContentBundle = {
  version: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  lessons: LessonContent[];
  challenges: ChallengeContent[];
  badges: BadgeDefinition[];
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ContentWarningCode =
  | "missing_explanation"
  | "missing_correct_answer"
  | "missing_learning_objective"
  | "missing_badge_criteria"
  | "missing_feedback";

export type ContentEntityType = "lesson" | "challenge" | "scenario" | "badge";

export type ContentWarning = {
  code: ContentWarningCode;
  entityType: ContentEntityType;
  entityId: string;
  entityTitle: string;
  message: string;
  field?: string;
};

export type ContentValidationResult = {
  warnings: ContentWarning[];
  counts: Record<ContentWarningCode, number>;
  isClean: boolean;
};
