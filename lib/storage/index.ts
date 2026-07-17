/**
 * Application storage entry point.
 *
 * Import `storage` from here — never import localStorage directly in UI code.
 * Swap `localStorageAdapter` for `supabaseAdapter` when Supabase is connected.
 */

export type {
  ChallengeAttemptRecord,
  ChallengeMetricsRecord,
  JournalEntryLineRecord,
  JournalEntryRecord,
  ListChallengeAttemptsOptions,
  ProfileRecord,
  ReportType,
  SaveJournalEntryInput,
  SavedReportRecord,
  StorageAdapter,
  StorageUserId,
  UpsertChallengeMetricsInput,
  UserBadgeRecord,
  UserProgressRecord,
} from "@/lib/storage/types";

export {
  LOCAL_USER_ID,
  localStorageAdapter,
  syncAwardUserBadge,
  syncGetChallengeMetrics,
  syncHasUserBadge,
  syncUpsertChallengeMetrics,
} from "@/lib/storage/localStorageAdapter";

import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";

/** Active storage backend — replace with supabaseAdapter when ready. */
export const storage = localStorageAdapter;
