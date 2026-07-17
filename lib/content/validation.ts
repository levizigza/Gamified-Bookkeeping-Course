/**
 * Content quality checks for the admin preview.
 */

import { hasCorrectAnswer, hasFeedbackContent } from "@/lib/content/adapters";
import type {
  BadgeDefinition,
  ChallengeContent,
  ContentEntityType,
  ContentValidationResult,
  ContentWarning,
  ContentWarningCode,
  CourseContentBundle,
  LessonContent,
  TransactionScenario,
} from "@/lib/content/schemas";

function isNonEmpty(value?: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function warn(
  warnings: ContentWarning[],
  input: Omit<ContentWarning, "code"> & { code: ContentWarningCode },
): void {
  warnings.push(input);
}

function validateLesson(lesson: LessonContent, warnings: ContentWarning[]): void {
  const objectives = lesson.learningObjectives.filter((o) => isNonEmpty(o));
  if (objectives.length === 0) {
    warn(warnings, {
      code: "missing_learning_objective",
      entityType: "lesson",
      entityId: lesson.id,
      entityTitle: lesson.title,
      message: "Lesson has no learning objectives.",
      field: "learningObjectives",
    });
  }

  const paragraphs = lesson.explanation.filter((p) => isNonEmpty(p));
  if (paragraphs.length === 0) {
    warn(warnings, {
      code: "missing_explanation",
      entityType: "lesson",
      entityId: lesson.id,
      entityTitle: lesson.title,
      message: "Lesson has no explanation paragraphs.",
      field: "explanation",
    });
  }
}

function validateScenario(
  scenario: TransactionScenario,
  challenge: ChallengeContent,
  warnings: ContentWarning[],
): void {
  if (!hasCorrectAnswer(scenario.correctAnswer, scenario.scenarioType)) {
    warn(warnings, {
      code: "missing_correct_answer",
      entityType: "scenario",
      entityId: scenario.id,
      entityTitle: `${challenge.title} → ${scenario.title}`,
      message: `Scenario "${scenario.title}" is missing a complete correct answer.`,
      field: "correctAnswer",
    });
  }

  if (!hasFeedbackContent(scenario.feedback)) {
    warn(warnings, {
      code: "missing_feedback",
      entityType: "scenario",
      entityId: scenario.id,
      entityTitle: `${challenge.title} → ${scenario.title}`,
      message: `Scenario "${scenario.title}" has no learner feedback configured.`,
      field: "feedback",
    });
  }
}

function validateChallenge(challenge: ChallengeContent, warnings: ContentWarning[]): void {
  if (challenge.scenarios.length === 0) {
    warn(warnings, {
      code: "missing_feedback",
      entityType: "challenge",
      entityId: challenge.id,
      entityTitle: challenge.title,
      message:
        challenge.kind === "placeholder"
          ? `Challenge "${challenge.title}" is catalog-only — add scenarios in lib/data or a CMS.`
          : `Challenge "${challenge.title}" has no scenarios or transaction examples.`,
      field: "scenarios",
    });
    return;
  }

  for (const scenario of challenge.scenarios) {
    validateScenario(scenario, challenge, warnings);
  }
}

function validateBadge(badge: BadgeDefinition, warnings: ContentWarning[]): void {
  if (!isNonEmpty(badge.criteria)) {
    warn(warnings, {
      code: "missing_badge_criteria",
      entityType: "badge",
      entityId: badge.id,
      entityTitle: badge.name,
      message: `Badge "${badge.name}" is missing unlock criteria.`,
      field: "criteria",
    });
  }
}

function countWarnings(warnings: ContentWarning[]): Record<ContentWarningCode, number> {
  const counts: Record<ContentWarningCode, number> = {
    missing_explanation: 0,
    missing_correct_answer: 0,
    missing_learning_objective: 0,
    missing_badge_criteria: 0,
    missing_feedback: 0,
  };
  for (const warning of warnings) {
    counts[warning.code] += 1;
  }
  return counts;
}

export function validateCourseContent(
  bundle: CourseContentBundle,
): ContentValidationResult {
  const warnings: ContentWarning[] = [];

  for (const lesson of bundle.lessons) {
    validateLesson(lesson, warnings);
  }
  for (const challenge of bundle.challenges) {
    validateChallenge(challenge, warnings);
  }
  for (const badge of bundle.badges) {
    validateBadge(badge, warnings);
  }

  return {
    warnings,
    counts: countWarnings(warnings),
    isClean: warnings.length === 0,
  };
}

export function filterWarningsByEntity(
  warnings: ContentWarning[],
  entityType: ContentEntityType,
): ContentWarning[] {
  return warnings.filter((w) => w.entityType === entityType);
}

export const WARNING_LABELS: Record<ContentWarningCode, string> = {
  missing_explanation: "Missing explanation",
  missing_correct_answer: "Missing correct answer",
  missing_learning_objective: "Missing learning objective",
  missing_badge_criteria: "Missing badge criteria",
  missing_feedback: "Missing feedback",
};
