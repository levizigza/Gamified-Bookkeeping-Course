import { describe, expect, it } from "vitest";
import type { JournalLine } from "@/lib/types/accounting";
import {
  calculateCredits,
  calculateDebits,
  explainJournalEntry,
  isBalanced,
  JOURNAL_ENTRY_EXAMPLES,
  suggestCorrection,
  validateJournalEntry,
} from "@/lib/accounting/journalValidation";

function makeEntry(lines: JournalLine[], description = "Test entry") {
  return { lines, description };
}

describe("calculateDebits / calculateCredits", () => {
  it("sums debits in cents for buying supplies with cash", () => {
    const entry = JOURNAL_ENTRY_EXAMPLES.buyingSuppliesWithCash;
    expect(calculateDebits(entry)).toBe(8_000);
    expect(calculateCredits(entry)).toBe(8_000);
  });

  it("sums three-line consulting deposit with GST", () => {
    const entry = JOURNAL_ENTRY_EXAMPLES.receivingConsultingIncomeByDeposit;
    expect(calculateDebits(entry)).toBe(420_000);
    expect(calculateCredits(entry)).toBe(420_000);
  });
});

describe("isBalanced", () => {
  it("returns true for balanced examples", () => {
    expect(isBalanced(JOURNAL_ENTRY_EXAMPLES.buyingSuppliesWithCash)).toBe(true);
    expect(isBalanced(JOURNAL_ENTRY_EXAMPLES.payingTelephoneByCreditCard)).toBe(true);
    expect(isBalanced(JOURNAL_ENTRY_EXAMPLES.buyingEquipment)).toBe(true);
    expect(isBalanced(JOURNAL_ENTRY_EXAMPLES.recordingSalesTaxPayable)).toBe(true);
    expect(isBalanced(JOURNAL_ENTRY_EXAMPLES.payingALiability)).toBe(true);
  });

  it("returns false when debits and credits differ", () => {
    const unbalanced = makeEntry([
      { accountId: "supplies", debitCents: 8_000 },
      { accountId: "bank-cash", creditCents: 7_000 },
    ]);
    expect(isBalanced(unbalanced)).toBe(false);
  });

  it("returns false for a single line", () => {
    const single = makeEntry([{ accountId: "supplies", debitCents: 100 }]);
    expect(isBalanced(single)).toBe(false);
  });
});

describe("validateJournalEntry", () => {
  it("accepts all six teaching examples", () => {
    for (const example of Object.values(JOURNAL_ENTRY_EXAMPLES)) {
      const result = validateJournalEntry(example);
      expect(result.ok).toBe(true);
    }
  });

  it("rejects fewer than two lines with a helpful message", () => {
    const result = validateJournalEntry(
      makeEntry([{ accountId: "bank-cash", debitCents: 100 }]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0].code).toBe("MIN_LINES");
      expect(result.errors[0].message).toContain("at least two lines");
      expect(result.errors[0].message).not.toBe("wrong");
    }
  });

  it("rejects a line with both debit and credit", () => {
    const result = validateJournalEntry(
      makeEntry([
        { accountId: "supplies", debitCents: 500, creditCents: 500 } as JournalLine,
        { accountId: "bank-cash", creditCents: 500 },
      ]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === "BOTH_SIDES")).toBe(true);
      expect(result.errors[0].message).toContain("one side per line");
    }
  });

  it("explains how much to adjust when unbalanced", () => {
    const result = validateJournalEntry(
      makeEntry([
        { accountId: "telephone-expense", debitCents: 9_500 },
        { accountId: "credit-card-payable", creditCents: 9_000 },
      ]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const balanceError = result.errors.find((e) => e.code === "UNBALANCED");
      expect(balanceError?.message).toContain("$5.00");
      expect(balanceError?.message).toContain("out of balance");
    }
  });

  it("rejects empty lines", () => {
    const result = validateJournalEntry(
      makeEntry([
        { accountId: "supplies", debitCents: 0, creditCents: 0 } as JournalLine,
        { accountId: "bank-cash", creditCents: 100 },
      ]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === "ZERO_AMOUNT")).toBe(true);
    }
  });
});

