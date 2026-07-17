import type { Badge, Challenge, Lesson, LegacyUserProgressSnapshot, World } from "@/lib/types";
import { mergeBadgesWithEarnedState } from "@/lib/game/badges";
import { getMockGamificationProgress } from "@/lib/game/mockProgress";
import { toLegacyProgressSnapshot } from "@/lib/game/adapters";

const worlds: World[] = [
  {
    id: "daily-ledger",
    name: "Daily Ledger",
    subtitle: "Week 1 — Record the books",
    description:
      "Learn double-entry bookkeeping by recording June 2024 transactions for Bright Path Consulting.",
    week: 1,
    icon: "📒",
    unlocked: true,
    progressPercent: 35,
    lessonIds: ["lesson-why-bookkeeping", "lesson-double-entry", "lesson-june-sprint"],
  },
  {
    id: "account-sorter",
    name: "Account Sorter",
    subtitle: "Week 2 — Classify & balance",
    description:
      "Sort transactions into account categories and build a trial balance.",
    week: 2,
    icon: "🗂️",
    unlocked: false,
    progressPercent: 0,
    lessonIds: ["lesson-account-types", "lesson-trial-balance"],
  },
  {
    id: "reports-room",
    name: "Reports Room",
    subtitle: "Week 3 — Read the story",
    description:
      "Transactions → Trial Balance → Profit & Loss + Balance Sheet → Insights → Decisions.",
    week: 3,
    icon: "📊",
    unlocked: false,
    progressPercent: 0,
    lessonIds: ["lesson-profit-loss", "lesson-balance-sheet"],
  },
  {
    id: "year-end-boss",
    name: "Year-End Boss Fight",
    subtitle: "Week 4 — Close the year",
    description:
      "Post Journals #1–#3 (depreciation, home office, mileage) — then hand off to your accountant.",
    week: 4,
    icon: "⚔️",
    unlocked: false,
    progressPercent: 0,
    lessonIds: ["lesson-depreciation", "lesson-handoff"],
  },
];

const badges: Badge[] = mergeBadgesWithEarnedState(["first-entry", "streak-3"], {
  "first-entry": "2024-06-02",
  "streak-3": "2024-06-04",
});

const lessons: Lesson[] = [
  {
    id: "lesson-why-bookkeeping",
    worldId: "daily-ledger",
    title: "What Is Bookkeeping — and Why It Matters",
    description:
      "Learn how recording everyday income and spending helps you understand the business and prepare information for taxes, banks, and partners.",
    durationMinutes: 8,
    challengeIds: ["challenge-why-books"],
    completed: true,
  },
  {
    id: "lesson-double-entry",
    worldId: "daily-ledger",
    title: "Double-Entry Bookkeeping and Sales Taxes",
    description: "Two opposing sides to every transaction — plus GST on everyday buys like taxis and Home Depot materials.",
    durationMinutes: 12,
    challengeIds: ["challenge-classify-transaction", "challenge-double-entry-duel"],
    completed: false,
  },
  {
    id: "lesson-june-sprint",
    worldId: "daily-ledger",
    title: "June Ledger Sprint",
    description:
      "Record Bright Path’s June transactions: meals, vehicle/travel, office, supplies, equipment, and GST splits — about five minutes a day.",
    durationMinutes: 25,
    challengeIds: ["challenge-june-meals", "challenge-june-equipment"],
    completed: false,
  },
  {
    id: "lesson-account-types",
    worldId: "account-sorter",
    title: "Assets, Liabilities, Income and Expenses",
    description:
      "Learn what the business owns, what it owes, what it earns, and what it spends—including whether money moves now or later.",
    durationMinutes: 12,
    challengeIds: ["challenge-sort-accounts"],
    completed: false,
  },
  {
    id: "lesson-trial-balance",
    worldId: "account-sorter",
    title: "Trial Balance",
    description:
      "Daily transactions compile into a month-end summary of assets, liabilities, income, and expenses.",
    durationMinutes: 15,
    challengeIds: ["challenge-trial-balance"],
    completed: false,
  },
  {
    id: "lesson-profit-loss",
    worldId: "reports-room",
    title: "Financial Statements — Profit & Loss",
    description:
      "Follow transactions into a Profit & Loss report, then read revenue, direct costs, gross profit, expenses, and net income.",
    durationMinutes: 12,
    challengeIds: ["challenge-build-pl", "challenge-insight-detective"],
    completed: false,
  },
  {
    id: "lesson-balance-sheet",
    worldId: "reports-room",
    title: "Balance Sheet, Insights & Decisions",
    description:
      "Learn why assets must equal liabilities plus equity, then use the report to make practical owner decisions.",
    durationMinutes: 14,
    challengeIds: ["challenge-build-bs", "challenge-insight-detective"],
    completed: false,
  },
  {
    id: "lesson-depreciation",
    worldId: "year-end-boss",
    title: "Year-End Common Journals",
    description:
      "Journals #1–#3: depreciation $14,500, home office $3,585, mileage $15,600.",
    durationMinutes: 18,
    challengeIds: ["challenge-depreciation", "challenge-year-end-boss"],
    completed: false,
  },
  {
    id: "lesson-handoff",
    worldId: "year-end-boss",
    title: "Handover to Accountants for Tax Preparation",
    description:
      "Prepare an adjusted Trial Balance, financial statements, and supporting worksheets for the accountant.",
    durationMinutes: 12,
    challengeIds: ["challenge-year-end-boss"],
    completed: false,
  },
];

