import { describe, expect, it } from "vitest";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { brightPathJune2024Entries } from "@/lib/data/sampleJournalEntries";
import {
  explainTrialBalance,
  formatTrialBalanceRows,
  generateTrialBalance,
  getAccountBalance,
  validateTrialBalance,
} from "@/lib/accounting/trialBalance";
import type { JournalEntryLike } from "@/lib/accounting/journalValidation";

describe("getAccountBalance", () => {
  it("returns zero for an account with no activity", () => {
    const balance = getAccountBalance("inventory", brightPathJune2024Entries);
    expect(balance.netCents).toBe(0);
    expect(balance.totalDebitsCents).toBe(0);
  });

  it("sums bank-cash activity across entries", () => {
    const balance = getAccountBalance("bank-cash", brightPathJune2024Entries);
    expect(balance.totalDebitsCents).toBeGreaterThan(0);
    expect(balance.netCents).toBe(
      balance.totalDebitsCents - balance.totalCreditsCents,
    );
  });
});

describe("generateTrialBalance", () => {
  it("produces a balanced trial balance for Bright Path June entries", () => {
    const result = generateTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      { asOfDate: "2024-06-30", includeZeroBalanceAccounts: false },
    );
    expect(result.trialBalance.balanced).toBe(true);
    expect(result.trialBalance.totalDebitsCents).toBe(
      result.trialBalance.totalCreditsCents,
    );
    expect(result.unbalancedEntryIds).toHaveLength(0);
    expect(result.missingAccountIds).toHaveLength(0);
  });

  it("excludes accounts with no activity when configured", () => {
    const result = generateTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      { asOfDate: "2024-06-30", includeZeroBalanceAccounts: false },
    );
    const inventory = result.trialBalance.rows.find((r) => r.accountId === "inventory");
    expect(inventory).toBeUndefined();
  });

  it("includes zero-balance accounts when configured", () => {
    const result = generateTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      { asOfDate: "2024-06-30", includeZeroBalanceAccounts: true },
    );
    const inventory = result.trialBalance.rows.find((r) => r.accountId === "inventory");
    expect(inventory).toBeDefined();
    expect(inventory?.debitCents).toBe(0);
    expect(inventory?.creditCents).toBe(0);
  });

  it("skips unbalanced journal entries and warns", () => {
    const badEntry: JournalEntryLike = {
      id: "bad-entry",
      description: "Broken entry",
      lines: [
        { accountId: "bank-cash", debitCents: 100 },
        { accountId: "supplies", creditCents: 50 },
      ],
    };
    const result = generateTrialBalance(
      [badEntry],
      chartOfAccounts,
      { asOfDate: "2024-06-30" },
    );
    expect(result.unbalancedEntryIds).toContain("bad-entry");
    expect(result.warnings.some((w) => w.includes("out of balance"))).toBe(true);
    expect(result.trialBalance.totalDebitsCents).toBe(0);
  });

  it("warns on missing account ids", () => {
    const entry: JournalEntryLike = {
      id: "missing-acct",
      lines: [
        { accountId: "not-a-real-account", debitCents: 100 },
        { accountId: "bank-cash", creditCents: 100 },
      ],
    };
    const result = generateTrialBalance([entry], chartOfAccounts, {
      asOfDate: "2024-06-30",
    });
    expect(result.missingAccountIds).toContain("not-a-real-account");
    expect(result.warnings.some((w) => w.includes("unknown account"))).toBe(true);
  });
});

describe("formatTrialBalanceRows", () => {
  it("shows dash for empty columns and flags abnormal balances", () => {
    const result = generateTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      { asOfDate: "2024-06-30", includeZeroBalanceAccounts: false },
    );
    const formatted = formatTrialBalanceRows(result.trialBalance.rows);
    const bank = formatted.find((r) => r.accountId === "bank-cash");
    expect(bank?.hasActivity).toBe(true);
    expect(bank?.debitDisplay).not.toBe("—");
    expect(bank?.isAbnormalBalance).toBe(false);
  });
});

describe("validateTrialBalance", () => {
  it("detects out-of-balance totals", () => {
    const rows = [
      {
        accountId: "bank-cash",
        accountCode: "1000",
        accountName: "Bank/Cash",
        accountType: "asset" as const,
        accountSubType: "current_asset" as const,
        debitCents: 1000,
        creditCents: 0,
      },
      {
        accountId: "supplies",
        accountCode: "6100",
        accountName: "Supplies",
        accountType: "expense" as const,
        accountSubType: "operating_expense" as const,
        debitCents: 0,
        creditCents: 500,
      },
    ];
    const validation = validateTrialBalance(rows);
    expect(validation.balanced).toBe(false);
    expect(validation.abnormalRowCount).toBeGreaterThan(0);
  });
});

describe("explainTrialBalance", () => {
  it("explains a balanced trial balance in plain language", () => {
    const result = generateTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      { asOfDate: "2024-06-30", includeZeroBalanceAccounts: false },
    );
    const text = explainTrialBalance(result.trialBalance.rows);
    expect(text).toContain("balanced");
    expect(text.toLowerCase()).not.toBe("wrong");
    expect(text).toContain("debit");
  });

  it("explains empty trial balance", () => {
    const text = explainTrialBalance([]);
    expect(text).toContain("no account activity");
  });
});
