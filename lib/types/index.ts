export type {
  MoneyAmount,
  Currency,
  AccountType,
  AccountSubType,
  Account,
  SalesTaxTreatment,
  DebitTransactionLine,
  CreditTransactionLine,
  TransactionLine,
  Transaction,
  DebitJournalLine,
  CreditJournalLine,
  JournalLine,
  JournalEntry,
  TrialBalanceRow,
  TrialBalance,
  FinancialStatementPeriod,
  ProfitAndLossLine,
  ProfitAndLossReport,
  BalanceSheetLine,
  BalanceSheetReport,
  DepreciationAsset,
  HomeOfficeClaim,
  MileageClaim,
  ValidationErrorCode,
  ValidationError,
  ValidationResult,
  ChallengeFeedback,
} from "./accounting";

/** @deprecated Use MoneyAmount */
export type { MoneyAmount as Money } from "./accounting";

/** @deprecated Use TrialBalanceRow */
export type { TrialBalanceRow as TrialBalanceLine } from "./accounting";

export type WorldId =
  | "daily-ledger"
  | "account-sorter"
  | "reports-room"
  | "year-end-boss";

import type {
  AchievementEvent,
  Badge,
  ChallengeAttempt,
  ModuleId,
  ModuleProgress,
  UserProgress,
  WeakArea,
  XpAwardInput,
  XpAwardResult,
} from "@/lib/game/types";

export type {
  AchievementEvent,
  Badge,
  ChallengeAttempt,
  ModuleId,
  ModuleProgress,
  UserProgress,
  WeakArea,
  XpAwardInput,
  XpAwardResult,
};

export type World = {
  id: WorldId;
  name: string;
  subtitle: string;
  description: string;
  week: number;
  icon: string;
  unlocked: boolean;
  progressPercent: number;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  worldId: WorldId;
  title: string;
  description: string;
  durationMinutes: number;
  challengeIds: string[];
  completed: boolean;
};

export type Challenge = {
  id: string;
  lessonId: string;
  worldId: WorldId;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
};

/** @deprecated Use UserProgress from @/lib/game — kept for challenge cards. */
export type LegacyUserProgressSnapshot = {
  xp: number;
  level: number;
  streakDays: number;
  masteryPercent: number;
  badges: Badge[];
  worlds: World[];
  nextChallengeId: string;
  businessName: string;
};
