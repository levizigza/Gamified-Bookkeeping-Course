import type { ModuleId } from "@/lib/game/types";

/** Mastery needed to unlock the next course week. */
export const MODULE_UNLOCK_THRESHOLD = 80;

/** In-session streak length before bonus XP applies. */
export const STREAK_BONUS_STARTS_AT = 3;

/** Bonus XP per consecutive correct answer at/above streak threshold. */
export const STREAK_BONUS_XP = 5;

/** XP multiplier when the learner answers correctly after a retry. */
export const RETRY_XP_MULTIPLIER = 0.5;

/** XP required per level (linear curve). */
export const XP_PER_LEVEL = 500;

/** Ordered course modules by week. */
export const MODULE_ORDER: { moduleId: ModuleId; week: number }[] = [
  { moduleId: "daily-ledger", week: 1 },
  { moduleId: "account-sorter", week: 2 },
  { moduleId: "reports-room", week: 3 },
  { moduleId: "year-end-boss", week: 4 },
];

export const MODULE_TITLES: Record<ModuleId, string> = {
  "daily-ledger": "Daily Ledger",
  "account-sorter": "Account Sorter",
  "reports-room": "Reports Room",
  "year-end-boss": "Year-End Boss Fight",
};

/** Challenge IDs that count toward each module's mastery (implemented challenges). */
export const MODULE_KEY_CHALLENGES: Record<ModuleId, string[]> = {
  "daily-ledger": [
    "challenge-classify-transaction",
    "challenge-double-entry-duel",
  ],
  "account-sorter": ["challenge-sort-accounts"],
  "reports-room": ["challenge-insight-detective"],
  "year-end-boss": ["challenge-year-end-boss"],
};

/** Challenge IDs with full interactive UI implemented in the app. */
export const IMPLEMENTED_CHALLENGE_IDS: readonly string[] = [
  "challenge-classify-transaction",
  "challenge-double-entry-duel",
  "challenge-sort-accounts",
  "challenge-insight-detective",
  "challenge-year-end-boss",
];

/** Recommended challenge order within the course (implemented challenges first). */
export const CHALLENGE_RECOMMENDATION_ORDER: string[] = [
  "challenge-classify-transaction",
  "challenge-double-entry-duel",
  "challenge-sort-accounts",
  "challenge-insight-detective",
  "challenge-year-end-boss",
  "challenge-why-books",
  "challenge-june-meals",
  "challenge-june-equipment",
  "challenge-trial-balance",
  "challenge-build-pl",
  "challenge-build-bs",
  "challenge-depreciation",
  "challenge-first-journal",
  "challenge-handoff",
];
