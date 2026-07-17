import { describe, expect, it } from "vitest";
import { MODULE_UNLOCK_THRESHOLD } from "@/lib/game/constants";
import { evaluateModuleUnlocks, getUnlockMessage, isModuleUnlocked } from "@/lib/game/unlocks";
import { MOCK_PROGRESS_INPUT } from "@/lib/game/mockProgress";
import { makeAttempt, masteryAttemptsForModule } from "@/tests/helpers/fixtures";

describe("module unlock logic", () => {
  it("always unlocks week 1 (Daily Ledger)", () => {
    const unlocks = evaluateModuleUnlocks([]);
    expect(unlocks.find((u) => u.moduleId === "daily-ledger")?.unlocked).toBe(true);
  });

  it("locks week 2 until Daily Ledger mastery reaches 80%", () => {
    const belowThreshold = [
      makeAttempt({
        challengeId: "challenge-classify-transaction",
        moduleId: "daily-ledger",
        scorePercent: 75,
      }),
      makeAttempt({
        challengeId: "challenge-double-entry-duel",
        moduleId: "daily-ledger",
        scorePercent: 70,
      }),
    ];

    const unlocks = evaluateModuleUnlocks(belowThreshold);
    const accountSorter = unlocks.find((u) => u.moduleId === "account-sorter");
    expect(accountSorter?.unlocked).toBe(false);
    expect(accountSorter?.lockMessage).toContain(String(MODULE_UNLOCK_THRESHOLD));
    expect(accountSorter?.lockMessage).toContain("Daily Ledger");
  });

  it("unlocks Account Sorter when Daily Ledger mastery is 80% or higher", () => {
    const attempts = masteryAttemptsForModule("daily-ledger", 85);
    expect(isModuleUnlocked("account-sorter", attempts)).toBe(true);
  });

  it("unlocks Reports Room when Account Sorter mastery is 80% or higher", () => {
    const attempts = [
      ...masteryAttemptsForModule("daily-ledger", 90),
      ...masteryAttemptsForModule("account-sorter", 80),
    ];
    expect(isModuleUnlocked("reports-room", attempts)).toBe(true);
  });

  it("unlocks Year-End Boss when Reports Room mastery is 80% or higher", () => {
    const attempts = [
      ...masteryAttemptsForModule("daily-ledger", 90),
      ...masteryAttemptsForModule("account-sorter", 85),
      ...masteryAttemptsForModule("reports-room", 82),
    ];
    expect(isModuleUnlocked("year-end-boss", attempts)).toBe(true);
  });

  it("keeps later weeks locked when an intermediate module is below threshold", () => {
    const attempts = [
      ...masteryAttemptsForModule("daily-ledger", 95),
      ...masteryAttemptsForModule("account-sorter", 60),
    ];

    const unlocks = evaluateModuleUnlocks(attempts);
    expect(unlocks.find((u) => u.moduleId === "reports-room")?.unlocked).toBe(false);
    expect(unlocks.find((u) => u.moduleId === "year-end-boss")?.unlocked).toBe(false);
  });

  it("uses mock progress to keep week 2 locked below threshold", () => {
    const unlocks = evaluateModuleUnlocks(MOCK_PROGRESS_INPUT.attempts);
    expect(unlocks.find((u) => u.moduleId === "account-sorter")?.unlocked).toBe(false);
  });

  it("formats unlock messages for the UI", () => {
    expect(getUnlockMessage("account-sorter", "Daily Ledger")).toContain("80%");
    expect(getUnlockMessage("account-sorter", "Daily Ledger")).toContain("Daily Ledger");
  });
});
