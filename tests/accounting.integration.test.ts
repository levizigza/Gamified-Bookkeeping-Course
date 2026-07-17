/**
 * Integration smoke tests — one assertion per core accounting domain.
 * Detailed edge cases live in lib/accounting/*.test.ts.
 */

import { describe, expect, it } from "vitest";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { brightPathJune2024Entries } from "@/lib/data/sampleJournalEntries";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import {
  calculateDepreciation,
  calculateHomeOfficeUse,
  calculateMileageClaim,
} from "@/lib/accounting/yearEndCalculators";
import {
  calculateNetIncome,
  generateBalanceSheet,
  generateProfitAndLoss,
  validateBalanceSheetEquation,
} from "@/lib/accounting/financialStatements";
import { isBalanced, validateJournalEntry } from "@/lib/accounting/journalValidation";
import { buildFormattedTrialBalance } from "@/lib/accounting/trialBalance";
import { balancedEntry, unbalancedEntry } from "@/tests/helpers/fixtures";

describe("accounting integration smoke tests", () => {
  it("balanced journal entries pass validation", () => {
    const entry = balancedEntry("supplies", 8_000, "bank-cash", 8_000);
    expect(isBalanced(entry)).toBe(true);
    expect(validateJournalEntry(entry).ok).toBe(true);
  });

  it("invalid journal entries are rejected with errors", () => {
    const entry = unbalancedEntry(10_000, 9_000);
    const result = validateJournalEntry(entry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === "UNBALANCED")).toBe(true);
    }
  });

  it("trial balance totals match for June sample data", () => {
    const { trialBalance } = buildFormattedTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      sampleBusiness.simulatedMonth.endDate,
    );
    expect(trialBalance.balanced).toBe(true);
    expect(trialBalance.totalDebitsCents).toBe(trialBalance.totalCreditsCents);
  });

  it("Profit & Loss net income is revenue minus costs", () => {
    const period = {
      startDate: sampleBusiness.simulatedMonth.startDate,
      endDate: sampleBusiness.simulatedMonth.endDate,
      label: sampleBusiness.simulatedMonth.label,
    };
    const { trialBalance } = buildFormattedTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      period.endDate,
    );
    const pl = generateProfitAndLoss(trialBalance.rows, chartOfAccounts, period);
    expect(pl.netIncomeCents).toBe(
      calculateNetIncome(
        pl.totalRevenueCents,
        pl.totalDirectCostsCents,
        pl.totalOperatingExpensesCents,
      ),
    );
  });

  it("Balance Sheet satisfies assets = liabilities + equity", () => {
    const periodEnd = sampleBusiness.simulatedMonth.endDate;
    const { trialBalance } = buildFormattedTrialBalance(
      brightPathJune2024Entries,
      chartOfAccounts,
      periodEnd,
    );
    const pl = generateProfitAndLoss(trialBalance.rows, chartOfAccounts, {
      startDate: sampleBusiness.simulatedMonth.startDate,
      endDate: periodEnd,
      label: sampleBusiness.simulatedMonth.label,
    });
    const bs = generateBalanceSheet(
      trialBalance.rows,
      chartOfAccounts,
      periodEnd,
      pl.netIncomeCents,
    );
    const equation = validateBalanceSheetEquation(
      bs.totalAssetsCents,
      bs.totalLiabilitiesCents,
      bs.totalEquityCents,
    );
    expect(equation.balanced).toBe(true);
    expect(bs.balanced).toBe(true);
  });

  it("depreciation calculator returns expected amortization", () => {
    const result = calculateDepreciation({
      assetName: "Vehicle",
      costCents: 3_000_000,
      depreciationRatePercent: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.amortizationAmountCents).toBe(900_000);
    }
  });

  it("home office calculator returns business-use percentage", () => {
    const result = calculateHomeOfficeUse({
      officeArea: 150,
      totalHomeArea: 1500,
      eligibleHomeCostsCents: 3_585_000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.businessUsePercent).toBeCloseTo(0.1);
      expect(result.value.claimAmountCents).toBe(358_500);
    }
  });

  it("mileage calculator returns tiered claim amount", () => {
    const result = calculateMileageClaim({
      totalKilometers: 30_000,
      businessKilometers: 25_000,
      tierOneLimitKm: 5000,
      rateFirstTierCentsPerKm: 68,
      rateRemainingTierCentsPerKm: 61,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.claimAmountCents).toBe(1_560_000);
    }
  });
});