describe("explainJournalEntry", () => {
  it("describes buying supplies with cash in plain language", () => {
    const text = explainJournalEntry(JOURNAL_ENTRY_EXAMPLES.buyingSuppliesWithCash);
    expect(text).toContain("Office supplies paid with cash");
    expect(text).toContain("Supplies");
    expect(text).toContain("Bank/Cash");
    expect(text).toContain("balanced");
  });

  it("describes paying telephone by credit card", () => {
    const text = explainJournalEntry(JOURNAL_ENTRY_EXAMPLES.payingTelephoneByCreditCard);
    expect(text).toContain("Telephone Expense");
    expect(text).toContain("Credit Card Payable");
    expect(text).toContain("double-entry");
  });

  it("describes consulting income deposit with GST lines", () => {
    const text = explainJournalEntry(
      JOURNAL_ENTRY_EXAMPLES.receivingConsultingIncomeByDeposit,
    );
    expect(text).toContain("Consulting Income");
    expect(text).toContain("GST/HST Payable");
    expect(text).toContain("$4,200.00");
  });

  it("describes buying equipment as a balanced asset purchase", () => {
    const text = explainJournalEntry(JOURNAL_ENTRY_EXAMPLES.buyingEquipment);
    expect(text).toContain("Equipment");
    expect(text).toContain("Laptop");
  });

  it("describes sales tax payable on an invoice", () => {
    const text = explainJournalEntry(JOURNAL_ENTRY_EXAMPLES.recordingSalesTaxPayable);
    expect(text).toContain("Accounts Receivable");
    expect(text).toContain("GST/HST Payable");
  });

  it("describes paying a liability from bank", () => {
    const text = explainJournalEntry(JOURNAL_ENTRY_EXAMPLES.payingALiability);
    expect(text).toContain("Credit Card Payable");
    expect(text).toContain("Paying the business credit card");
  });

  it("explains validation problems instead of saying 'wrong'", () => {
    const text = explainJournalEntry(
      makeEntry([{ accountId: "bank-cash", debitCents: 100 }]),
    );
    expect(text.toLowerCase()).not.toBe("wrong");
    expect(text).toContain("at least");
  });
});

describe("suggestCorrection", () => {
  const expected = JOURNAL_ENTRY_EXAMPLES.buyingSuppliesWithCash;

  it("returns praise when entries match", () => {
    const suggestion = suggestCorrection(expected, expected);
    expect(suggestion.differences).toHaveLength(0);
    expect(suggestion.summary).toContain("matches");
  });

  it("suggests fixing a wrong amount on supplies", () => {
    const actual = makeEntry([
      { accountId: "supplies", debitCents: 7_000 },
      { accountId: "bank-cash", creditCents: 7_000 },
    ]);
    const suggestion = suggestCorrection(actual, expected);
    expect(suggestion.differences.some((d) => d.kind === "wrong_amount")).toBe(true);
    expect(suggestion.summary).not.toBe("wrong");
    expect(suggestion.steps.join(" ")).toContain("$80.00");
  });

  it("suggests adding a missing bank credit line", () => {
    const singleLine = makeEntry([{ accountId: "supplies", debitCents: 8_000 }]);
    const suggestion = suggestCorrection(singleLine, expected);
    expect(suggestion.differences.some((d) => d.kind === "missing_line")).toBe(true);
    expect(suggestion.steps.join(" ")).toContain("Bank/Cash");
  });

  it("suggests swapping wrong side for telephone expense", () => {
    const expectedPhone = JOURNAL_ENTRY_EXAMPLES.payingTelephoneByCreditCard;
    const actual = makeEntry([
      { accountId: "telephone-expense", creditCents: 9_500 },
      { accountId: "credit-card-payable", debitCents: 9_500 },
    ]);
    const suggestion = suggestCorrection(actual, expectedPhone);
    expect(
      suggestion.differences.some(
        (d) => d.kind === "wrong_side" || d.kind === "missing_line",
      ),
    ).toBe(true);
    expect(suggestion.steps.join(" ")).toMatch(/debit|credit/i);
  });

  it("flags unbalanced consulting income entry", () => {
    const expectedDeposit = JOURNAL_ENTRY_EXAMPLES.receivingConsultingIncomeByDeposit;
    const actual = makeEntry([
      { accountId: "bank-cash", debitCents: 420_000 },
      { accountId: "consulting-income", creditCents: 400_000 },
      { accountId: "gst-hst-payable", creditCents: 15_000 },
    ]);
    const suggestion = suggestCorrection(actual, expectedDeposit);
    expect(
      suggestion.differences.some((d) => d.kind === "unbalanced" || d.kind === "wrong_amount"),
    ).toBe(true);
  });

  it("suggests corrections for equipment purchase with extra wrong account", () => {
    const expectedEquip = JOURNAL_ENTRY_EXAMPLES.buyingEquipment;
    const actual = makeEntry([
      { accountId: "supplies", debitCents: 240_000 },
      { accountId: "bank-cash", creditCents: 240_000 },
    ]);
    const suggestion = suggestCorrection(actual, expectedEquip);
    expect(
      suggestion.differences.some(
        (d) => d.kind === "missing_line" || d.kind === "extra_line" || d.kind === "wrong_account",
      ),
    ).toBe(true);
    expect(suggestion.steps.join(" ")).toContain("Equipment");
  });

  it("guides paying liability when accounts are on the wrong sides", () => {
    const expectedPay = JOURNAL_ENTRY_EXAMPLES.payingALiability;
    const reversed = makeEntry([
      { accountId: "credit-card-payable", creditCents: 50_000 },
      { accountId: "bank-cash", debitCents: 50_000 },
    ]);
    const suggestion = suggestCorrection(reversed, expectedPay);
    expect(suggestion.differences.length).toBeGreaterThan(0);
    expect(suggestion.steps.join(" ")).toMatch(/debit|credit/i);
  });
});
