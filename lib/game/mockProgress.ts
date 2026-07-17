import type { AchievementEvent } from "@/lib/game/types";
import { buildUserProgress, type BuildUserProgressInput } from "@/lib/game/progress";
import type { ChallengeAttempt } from "@/lib/game/types";

const MOCK_ATTEMPTS: ChallengeAttempt[] = [
  {
    id: "att-001",
    challengeId: "challenge-why-books",
    moduleId: "daily-ledger",
    attemptNumber: 1,
    correct: true,
    firstTry: true,
    scorePercent: 100,
    xpEarned: 50,
    timestamp: "2024-06-02T10:00:00.000Z",
    weakTags: [],
  },
  {
    id: "att-002",
    challengeId: "challenge-classify-transaction",
    moduleId: "daily-ledger",
    attemptNumber: 1,
    correct: true,
    firstTry: true,
    scorePercent: 75,
    xpEarned: 60,
    timestamp: "2024-06-03T14:30:00.000Z",
    weakTags: ["account_category_confusion", "sales_tax_confusion"],
  },
  {
    id: "att-003",
    challengeId: "challenge-classify-transaction",
    moduleId: "daily-ledger",
    attemptNumber: 2,
    correct: true,
    firstTry: false,
    scorePercent: 90,
    xpEarned: 30,
    timestamp: "2024-06-03T15:00:00.000Z",
    weakTags: [],
  },
  {
    id: "att-004",
    challengeId: "challenge-double-entry-duel",
    moduleId: "daily-ledger",
    attemptNumber: 1,
    correct: false,
    firstTry: true,
    scorePercent: 45,
    xpEarned: 0,
    timestamp: "2024-06-04T09:00:00.000Z",
    weakTags: ["debit_credit_confusion", "account_category_confusion"],
  },
];

const MOCK_ACHIEVEMENTS: AchievementEvent[] = [
  {
    id: "evt-1",
    type: "badge_unlocked",
    timestamp: "2024-06-02T10:05:00.000Z",
    title: "Badge: First Entry",
    description: "Started practicing double-entry bookkeeping.",
    badgeId: "first-entry",
  },
  {
    id: "evt-2",
    type: "streak_milestone",
    timestamp: "2024-06-04T08:00:00.000Z",
    title: "3-day streak!",
    description: "Consistency builds confidence with your books.",
  },
  {
    id: "evt-3",
    type: "xp_earned",
    timestamp: "2024-06-03T14:30:00.000Z",
    title: "+60 XP",
    description: "Earned from Daily Ledger: Classify the Transaction.",
    xpDelta: 60,
  },
];

export const MOCK_PROGRESS_INPUT: BuildUserProgressInput = {
  businessName: "Bright Path Consulting",
  attempts: MOCK_ATTEMPTS,
  streakDays: 3,
  bestAnswerStreak: 2,
  earnedBadgeIds: ["first-entry", "streak-3"],
  earnedBadgeDates: {
    "first-entry": "2024-06-02",
    "streak-3": "2024-06-04",
  },
  yearEndScenarioBadges: [],
  challengeTitles: {
    "challenge-why-books": "Why Keep Books?",
    "challenge-classify-transaction": "Daily Ledger: Classify the Transaction",
    "challenge-double-entry-duel": "Double-Entry Duel",
    "challenge-sort-accounts": "Account Sorter",
    "challenge-insight-detective": "Insight Detective",
    "challenge-year-end-boss": "Year-End Boss Fight",
  },
  recentAchievements: MOCK_ACHIEVEMENTS,
  bonusXp: 50,
};

export function getMockGamificationProgress() {
  return buildUserProgress(MOCK_PROGRESS_INPUT);
}
