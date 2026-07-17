import { describe, expect, it } from "vitest";
import {
  REMEDIATION_CONTENT,
  buildWeakAreaSummary,
  classifyMistake,
  getRecommendedPractice,
  getRemediationContent,
} from "@/lib/game/remediation";

describe("remediation", () => {
  it("defines content for all seven weak areas", () => {
    const ids = Object.keys(REMEDIATION_CONTENT);
    expect(ids).toHaveLength(7);
    for (const id of ids) {
      const content = getRemediationContent(id as keyof typeof REMEDIATION_CONTENT);
      expect(content.encouragement.length).toBeGreaterThan(10);
      expect(content.simplerQuestion.prompt.length).toBeGreaterThan(10);
      expect(content.lessonId).toMatch(/^lesson-/);
    }
  });

  it("classifies GST mistakes from classifier wrong fields", () => {
    expect(
      classifyMistake({
        challengeId: "challenge-classify-transaction",
        wrongFields: ["salesTaxApplies"],
      }),
    ).toBe("sales_tax_confusion");
  });

  it("classifies account category mistakes", () => {
    expect(
      classifyMistake({
        challengeId: "challenge-sort-accounts",
        wrongFields: ["accountType"],
      }),
    ).toBe("account_category_confusion");
  });

  it("classifies debit/credit direction mistakes in journal duel", () => {
    expect(
      classifyMistake({
        challengeId: "challenge-double-entry-duel",
        directionScore: 5,
        directionMax: 15,
      }),
    ).toBe("debit_credit_confusion");
  });

  it("classifies calculation errors in year-end boss", () => {
    expect(
      classifyMistake({
        challengeId: "challenge-year-end-boss",
        amountCorrect: false,
      }),
    ).toBe("calculation_error");
  });

  it("classifies financial statement mistakes in insight detective", () => {
    expect(
      classifyMistake({
        challengeId: "challenge-insight-detective",
        questionType: "select_report",
      }),
    ).toBe("financial_statement_confusion");
  });

  it("builds weak area summary with lesson links", () => {
    const summary = buildWeakAreaSummary([
      "sales_tax_confusion",
      "sales_tax_confusion",
      "debit_credit_confusion",
    ]);
    expect(summary[0].category).toBe("sales_tax_confusion");
    expect(summary[0].missCount).toBe(2);
    expect(summary[0].lessonId).toBe("lesson-double-entry");
  });

  it("recommends practice for the most frequent weak area", () => {
    const practice = getRecommendedPractice([
      "trial_balance_confusion",
      "debit_credit_confusion",
      "debit_credit_confusion",
    ]);
    expect(practice?.weakArea.id).toBe("debit_credit_confusion");
    expect(practice?.missCount).toBe(2);
  });
});
