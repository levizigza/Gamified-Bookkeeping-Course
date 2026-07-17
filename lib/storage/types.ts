/**
 * Storage adapter types — shared contract for localStorage and future Supabase.
 *
 * Field names use camelCase in TypeScript; Supabase columns use snake_case
 * and are mapped in the Supabase adapter when implemented.
 */

import type { ModuleId } from "@/lib/game/types";

export type StorageUserId = string;

export type CurrencyCode = "CAD" | "USD";

export type ReportType =
  | "trial_balance"
  | "profit_and_loss"
  | "balance_sheet"
  | "insights";

export type JournalEntrySource = "practice" | "year_end_adjustment" | "user";

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export type ProfileRecord = {
  id: StorageUserId;
  businessName: string;
  displayName?: string;
  currency: CurrencyCode;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProgressRecord = {
  id: string;
  userId: StorageUserId;
  totalXp: number;
  level: number;
  streakDays: number;
  bestAnswerStreak: number;
  lastPracticeDate?: string;
  masteryPercent: number;
  bonusXp: number;
  createdAt: string;
  updatedAt: string;
};

export type ChallengeAttemptRecord = {
  id: string;
  userId: StorageUserId;
  challengeId: string;
  moduleId: ModuleId;
  attemptNumber: number;
  correct: boolean;
  firstTry: boolean;
  scorePercent: number;
  xpEarned: number;
  weakTags: string[];
  metadata?: Record<string, string | number | boolean>;
  attemptedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type UserBadgeRecord = {
  id: string;
  userId: StorageUserId;
  badgeId: string;
  earnedAt: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Denormalized per-challenge bests — mirrors what challenge UIs write today.
 * Supabase can derive these from attempts or store in a materialized view later.
 */
export type ChallengeMetricsRecord = {
  userId: StorageUserId;
  challengeId: string;
  bestMasteryPercent: number;
  bestScorePercent: number;
  bestStreak: number;
  readinessScore: number;
  unlocked: boolean;
  earnedBadgeIds: string[];
  updatedAt: string;
};

export type JournalEntryLineRecord = {
  id: string;
  journalEntryId: string;
  accountId: string;
  debitCents: number;
  creditCents: number;
  memo?: string;
  lineOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type JournalEntryRecord = {
  id: string;
  userId: StorageUserId;
  entryDate: string;
  description: string;
  transactionId?: string;
  source: JournalEntrySource;
  createdAt: string;
  updatedAt: string;
};

export type SavedReportRecord = {
  id: string;
  userId: StorageUserId;
  reportType: ReportType;
  title: string;
  asOfDate?: string;
  periodStart?: string;
  periodEnd?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Query options
// ---------------------------------------------------------------------------

export type ListChallengeAttemptsOptions = {
  challengeId?: string;
  limit?: number;
};

export type UpsertChallengeMetricsInput = {
  userId: StorageUserId;
  challengeId: string;
  bestMasteryPercent?: number;
  bestScorePercent?: number;
  bestStreak?: number;
  readinessScore?: number;
  unlocked?: boolean;
  earnedBadgeIds?: string[];
};

export type SaveJournalEntryInput = {
  entry: Omit<JournalEntryRecord, "createdAt" | "updatedAt">;
  lines: Array<
    Omit<JournalEntryLineRecord, "journalEntryId" | "createdAt" | "updatedAt">
  >;
};

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

/**
 * Persistence contract for all user-owned data.
 * Implementations: localStorageAdapter (now), supabaseAdapter (future).
 */
export type StorageAdapter = {
  readonly kind: "local" | "supabase";

  getCurrentUserId(): StorageUserId;

  // Profile
  getProfile(userId: StorageUserId): Promise<ProfileRecord | null>;
  upsertProfile(
    profile: Pick<ProfileRecord, "id"> &
      Partial<Omit<ProfileRecord, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ProfileRecord>;

  // Aggregated progress
  getUserProgress(userId: StorageUserId): Promise<UserProgressRecord | null>;
  upsertUserProgress(
    progress: Pick<UserProgressRecord, "userId"> &
      Partial<Omit<UserProgressRecord, "userId" | "createdAt" | "updatedAt">>,
  ): Promise<UserProgressRecord>;

  // Challenge attempts
  listChallengeAttempts(
    userId: StorageUserId,
    options?: ListChallengeAttemptsOptions,
  ): Promise<ChallengeAttemptRecord[]>;
  saveChallengeAttempt(
    attempt: Omit<ChallengeAttemptRecord, "createdAt" | "updatedAt">,
  ): Promise<ChallengeAttemptRecord>;

  // Badges earned
  listUserBadges(userId: StorageUserId): Promise<UserBadgeRecord[]>;
  awardBadge(
    userId: StorageUserId,
    badgeId: string,
    earnedAt?: string,
  ): Promise<UserBadgeRecord>;

  // Per-challenge bests (localStorage-backed metrics today)
  getChallengeMetrics(
    userId: StorageUserId,
    challengeId: string,
  ): Promise<ChallengeMetricsRecord | null>;
  upsertChallengeMetrics(
    input: UpsertChallengeMetricsInput,
  ): Promise<ChallengeMetricsRecord>;

  // Practice ledger
  listJournalEntries(userId: StorageUserId): Promise<JournalEntryRecord[]>;
  getJournalEntryLines(journalEntryId: string): Promise<JournalEntryLineRecord[]>;
  saveJournalEntry(input: SaveJournalEntryInput): Promise<JournalEntryRecord>;
  deleteJournalEntry(userId: StorageUserId, journalEntryId: string): Promise<void>;

  // Saved report snapshots
  listSavedReports(userId: StorageUserId): Promise<SavedReportRecord[]>;
  saveReport(
    report: Omit<SavedReportRecord, "createdAt" | "updatedAt">,
  ): Promise<SavedReportRecord>;
  deleteSavedReport(userId: StorageUserId, reportId: string): Promise<void>;
};
