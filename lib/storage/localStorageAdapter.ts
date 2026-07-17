/**
 * localStorage implementation of StorageAdapter.
 * Uses a versioned JSON document plus legacy per-key writes for backward compatibility.
 */

import type {
  ChallengeAttemptRecord,
  ChallengeMetricsRecord,
  JournalEntryLineRecord,
  JournalEntryRecord,
  ProfileRecord,
  SavedReportRecord,
  StorageAdapter,
  StorageUserId,
  UpsertChallengeMetricsInput,
  UserBadgeRecord,
  UserProgressRecord,
} from "@/lib/storage/types";

export const LOCAL_USER_ID = "local-user";

const STORAGE_VERSION = 1;
const DOCUMENT_KEY = `ledger-quest:v${STORAGE_VERSION}:${LOCAL_USER_ID}`;

/** Legacy keys still read/written for users with existing browser data. */
const LEGACY_KEYS = {
  accountSorterMastery: "ledger-quest-mastery-account-sorter",
  reportsRoomUnlocked: "ledger-quest-unlock-reports-room",
  accountSorterBestStreak: "ledger-quest-account-sorter-streak",
  insightDetectiveBestScore: "ledger-quest-insight-detective-score",
  insightDetectiveBadgeEarned: "ledger-quest-badge-insight-detective",
  yearEndBossMastery: "ledger-quest-year-end-boss-mastery",
  yearEndBossReadiness: "ledger-quest-year-end-boss-readiness",
  yearEndBossBadges: "ledger-quest-year-end-boss-badges",
} as const;

const CHALLENGE_IDS = {
  accountSorter: "challenge-sort-accounts",
  insightDetective: "challenge-insight-detective",
  yearEndBoss: "challenge-year-end-boss",
} as const;

type StorageDocument = {
  version: number;
  profile: ProfileRecord | null;
  userProgress: UserProgressRecord | null;
  challengeAttempts: ChallengeAttemptRecord[];
  userBadges: UserBadgeRecord[];
  challengeMetrics: Record<string, ChallengeMetricsRecord>;
  journalEntries: JournalEntryRecord[];
  journalEntryLines: JournalEntryLineRecord[];
  savedReports: SavedReportRecord[];
};

function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyDocument(): StorageDocument {
  return {
    version: STORAGE_VERSION,
    profile: null,
    userProgress: null,
    challengeAttempts: [],
    userBadges: [],
    challengeMetrics: {},
    journalEntries: [],
    journalEntryLines: [],
    savedReports: [],
  };
}

function readDocument(): StorageDocument {
  const storage = safeLocalStorage();
  if (!storage) return emptyDocument();

  const raw = storage.getItem(DOCUMENT_KEY);
  if (!raw) {
    const doc = emptyDocument();
    migrateLegacyKeys(doc);
    writeDocument(doc);
    return doc;
  }

  try {
    const parsed = JSON.parse(raw) as StorageDocument;
    const doc = {
      ...emptyDocument(),
      ...parsed,
      challengeMetrics: parsed.challengeMetrics ?? {},
      challengeAttempts: parsed.challengeAttempts ?? [],
      userBadges: parsed.userBadges ?? [],
      journalEntries: parsed.journalEntries ?? [],
      journalEntryLines: parsed.journalEntryLines ?? [],
      savedReports: parsed.savedReports ?? [],
    };
    supplementFromLegacyKeys(doc);
    return doc;
  } catch {
    const doc = emptyDocument();
    migrateLegacyKeys(doc);
    writeDocument(doc);
    return doc;
  }
}

function writeDocument(doc: StorageDocument): void {
  const storage = safeLocalStorage();
  if (!storage) return;
  storage.setItem(DOCUMENT_KEY, JSON.stringify(doc));
}

function migrateLegacyKeys(doc: StorageDocument): void {
  supplementFromLegacyKeys(doc);
  writeDocument(doc);
}

