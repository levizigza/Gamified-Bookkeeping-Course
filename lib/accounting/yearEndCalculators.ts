/**
 * Year-end adjusting entry calculators for educational simulation.
 * These are simplified models for learning — not tax or accounting advice.
 */

export const YEAR_END_EDUCATIONAL_DISCLAIMER =
  "Educational simulation only. Rates, methods, and eligibility rules change. " +
  "Confirm amounts with your accountant or tax authority before posting real entries.";

export type SuggestedJournalLine = {
  side: "debit" | "credit";
  accountLabel: string;
  amountCents: number;
};

export type SuggestedJournalEntry = {
  memo: string;
  lines: SuggestedJournalLine[];
};

export type DepreciationInput = {
  assetName: string;
  /** Asset cost in whole cents. */
  costCents: number;
  /** Annual depreciation rate as a whole percent (e.g. 30 for 30%). */
  depreciationRatePercent: number;
  /** Prior accumulated amortization in cents (default 0). */
  accumulatedAmortizationCents?: number;
};

export type DepreciationResult = {
  assetName: string;
  costCents: number;
  depreciationRatePercent: number;
  amortizationAmountCents: number;
  accumulatedAmortizationAfterCents: number;
  netBookValueCents: number;
  journalEntry: SuggestedJournalEntry;
};

export type HomeOfficeInput = {
  officeArea: number;
  totalHomeArea: number;
  /** Eligible home costs in whole cents (rent, utilities, etc.). */
  eligibleHomeCostsCents: number;
};

export type HomeOfficeResult = {
  officeArea: number;
  totalHomeArea: number;
  businessUsePercent: number;
  eligibleHomeCostsCents: number;
  claimAmountCents: number;
  journalEntry: SuggestedJournalEntry;
};

export type MileageInput = {
  totalKilometers: number;
  businessKilometers: number;
  /** Kilometres charged at the first-tier rate (CRA-style default: 5000). */
  tierOneLimitKm?: number;
  /** First-tier rate in cents per km (e.g. 68 = $0.68/km). */
  rateFirstTierCentsPerKm: number;
  /** Remaining-tier rate in cents per km (e.g. 61 = $0.61/km). */
  rateRemainingTierCentsPerKm: number;
};

export type MileageResult = {
  totalKilometers: number;
  businessKilometers: number;
  tierOneLimitKm: number;
  tierOneKilometers: number;
  remainingKilometers: number;
  rateFirstTierCentsPerKm: number;
  rateRemainingTierCentsPerKm: number;
  tierOneAmountCents: number;
  remainingAmountCents: number;
  claimAmountCents: number;
  journalEntry: SuggestedJournalEntry;
};

export type YearEndCalculatorError = {
  field: string;
  message: string;
};

function validatePositive(value: number, field: string): YearEndCalculatorError | null {
  if (!Number.isFinite(value) || value <= 0) {
    return { field, message: `${field} must be greater than zero.` };
  }
  return null;
}

function validateNonNegative(value: number, field: string): YearEndCalculatorError | null {
  if (!Number.isFinite(value) || value < 0) {
    return { field, message: `${field} cannot be negative.` };
  }
  return null;
}

/** Annual amortization from cost × rate%, and net book value after the adjustment. */
export function calculateAmortizationAmount(
  costCents: number,
  depreciationRatePercent: number,
): number {
  return Math.round((costCents * depreciationRatePercent) / 100);
}

export function calculateNetBookValue(
  costCents: number,
  accumulatedAmortizationAfterCents: number,
): number {
  return costCents - accumulatedAmortizationAfterCents;
}

export function buildDepreciationJournalEntry(
  assetName: string,
  amountCents: number,
): SuggestedJournalEntry {
  const trimmedName = assetName.trim() || "Asset";
  return {
    memo: `Year-end amortization — ${trimmedName}`,
    lines: [
      {
        side: "debit",
        accountLabel: "Depreciation Expense",
        amountCents,
      },
      {
        side: "credit",
        accountLabel: `Accumulated Amortization - ${trimmedName}`,
        amountCents,
      },
    ],
  };
}

