import { describe, expect, it } from "vitest";
import {
  buildDepreciationJournalEntry,
  buildHomeOfficeJournalEntry,
  buildMileageJournalEntry,
  calculateAmortizationAmount,
  calculateBusinessUsePercent,
  calculateDepreciation,
  calculateHomeOfficeClaimAmount,
  calculateHomeOfficeUse,
  calculateMileageClaim,
  calculateMileageClaimAmount,
  calculateNetBookValue,
  parseDollarsToCents,
  parseRatePerKmToCents,
} from "@/lib/accounting/yearEndCalculators";

describe("depreciation calculator", () => {
  it("calculates vehicle amortization at 30%", () => {
    const result = calculateDepreciation({
      assetName: "Vehicle",
      costCents: 3_000_000,
      depreciationRatePercent: 30,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.amortizationAmountCents).toBe(900_000);
    expect(result.value.netBookValueCents).toBe(2_100_000);
    expect(calculateAmortizationAmount(3_000_000, 30)).toBe(900_000);
    expect(calculateNetBookValue(3_000_000, 900_000)).toBe(2_100_000);
  });

  it("calculates furniture amortization at 20%", () => {
    const result = calculateDepreciation({
      assetName: "Furniture",
      costCents: 1_500_000,
      depreciationRatePercent: 20,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.amortizationAmountCents).toBe(300_000);
    expect(result.value.netBookValueCents).toBe(1_200_000);
  });

  it("calculates computer amortization at 50%", () => {
    const result = calculateDepreciation({
      assetName: "Computers",
      costCents: 500_000,
      depreciationRatePercent: 50,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.amortizationAmountCents).toBe(250_000);
    expect(result.value.netBookValueCents).toBe(250_000);
  });

  it("builds the suggested depreciation journal entry", () => {
    const entry = buildDepreciationJournalEntry("Vehicle", 900_000);
    expect(entry.lines).toHaveLength(2);
    expect(entry.lines[0]).toMatchObject({
      side: "debit",
      accountLabel: "Depreciation Expense",
      amountCents: 900_000,
    });
    expect(entry.lines[1]).toMatchObject({
      side: "credit",
      accountLabel: "Accumulated Amortization - Vehicle",
      amountCents: 900_000,
    });
  });

  it("accounts for prior accumulated amortization", () => {
    const result = calculateDepreciation({
      assetName: "Computers",
      costCents: 500_000,
      depreciationRatePercent: 50,
      accumulatedAmortizationCents: 100_000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.amortizationAmountCents).toBe(250_000);
    expect(result.value.accumulatedAmortizationAfterCents).toBe(350_000);
    expect(result.value.netBookValueCents).toBe(150_000);
  });
});

describe("home office calculator", () => {
  it("calculates business-use percentage and claim", () => {
    expect(calculateBusinessUsePercent(150, 1500)).toBeCloseTo(0.1);
    expect(calculateHomeOfficeClaimAmount(3_585_000, 0.1)).toBe(358_500);

    const result = calculateHomeOfficeUse({
      officeArea: 150,
      totalHomeArea: 1500,
      eligibleHomeCostsCents: 3_585_000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.businessUsePercent).toBeCloseTo(0.1);
    expect(result.value.claimAmountCents).toBe(358_500);
  });

  it("builds the suggested home office journal entry", () => {
    const entry = buildHomeOfficeJournalEntry(358_500);
    expect(entry.lines[0]).toMatchObject({
      side: "debit",
      accountLabel: "Home Office Use/Rent",
      amountCents: 358_500,
    });
    expect(entry.lines[1]).toMatchObject({
      side: "credit",
      accountLabel: "Shareholder Loan",
      amountCents: 358_500,
    });
  });

  it("rejects office area larger than total home area", () => {
    const result = calculateHomeOfficeUse({
      officeArea: 200,
      totalHomeArea: 150,
      eligibleHomeCostsCents: 100_000,
    });
    expect(result.ok).toBe(false);
  });
});

describe("mileage calculator", () => {
  it("calculates tiered CRA-style mileage claim", () => {
    const amounts = calculateMileageClaimAmount({
      businessKilometers: 25_000,
      tierOneLimitKm: 5000,
      rateFirstTierCentsPerKm: 68,
      rateRemainingTierCentsPerKm: 61,
    });
    expect(amounts.tierOneKilometers).toBe(5000);
    expect(amounts.remainingKilometers).toBe(20_000);
    expect(amounts.tierOneAmountCents).toBe(340_000);
    expect(amounts.remainingAmountCents).toBe(1_220_000);
    expect(amounts.claimAmountCents).toBe(1_560_000);

    const result = calculateMileageClaim({
      totalKilometers: 30_000,
      businessKilometers: 25_000,
      tierOneLimitKm: 5000,
      rateFirstTierCentsPerKm: 68,
      rateRemainingTierCentsPerKm: 61,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.claimAmountCents).toBe(1_560_000);
  });

  it("supports editable rates", () => {
    const result = calculateMileageClaim({
      totalKilometers: 6000,
      businessKilometers: 6000,
      tierOneLimitKm: 5000,
      rateFirstTierCentsPerKm: 70,
      rateRemainingTierCentsPerKm: 65,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.claimAmountCents).toBe(5_000 * 70 + 1_000 * 65);
  });

  it("builds the suggested mileage journal entry", () => {
    const entry = buildMileageJournalEntry(1_560_000);
    expect(entry.lines[0]).toMatchObject({
      side: "debit",
      accountLabel: "Vehicle Expense - Mileage",
      amountCents: 1_560_000,
    });
    expect(entry.lines[1]).toMatchObject({
      side: "credit",
      accountLabel: "Shareholder Loan",
      amountCents: 1_560_000,
    });
  });

  it("rejects business km greater than total km", () => {
    const result = calculateMileageClaim({
      totalKilometers: 10_000,
      businessKilometers: 12_000,
      rateFirstTierCentsPerKm: 68,
      rateRemainingTierCentsPerKm: 61,
    });
    expect(result.ok).toBe(false);
  });
});

describe("input parsing helpers", () => {
  it("parses dollar amounts to cents", () => {
    expect(parseDollarsToCents("35850")).toBe(3_585_000);
    expect(parseDollarsToCents("$3,585.00")).toBe(358_500);
  });

  it("parses per-km rates to cents", () => {
    expect(parseRatePerKmToCents("0.68")).toBe(68);
    expect(parseRatePerKmToCents("0.61")).toBe(61);
  });
});
