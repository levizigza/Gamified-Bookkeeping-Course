import { describe, expect, it } from "vitest";
import { doubleEntryDuelChallenge } from "@/lib/data/week1JournalChallenges";
import {
  builderLinesToJournalLines,
  gradeJournalEntry,
  type BuilderJournalLine,
} from "@/lib/game/journalScoring";

function buildLines(
  entries: { accountId: string; side: "debit" | "credit"; amountCents: number }[],
): BuilderJournalLine[] {
  return entries.map((e, i) => ({
    id: `line-${i}`,
    ...e,
  }));
}

describe("gradeJournalEntry", () => {
  it("awards full XP for a perfect consulting income deposit", () => {
    const scenario = doubleEntryDuelChallenge.scenarios[3];
    const lines = buildLines([
      { accountId: "bank-cash", side: "debit", amountCents: 420_000 },
      { accountId: "consulting-income", side: "credit", amountCents: 400_000 },
      { accountId: "gst-hst-payable", side: "credit", amountCents: 20_000 },
    ]);
    const result = gradeJournalEntry(lines, scenario);
    expect(result.isPerfect).toBe(true);
    expect(result.xpBreakdown.total).toBe(50);
    expect(result.balanced).toBe(true);
  });

  it("gives partial credit for balanced entry with wrong accounts", () => {
    const scenario = doubleEntryDuelChallenge.scenarios[6];
    const lines = buildLines([
      { accountId: "supplies", side: "debit", amountCents: 240_000 },
      { accountId: "bank-cash", side: "credit", amountCents: 240_000 },
    ]);
    const result = gradeJournalEntry(lines, scenario);
    expect(result.balanced).toBe(true);
    expect(result.xpBreakdown.balanced).toBe(10);
    expect(result.xpBreakdown.total).toBeLessThan(50);
    expect(result.whatToImprove.length).toBeGreaterThan(0);
  });

  it("gives zero balance XP when debits and credits differ", () => {
    const scenario = doubleEntryDuelChallenge.scenarios[2];
    const lines = buildLines([
      { accountId: "telephone-expense", side: "debit", amountCents: 9_500 },
      { accountId: "credit-card-payable", side: "credit", amountCents: 9_000 },
    ]);
    const result = gradeJournalEntry(lines, scenario);
    expect(result.balanced).toBe(false);
    expect(result.xpBreakdown.balanced).toBe(0);
  });

  it("includes owner-friendly explanation in feedback", () => {
    const scenario = doubleEntryDuelChallenge.scenarios[0];
    const lines = buildLines([
      { accountId: "bank-cash", side: "debit", amountCents: 500_000 },
      { accountId: "capital-stock", side: "credit", amountCents: 500_000 },
    ]);
    const result = gradeJournalEntry(lines, scenario);
    expect(result.ownerExplanation).toContain("owner");
    expect(result.correctEntrySummary.toLowerCase()).not.toBe("wrong");
  });

  it("validates all 8 scenarios have balanced expected entries", () => {
    for (const scenario of doubleEntryDuelChallenge.scenarios) {
      const journalLines = builderLinesToJournalLines(
        scenario.expectedLines.map((l, i) => ({
          id: `e-${i}`,
          accountId: l.accountId,
          side: l.debitCents > 0 ? "debit" as const : "credit" as const,
          amountCents: l.debitCents > 0 ? l.debitCents : l.creditCents,
        })),
      );
      const lines = buildLines(
        scenario.expectedLines.map((l) => ({
          accountId: l.accountId,
          side: l.debitCents > 0 ? "debit" as const : "credit" as const,
          amountCents: l.debitCents > 0 ? l.debitCents : l.creditCents,
        })),
      );
      const result = gradeJournalEntry(lines, scenario);
      expect(result.isPerfect).toBe(true);
      expect(journalLines.length).toBeGreaterThanOrEqual(2);
    }
  });
});