function supplementFromLegacyKeys(doc: StorageDocument): void {
  const storage = safeLocalStorage();
  if (!storage) return;

  const sorterMastery = Number(storage.getItem(LEGACY_KEYS.accountSorterMastery) ?? 0);
  const sorterStreak = Number(storage.getItem(LEGACY_KEYS.accountSorterBestStreak) ?? 0);
  const insightScore = Number(storage.getItem(LEGACY_KEYS.insightDetectiveBestScore) ?? 0);
  const yearEndMastery = Number(storage.getItem(LEGACY_KEYS.yearEndBossMastery) ?? 0);
  const yearEndReadiness = Number(storage.getItem(LEGACY_KEYS.yearEndBossReadiness) ?? 0);
  const reportsUnlocked = storage.getItem(LEGACY_KEYS.reportsRoomUnlocked) === "true";
  const insightBadge = storage.getItem(LEGACY_KEYS.insightDetectiveBadgeEarned) === "true";

  let yearEndBadges: string[] = [];
  try {
    const parsed = JSON.parse(storage.getItem(LEGACY_KEYS.yearEndBossBadges) ?? "[]") as string[];
    yearEndBadges = Array.isArray(parsed) ? parsed : [];
  } catch {
    yearEndBadges = [];
  }

  const timestamp = nowIso();

  if (sorterMastery > 0 || sorterStreak > 0 || reportsUnlocked) {
    const existing =
      doc.challengeMetrics[CHALLENGE_IDS.accountSorter] ??
      defaultMetrics(LOCAL_USER_ID, CHALLENGE_IDS.accountSorter);
    doc.challengeMetrics[CHALLENGE_IDS.accountSorter] = {
      ...existing,
      bestMasteryPercent: Math.max(existing.bestMasteryPercent, sorterMastery),
      bestStreak: Math.max(existing.bestStreak, sorterStreak),
      unlocked: existing.unlocked || reportsUnlocked || sorterMastery >= 80,
      updatedAt: timestamp,
    };
  }

  if (insightScore > 0 || insightBadge) {
    const existing =
      doc.challengeMetrics[CHALLENGE_IDS.insightDetective] ??
      defaultMetrics(LOCAL_USER_ID, CHALLENGE_IDS.insightDetective);
    doc.challengeMetrics[CHALLENGE_IDS.insightDetective] = {
      ...existing,
      bestScorePercent: Math.max(existing.bestScorePercent, insightScore),
      earnedBadgeIds: insightBadge
        ? [...new Set([...existing.earnedBadgeIds, "insight-detective"])]
        : existing.earnedBadgeIds,
      updatedAt: timestamp,
    };
  }

  if (yearEndMastery > 0 || yearEndReadiness > 0 || yearEndBadges.length > 0) {
    const existing =
      doc.challengeMetrics[CHALLENGE_IDS.yearEndBoss] ??
      defaultMetrics(LOCAL_USER_ID, CHALLENGE_IDS.yearEndBoss);
    doc.challengeMetrics[CHALLENGE_IDS.yearEndBoss] = {
      ...existing,
      bestMasteryPercent: Math.max(existing.bestMasteryPercent, yearEndMastery),
      readinessScore: Math.max(existing.readinessScore, yearEndReadiness),
      earnedBadgeIds: [...new Set([...existing.earnedBadgeIds, ...yearEndBadges])],
      updatedAt: timestamp,
    };
  }

  if (insightBadge) {
    const exists = doc.userBadges.some(
      (b) => b.userId === LOCAL_USER_ID && b.badgeId === "insight-detective",
    );
    if (!exists) {
      const earnedAt = timestamp;
      doc.userBadges.push({
        id: newId(),
        userId: LOCAL_USER_ID,
        badgeId: "insight-detective",
        earnedAt,
        createdAt: earnedAt,
        updatedAt: earnedAt,
      });
    }
  }
}

function syncLegacyKeys(metrics: ChallengeMetricsRecord): void {
  const storage = safeLocalStorage();
  if (!storage) return;

  switch (metrics.challengeId) {
    case CHALLENGE_IDS.accountSorter:
      storage.setItem(LEGACY_KEYS.accountSorterMastery, String(metrics.bestMasteryPercent));
      storage.setItem(LEGACY_KEYS.accountSorterBestStreak, String(metrics.bestStreak));
      if (metrics.unlocked) {
        storage.setItem(LEGACY_KEYS.reportsRoomUnlocked, "true");
      }
      break;
    case CHALLENGE_IDS.insightDetective:
      storage.setItem(
        LEGACY_KEYS.insightDetectiveBestScore,
        String(metrics.bestScorePercent),
      );
      if (metrics.earnedBadgeIds.includes("insight-detective")) {
        storage.setItem(LEGACY_KEYS.insightDetectiveBadgeEarned, "true");
      }
      break;
    case CHALLENGE_IDS.yearEndBoss:
      storage.setItem(LEGACY_KEYS.yearEndBossMastery, String(metrics.bestMasteryPercent));
      storage.setItem(LEGACY_KEYS.yearEndBossReadiness, String(metrics.readinessScore));
      storage.setItem(
        LEGACY_KEYS.yearEndBossBadges,
        JSON.stringify(metrics.earnedBadgeIds),
      );
      break;
    default:
      break;
  }
}