const challenges: Challenge[] = [
  {
    id: "challenge-why-books",
    lessonId: "lesson-why-bookkeeping",
    worldId: "daily-ledger",
    title: "Why Keep Books?",
    description: "Choose the best reasons a business owner tracks every transaction.",
    xpReward: 50,
    completed: true,
  },
  {
    id: "challenge-classify-transaction",
    lessonId: "lesson-double-entry",
    worldId: "daily-ledger",
    title: "Daily Ledger: Classify the Transaction",
    description:
      "Classify June 2024 transactions by account, bank effect, and GST — one at a time.",
    xpReward: 320,
    completed: false,
  },
  {
    id: "challenge-double-entry-duel",
    lessonId: "lesson-double-entry",
    worldId: "daily-ledger",
    title: "Double-Entry Duel",
    description:
      "Build journal entries from business scenarios — balance debits and credits, pick accounts, and handle GST.",
    xpReward: 400,
    completed: false,
  },
  {
    id: "challenge-first-journal",
    lessonId: "lesson-double-entry",
    worldId: "daily-ledger",
    title: "Your First Journal Entry",
    description: "Record a client payment using double-entry rules.",
    xpReward: 100,
    completed: false,
  },
  {
    id: "challenge-june-meals",
    lessonId: "lesson-june-sprint",
    worldId: "daily-ledger",
    title: "June: Business Lunch",
    description: "Record a client meal from June 12, 2024.",
    xpReward: 75,
    completed: false,
  },
  {
    id: "challenge-june-equipment",
    lessonId: "lesson-june-sprint",
    worldId: "daily-ledger",
    title: "June: Laptop Purchase",
    description: "Record equipment bought for Bright Path Consulting.",
    xpReward: 100,
    completed: false,
  },
  {
    id: "challenge-sort-accounts",
    lessonId: "lesson-account-types",
    worldId: "account-sorter",
    title: "Account Sorter",
    description:
      "Sort assets, liabilities, income, expenses, and equity. Aim for 80% or higher to reach the Week 2 learning target.",
    xpReward: 230,
    completed: false,
  },
  {
    id: "challenge-trial-balance",
    lessonId: "lesson-trial-balance",
    worldId: "account-sorter",
    title: "Trial Balance Checkpoint",
    description:
      "See how the month compiles into a Trial Balance — then practice keeping debits equal to credits.",
    xpReward: 150,
    completed: false,
  },
  {
    id: "challenge-build-pl",
    lessonId: "lesson-profit-loss",
    worldId: "reports-room",
    title: "Build the P&L",
    description: "Map trial balance accounts to a Profit & Loss report.",
    xpReward: 125,
    completed: false,
  },
  {
    id: "challenge-build-bs",
    lessonId: "lesson-balance-sheet",
    worldId: "reports-room",
    title: "Build the Balance Sheet",
    description: "Organize assets, liabilities, and equity correctly.",
    xpReward: 125,
    completed: false,
  },
  {
    id: "challenge-insight-detective",
    lessonId: "lesson-balance-sheet",
    worldId: "reports-room",
    title: "Insight Detective",
    description:
      "Review June 2024 reports and answer business decision questions. Earn the badge at 80% or higher.",
    xpReward: 175,
    completed: false,
  },
  {
    id: "challenge-depreciation",
    lessonId: "lesson-depreciation",
    worldId: "year-end-boss",
    title: "Depreciation Entry",
    description: "Calculate and post depreciation for June equipment.",
    xpReward: 200,
    completed: false,
  },
  {
    id: "challenge-year-end-boss",
    lessonId: "lesson-handoff",
    worldId: "year-end-boss",
    title: "Year-End Boss Fight",
    description:
      "Post depreciation, home office, and mileage adjusting entries. Earn badges at 80% mastery.",
    xpReward: 300,
    completed: false,
  },
  {
    id: "challenge-handoff",
    lessonId: "lesson-handoff",
    worldId: "year-end-boss",
    title: "Tax-Ready Handoff",
    description: "Complete the year-end checklist for your accountant.",
    xpReward: 250,
    completed: false,
  },
];

export function getMockUserProgress(): LegacyUserProgressSnapshot {
  return toLegacyProgressSnapshot(getMockGamificationProgress(), worlds);
}

export function getWorlds(): World[] {
  return worlds;
}

export function getWorldById(id: string): World | undefined {
  return worlds.find((w) => w.id === id);
}

export function getLessons(): Lesson[] {
  return lessons;
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByWorld(worldId: string): Lesson[] {
  return lessons.filter((l) => l.worldId === worldId);
}

export function getChallenges(): Challenge[] {
  return challenges;
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}

export function getNextChallenge(): Challenge | undefined {
  const progress = getMockUserProgress();
  return getChallengeById(progress.nextChallengeId);
}

export function getEarnedBadges(): Badge[] {
  return badges.filter((b) => b.earned);
}

export function getLockedBadges(): Badge[] {
  return badges.filter((b) => !b.earned);
}