export function calculateDepreciation(
  input: DepreciationInput,
): { ok: true; value: DepreciationResult } | { ok: false; errors: YearEndCalculatorError[] } {
  const errors: YearEndCalculatorError[] = [];
  const assetName = input.assetName.trim();

  if (!assetName) {
    errors.push({ field: "assetName", message: "Enter an asset name." });
  }

  const costError = validatePositive(input.costCents, "Cost");
  if (costError) errors.push(costError);

  if (!Number.isFinite(input.depreciationRatePercent) || input.depreciationRatePercent <= 0) {
    errors.push({
      field: "depreciationRatePercent",
      message: "Depreciation rate must be greater than zero.",
    });
  }

  const priorAccumulated = input.accumulatedAmortizationCents ?? 0;
  const priorError = validateNonNegative(priorAccumulated, "Accumulated amortization");
  if (priorError) errors.push(priorError);

  if (errors.length > 0) return { ok: false, errors };

  const amortizationAmountCents = calculateAmortizationAmount(
    input.costCents,
    input.depreciationRatePercent,
  );
  const accumulatedAmortizationAfterCents = priorAccumulated + amortizationAmountCents;
  const netBookValueCents = calculateNetBookValue(
    input.costCents,
    accumulatedAmortizationAfterCents,
  );

  if (netBookValueCents < 0) {
    return {
      ok: false,
      errors: [
        {
          field: "accumulatedAmortizationCents",
          message: "Accumulated amortization cannot exceed asset cost.",
        },
      ],
    };
  }

  return {
    ok: true,
    value: {
      assetName,
      costCents: input.costCents,
      depreciationRatePercent: input.depreciationRatePercent,
      amortizationAmountCents,
      accumulatedAmortizationAfterCents,
      netBookValueCents,
      journalEntry: buildDepreciationJournalEntry(assetName, amortizationAmountCents),
    },
  };
}

/** Business-use ratio from office area ÷ total home area. */
export function calculateBusinessUsePercent(
  officeArea: number,
  totalHomeArea: number,
): number {
  return officeArea / totalHomeArea;
}

export function calculateHomeOfficeClaimAmount(
  eligibleHomeCostsCents: number,
  businessUsePercent: number,
): number {
  return Math.round(eligibleHomeCostsCents * businessUsePercent);
}

export function buildHomeOfficeJournalEntry(amountCents: number): SuggestedJournalEntry {
  return {
    memo: "Year-end home office expense allocation",
    lines: [
      {
        side: "debit",
        accountLabel: "Home Office Use/Rent",
        amountCents,
      },
      {
        side: "credit",
        accountLabel: "Shareholder Loan",
        amountCents,
      },
    ],
  };
}

export function calculateHomeOfficeUse(
  input: HomeOfficeInput,
): { ok: true; value: HomeOfficeResult } | { ok: false; errors: YearEndCalculatorError[] } {
  const errors: YearEndCalculatorError[] = [];

  const officeError = validatePositive(input.officeArea, "Office area");
  if (officeError) errors.push(officeError);

  const totalError = validatePositive(input.totalHomeArea, "Total home area");
  if (totalError) errors.push(totalError);

  if (
    Number.isFinite(input.officeArea) &&
    Number.isFinite(input.totalHomeArea) &&
    input.officeArea > input.totalHomeArea
  ) {
    errors.push({
      field: "officeArea",
      message: "Office area cannot be larger than total home area.",
    });
  }

  const costError = validatePositive(input.eligibleHomeCostsCents, "Eligible home costs");
  if (costError) errors.push(costError);

  if (errors.length > 0) return { ok: false, errors };

  const businessUsePercent = calculateBusinessUsePercent(
    input.officeArea,
    input.totalHomeArea,
  );
  const claimAmountCents = calculateHomeOfficeClaimAmount(
    input.eligibleHomeCostsCents,
    businessUsePercent,
  );

  return {
    ok: true,
    value: {
      officeArea: input.officeArea,
      totalHomeArea: input.totalHomeArea,
      businessUsePercent,
      eligibleHomeCostsCents: input.eligibleHomeCostsCents,
      claimAmountCents,
      journalEntry: buildHomeOfficeJournalEntry(claimAmountCents),
    },
  };
}

