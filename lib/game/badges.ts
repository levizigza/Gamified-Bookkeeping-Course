import type { Badge, ChallengeAttempt } from "@/lib/game/types";
import type { BadgeDefinition } from "@/lib/content/schemas";
import { MODULE_KEY_CHALLENGES, MODULE_UNLOCK_THRESHOLD } from "@/lib/game/constants";
import { calculateMasteryPercent } from "@/lib/game/mastery";
import { isStreakMilestone } from "@/lib/game/streaks";

export type { BadgeDefinition } from "@/lib/content/schemas";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-entry",
    name: "First Entry",
    description: "Posted your first journal line.",
    icon: "✏️",
    learningOutcome: "Started practicing double-entry bookkeeping.",
    moduleId: "daily-ledger",
    criteria: "Complete any journal challenge once.",
    ruleKey: "first_journal_challenge",
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Opened the books three days in a row.",
    icon: "🔥",
    learningOutcome: "Built a daily bookkeeping habit.",
    criteria: "Reach a 3-day practice streak.",
    ruleKey: "streak_days_3",
  },
  {
    id: "june-complete",
    name: "June Complete",
    description: "Recorded all June 2024 transactions.",
    icon: "📅",
    learningOutcome: "Finished Week 1 transaction recording.",
    moduleId: "daily-ledger",
    criteria: "80%+ mastery on Daily Ledger key challenges.",
    ruleKey: "module_mastery_daily_ledger",
  },
  {
    id: "trial-balance-hero",
    name: "Trial Balance Hero",
    description: "Balanced your first trial balance.",
    icon: "⚖️",
    learningOutcome: "Proved debits equal credits across accounts.",
    moduleId: "account-sorter",
    criteria: "80%+ on Account Sorter.",
    ruleKey: "module_mastery_account_sorter",
  },
  {
    id: "insight-detective",
    name: "Insight Detective",
    description: "Scored 80% or higher reading financial reports.",
    icon: "🔍",
    learningOutcome: "Turned reports into business decisions.",
    moduleId: "reports-room",
    criteria: "80%+ on Insight Detective.",
    ruleKey: "challenge_insight_detective_80",
  },
  {
    id: "depreciation-defender",
    name: "Depreciation Defender",
    description: "Posted a correct vehicle depreciation adjusting entry.",
    icon: "🚗",
    learningOutcome: "Applied amortization to fixed assets.",
    moduleId: "year-end-boss",
    criteria: "80%+ on Year-End Boss depreciation scenario (first try).",
    ruleKey: "year_end_depreciation_80",
  },
  {
    id: "home-office-hero",
    name: "Home Office Hero",
    description: "Allocated home office costs with a balanced journal entry.",
    icon: "🏠",
    learningOutcome: "Allocated business-use share of home expenses.",
    moduleId: "year-end-boss",
    criteria: "80%+ on Year-End Boss home office scenario (first try).",
    ruleKey: "year_end_home_office_80",
  },
  {
    id: "mileage-master",
    name: "Mileage Master",
    description: "Claimed business mileage with the correct tiered calculation.",
    icon: "🛣️",
    learningOutcome: "Applied per-km mileage allowance correctly.",
    moduleId: "year-end-boss",
    criteria: "80%+ on Year-End Boss mileage scenario (first try).",
    ruleKey: "year_end_mileage_80",
  },
  {
    id: "accountant-ready",
    name: "Accountant Ready",
    description: "Completed all year-end adjusting entries at 80%+ mastery.",
    icon: "📦",
    learningOutcome: "Prepared books for professional tax handoff.",
    moduleId: "year-end-boss",
    criteria: "80%+ average on all Year-End Boss scenarios (first try).",
    ruleKey: "year_end_all_scenarios_80",
  },
];

export type BadgeEvaluationContext = {
  attempts: ChallengeAttempt[];
  streakDays: number;
  earnedBadgeIds: string[];
  yearEndScenarioBadges?: string[];
};

const JOURNAL_CHALLENGE_IDS = [
  "challenge-double-entry-duel",
  "challenge-year-end-boss",
];

const YEAR_END_SCENARIO_BADGE_IDS = [
  "depreciation-defender",
  "home-office-hero",
  "mileage-master",
];

export function evaluateBadgeUnlocks(context: BadgeEvaluationContext): string[] {
  const { attempts, streakDays, earnedBadgeIds, yearEndScenarioBadges = [] } =
    context;
  const unlocked = new Set(earnedBadgeIds);

  if (
    attempts.some((a) =>
      JOURNAL_CHALLENGE_IDS.includes(a.challengeId),
    )
  ) {
    unlocked.add("first-entry");
  }

  if (isStreakMilestone(streakDays)) {
    unlocked.add("streak-3");
  }

  const dailyMastery = calculateMasteryPercent(
    attempts,
    MODULE_KEY_CHALLENGES["daily-ledger"],
  );
  if (dailyMastery >= MODULE_UNLOCK_THRESHOLD) {
    unlocked.add("june-complete");
  }

  const sorterMastery = calculateMasteryPercent(
    attempts,
    MODULE_KEY_CHALLENGES["account-sorter"],
  );
  if (sorterMastery >= MODULE_UNLOCK_THRESHOLD) {
    unlocked.add("trial-balance-hero");
  }

  const insightAttempt = attempts.find(
    (a) => a.challengeId === "challenge-insight-detective" && a.firstTry,
  );
  if (insightAttempt && insightAttempt.scorePercent >= MODULE_UNLOCK_THRESHOLD) {
    unlocked.add("insight-detective");
  }

  const yearEndBadges = new Set([
    ...earnedBadgeIds,
    ...yearEndScenarioBadges,
  ]);
  for (const badgeId of yearEndScenarioBadges) {
    unlocked.add(badgeId);
  }

  if (YEAR_END_SCENARIO_BADGE_IDS.every((id) => yearEndBadges.has(id))) {
    unlocked.add("accountant-ready");
  }

  const yearEndMastery = calculateMasteryPercent(
    attempts,
    MODULE_KEY_CHALLENGES["year-end-boss"],
  );
  if (yearEndMastery >= MODULE_UNLOCK_THRESHOLD) {
    unlocked.add("accountant-ready");
  }

  return [...unlocked];
}

export function mergeBadgesWithEarnedState(
  earnedBadgeIds: string[],
  earnedDates: Record<string, string> = {},
): Badge[] {
  const earned = new Set(earnedBadgeIds);
  return BADGE_DEFINITIONS.map((definition) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    icon: definition.icon,
    learningOutcome: definition.learningOutcome,
    moduleId: definition.moduleId,
    earned: earned.has(definition.id),
    earnedAt: earnedDates[definition.id],
  }));
}
