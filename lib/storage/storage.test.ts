import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  LOCAL_USER_ID,
  localStorageAdapter,
  syncGetChallengeMetrics,
  syncUpsertChallengeMetrics,
} from "@/lib/storage/localStorageAdapter";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe("localStorageAdapter", () => {
  let memoryStorage: Storage;

  beforeEach(() => {
    memoryStorage = createMemoryStorage();
    vi.stubGlobal("localStorage", memoryStorage);
    vi.stubGlobal("window", { localStorage: memoryStorage });
  });

  it("returns the local user id", () => {
    expect(localStorageAdapter.getCurrentUserId()).toBe(LOCAL_USER_ID);
  });

  it("stores and retrieves challenge metrics", () => {
    syncUpsertChallengeMetrics({
      userId: LOCAL_USER_ID,
      challengeId: "challenge-sort-accounts",
      bestMasteryPercent: 72,
      bestStreak: 3,
    });

    const metrics = syncGetChallengeMetrics("challenge-sort-accounts");
    expect(metrics?.bestMasteryPercent).toBe(72);
    expect(metrics?.bestStreak).toBe(3);
  });

  it("keeps best-so-far values on upsert", () => {
    syncUpsertChallengeMetrics({
      userId: LOCAL_USER_ID,
      challengeId: "challenge-insight-detective",
      bestScorePercent: 60,
    });
    syncUpsertChallengeMetrics({
      userId: LOCAL_USER_ID,
      challengeId: "challenge-insight-detective",
      bestScorePercent: 45,
    });

    expect(syncGetChallengeMetrics("challenge-insight-detective")?.bestScorePercent).toBe(60);
  });

  it("migrates legacy localStorage keys on first read", () => {
    memoryStorage.setItem("ledger-quest-mastery-account-sorter", "85");
    memoryStorage.setItem("ledger-quest-unlock-reports-room", "true");

    const metrics = syncGetChallengeMetrics("challenge-sort-accounts");
    expect(metrics?.bestMasteryPercent).toBe(85);
    expect(metrics?.unlocked).toBe(true);
  });

  it("saves challenge attempts via async adapter", async () => {
    const attempt = await localStorageAdapter.saveChallengeAttempt({
      id: "att-test",
      userId: LOCAL_USER_ID,
      challengeId: "challenge-sort-accounts",
      moduleId: "account-sorter",
      attemptNumber: 1,
      correct: true,
      firstTry: true,
      scorePercent: 90,
      xpEarned: 100,
      weakTags: [],
      attemptedAt: new Date().toISOString(),
    });

    const listed = await localStorageAdapter.listChallengeAttempts(LOCAL_USER_ID);
    expect(listed).toHaveLength(1);
    expect(listed[0].id).toBe(attempt.id);
  });
});