function defaultMetrics(
  userId: StorageUserId,
  challengeId: string,
): ChallengeMetricsRecord {
  return {
    userId,
    challengeId,
    bestMasteryPercent: 0,
    bestScorePercent: 0,
    bestStreak: 0,
    readinessScore: 0,
    unlocked: false,
    earnedBadgeIds: [],
    updatedAt: nowIso(),
  };
}

function defaultProfile(userId: StorageUserId): ProfileRecord {
  const timestamp = nowIso();
  return {
    id: userId,
    businessName: "Bright Path Consulting",
    currency: "CAD",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function defaultUserProgress(userId: StorageUserId): UserProgressRecord {
  const timestamp = nowIso();
  return {
    id: newId(),
    userId,
    totalXp: 0,
    level: 1,
    streakDays: 0,
    bestAnswerStreak: 0,
    masteryPercent: 0,
    bonusXp: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const localStorageAdapter: StorageAdapter = {
  kind: "local",

  getCurrentUserId(): StorageUserId {
    return LOCAL_USER_ID;
  },

  async getProfile(userId) {
    const doc = readDocument();
    return doc.profile ?? (userId === LOCAL_USER_ID ? defaultProfile(userId) : null);
  },

  async upsertProfile(profile) {
    const doc = readDocument();
    const timestamp = nowIso();
    const existing = doc.profile ?? defaultProfile(profile.id);
    doc.profile = {
      ...existing,
      ...profile,
      updatedAt: timestamp,
    };
    writeDocument(doc);
    return doc.profile;
  },

  async getUserProgress(userId) {
    const doc = readDocument();
    return doc.userProgress ?? (userId === LOCAL_USER_ID ? defaultUserProgress(userId) : null);
  },

  async upsertUserProgress(progress) {
    const doc = readDocument();
    const timestamp = nowIso();
    const existing = doc.userProgress ?? defaultUserProgress(progress.userId);
    doc.userProgress = {
      ...existing,
      ...progress,
      updatedAt: timestamp,
    };
    writeDocument(doc);
    return doc.userProgress;
  },

  async listChallengeAttempts(userId, options = {}) {
    const doc = readDocument();
    let attempts = doc.challengeAttempts.filter((a) => a.userId === userId);
    if (options.challengeId) {
      attempts = attempts.filter((a) => a.challengeId === options.challengeId);
    }
    attempts.sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
    if (options.limit) {
      attempts = attempts.slice(0, options.limit);
    }
    return attempts;
  },

  async saveChallengeAttempt(attempt) {
    const doc = readDocument();
    const timestamp = nowIso();
    const record: ChallengeAttemptRecord = {
      ...attempt,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    doc.challengeAttempts.push(record);
    writeDocument(doc);
    return record;
  },

  async listUserBadges(userId) {
    const doc = readDocument();
    return doc.userBadges.filter((b) => b.userId === userId);
  },

  async awardBadge(userId, badgeId, earnedAt) {
    const doc = readDocument();
    const existing = doc.userBadges.find(
      (b) => b.userId === userId && b.badgeId === badgeId,
    );
    if (existing) return existing;

    const timestamp = earnedAt ?? nowIso();
    const record: UserBadgeRecord = {
      id: newId(),
      userId,
      badgeId,
      earnedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    doc.userBadges.push(record);
    writeDocument(doc);
    return record;
  },

  async getChallengeMetrics(userId, challengeId) {
    const doc = readDocument();
    return doc.challengeMetrics[challengeId] ?? null;
  },

  async upsertChallengeMetrics(input) {
    const doc = readDocument();
    const timestamp = nowIso();
    const existing =
      doc.challengeMetrics[input.challengeId] ??
      defaultMetrics(input.userId, input.challengeId);

    const merged: ChallengeMetricsRecord = {
      ...existing,
      userId: input.userId,
      challengeId: input.challengeId,
      bestMasteryPercent: Math.max(
        existing.bestMasteryPercent,
        input.bestMasteryPercent ?? 0,
      ),
      bestScorePercent: Math.max(
        existing.bestScorePercent,
        input.bestScorePercent ?? 0,
      ),
      bestStreak: Math.max(existing.bestStreak, input.bestStreak ?? 0),
      readinessScore: Math.max(existing.readinessScore, input.readinessScore ?? 0),
      unlocked: input.unlocked ?? existing.unlocked,
      earnedBadgeIds: input.earnedBadgeIds
        ? [...new Set([...existing.earnedBadgeIds, ...input.earnedBadgeIds])]
        : existing.earnedBadgeIds,
      updatedAt: timestamp,
    };

    doc.challengeMetrics[input.challengeId] = merged;
    writeDocument(doc);
    syncLegacyKeys(merged);
    return merged;
  },

  async listJournalEntries(userId) {
    const doc = readDocument();
    return doc.journalEntries.filter((e) => e.userId === userId);
  },

  async getJournalEntryLines(journalEntryId) {
    const doc = readDocument();
    return doc.journalEntryLines
      .filter((l) => l.journalEntryId === journalEntryId)
      .sort((a, b) => a.lineOrder - b.lineOrder);
  },

  async saveJournalEntry(input) {
    const doc = readDocument();
    const timestamp = nowIso();
    const entry: JournalEntryRecord = {
      ...input.entry,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    doc.journalEntries = doc.journalEntries.filter((e) => e.id !== entry.id);
    doc.journalEntryLines = doc.journalEntryLines.filter(
      (l) => l.journalEntryId !== entry.id,
    );

    doc.journalEntries.push(entry);
    for (const [index, line] of input.lines.entries()) {
      doc.journalEntryLines.push({
        ...line,
        journalEntryId: entry.id,
        lineOrder: line.lineOrder ?? index,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    writeDocument(doc);
    return entry;
  },

  async deleteJournalEntry(userId, journalEntryId) {
    const doc = readDocument();
    doc.journalEntries = doc.journalEntries.filter(
      (e) => !(e.id === journalEntryId && e.userId === userId),
    );
    doc.journalEntryLines = doc.journalEntryLines.filter(
      (l) => l.journalEntryId !== journalEntryId,
    );
    writeDocument(doc);
  },

  async listSavedReports(userId) {
    const doc = readDocument();
    return doc.savedReports.filter((r) => r.userId === userId);
  },

  async saveReport(report) {
    const doc = readDocument();
    const timestamp = nowIso();
    const record: SavedReportRecord = {
      ...report,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    doc.savedReports = doc.savedReports.filter((r) => r.id !== record.id);
    doc.savedReports.push(record);
    writeDocument(doc);
    return record;
  },

  async deleteSavedReport(userId, reportId) {
    const doc = readDocument();
    doc.savedReports = doc.savedReports.filter(
      (r) => !(r.id === reportId && r.userId === userId),
    );
    writeDocument(doc);
  },
};

// ---------------------------------------------------------------------------
// Synchronous helpers for client-only call sites (progress-storage facade).
// Supabase adapter will replace these with async hooks / server actions.
// ---------------------------------------------------------------------------

export function syncGetChallengeMetrics(
  challengeId: string,
): ChallengeMetricsRecord | null {
  const doc = readDocument();
  return doc.challengeMetrics[challengeId] ?? null;
}

export function syncUpsertChallengeMetrics(
  input: UpsertChallengeMetricsInput,
): ChallengeMetricsRecord {
  const doc = readDocument();
  const timestamp = nowIso();
  const existing =
    doc.challengeMetrics[input.challengeId] ??
    defaultMetrics(input.userId, input.challengeId);

  const merged: ChallengeMetricsRecord = {
    ...existing,
    userId: input.userId,
    challengeId: input.challengeId,
    bestMasteryPercent: Math.max(
      existing.bestMasteryPercent,
      input.bestMasteryPercent ?? 0,
    ),
    bestScorePercent: Math.max(
      existing.bestScorePercent,
      input.bestScorePercent ?? 0,
    ),
    bestStreak: Math.max(existing.bestStreak, input.bestStreak ?? 0),
    readinessScore: Math.max(existing.readinessScore, input.readinessScore ?? 0),
    unlocked: input.unlocked ?? existing.unlocked,
    earnedBadgeIds: input.earnedBadgeIds
      ? [...new Set([...existing.earnedBadgeIds, ...input.earnedBadgeIds])]
      : existing.earnedBadgeIds,
    updatedAt: timestamp,
  };

  doc.challengeMetrics[input.challengeId] = merged;
  writeDocument(doc);
  syncLegacyKeys(merged);
  return merged;
}

export function syncHasUserBadge(badgeId: string): boolean {
  const doc = readDocument();
  return doc.userBadges.some(
    (b) => b.userId === LOCAL_USER_ID && b.badgeId === badgeId,
  );
}

export function syncAwardUserBadge(badgeId: string): void {
  const doc = readDocument();
  if (doc.userBadges.some((b) => b.userId === LOCAL_USER_ID && b.badgeId === badgeId)) {
    return;
  }
  const timestamp = nowIso();
  doc.userBadges.push({
    id: newId(),
    userId: LOCAL_USER_ID,
    badgeId,
    earnedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  writeDocument(doc);
}