/** Tiered per-km mileage claim (first N km at one rate, remainder at another). */
export function calculateMileageClaimAmount(input: {
  businessKilometers: number;
  tierOneLimitKm?: number;
  rateFirstTierCentsPerKm: number;
  rateRemainingTierCentsPerKm: number;
}): {
  tierOneLimitKm: number;
  tierOneKilometers: number;
  remainingKilometers: number;
  tierOneAmountCents: number;
  remainingAmountCents: number;
  claimAmountCents: number;
} {
  const tierOneLimitKm = input.tierOneLimitKm ?? 5000;
  const tierOneKilometers = Math.min(input.businessKilometers, tierOneLimitKm);
  const remainingKilometers = Math.max(0, input.businessKilometers - tierOneLimitKm);
  const tierOneAmountCents = Math.round(
    tierOneKilometers * input.rateFirstTierCentsPerKm,
  );
  const remainingAmountCents = Math.round(
    remainingKilometers * input.rateRemainingTierCentsPerKm,
  );

  return {
    tierOneLimitKm,
    tierOneKilometers,
    remainingKilometers,
    tierOneAmountCents,
    remainingAmountCents,
    claimAmountCents: tierOneAmountCents + remainingAmountCents,
  };
}

export function buildMileageJournalEntry(amountCents: number): SuggestedJournalEntry {
  return {
    memo: "Year-end vehicle mileage claim",
    lines: [
      {
        side: "debit",
        accountLabel: "Vehicle Expense - Mileage",
        amountCents,
      },
      {
        side: "credit",
        accountLabel: "Shareholder Loan",
        amountCents,
      },
    ],
  };
}

export function calculateMileageClaim(
  input: MileageInput,
): { ok: true; value: MileageResult } | { ok: false; errors: YearEndCalculatorError[] } {
  const errors: YearEndCalculatorError[] = [];

  const totalError = validatePositive(input.totalKilometers, "Total kilometers");
  if (totalError) errors.push(totalError);

  const businessError = validateNonNegative(input.businessKilometers, "Business kilometers");
  if (businessError) errors.push(businessError);

  if (
    Number.isFinite(input.businessKilometers) &&
    Number.isFinite(input.totalKilometers) &&
    input.businessKilometers > input.totalKilometers
  ) {
    errors.push({
      field: "businessKilometers",
      message: "Business kilometers cannot exceed total kilometers.",
    });
  }

  if (input.businessKilometers <= 0) {
    errors.push({
      field: "businessKilometers",
      message: "Enter business kilometers greater than zero to calculate a claim.",
    });
  }

  const tierLimit = input.tierOneLimitKm ?? 5000;
  if (!Number.isFinite(tierLimit) || tierLimit <= 0) {
    errors.push({
      field: "tierOneLimitKm",
      message: "First-tier kilometre limit must be greater than zero.",
    });
  }

  const firstRateError = validateNonNegative(
    input.rateFirstTierCentsPerKm,
    "First-tier rate",
  );
  if (firstRateError) errors.push(firstRateError);

  const remainingRateError = validateNonNegative(
    input.rateRemainingTierCentsPerKm,
    "Remaining rate",
  );
  if (remainingRateError) errors.push(remainingRateError);

  if (errors.length > 0) return { ok: false, errors };

  const amounts = calculateMileageClaimAmount({
    businessKilometers: input.businessKilometers,
    tierOneLimitKm: tierLimit,
    rateFirstTierCentsPerKm: input.rateFirstTierCentsPerKm,
    rateRemainingTierCentsPerKm: input.rateRemainingTierCentsPerKm,
  });

  return {
    ok: true,
    value: {
      totalKilometers: input.totalKilometers,
      businessKilometers: input.businessKilometers,
      tierOneLimitKm: amounts.tierOneLimitKm,
      tierOneKilometers: amounts.tierOneKilometers,
      remainingKilometers: amounts.remainingKilometers,
      rateFirstTierCentsPerKm: input.rateFirstTierCentsPerKm,
      rateRemainingTierCentsPerKm: input.rateRemainingTierCentsPerKm,
      tierOneAmountCents: amounts.tierOneAmountCents,
      remainingAmountCents: amounts.remainingAmountCents,
      claimAmountCents: amounts.claimAmountCents,
      journalEntry: buildMileageJournalEntry(amounts.claimAmountCents),
    },
  };
}

/** Parse a dollar string into whole cents for calculator inputs. */
export function parseDollarsToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/[$,\s]/g, "");
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const dollars = Number(cleaned);
  if (Number.isNaN(dollars)) return null;
  return Math.round(dollars * 100);
}

/** Parse a per-km dollar rate into cents per km (e.g. "0.68" → 68). */
export function parseRatePerKmToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,4})?$/.test(cleaned)) return null;
  const dollars = Number(cleaned);
  if (Number.isNaN(dollars) || dollars < 0) return null;
  return Math.round(dollars * 100);
}

export function formatPercentDisplay(ratio: number): string {
  return `${(ratio * 100).toFixed(2)}%`;
}
