import type { Currency } from "@/lib/types/accounting";
import { chartOfAccounts } from "./chartOfAccounts";

/**
 * The simulated month learners practice bookkeeping for.
 */
export type SimulatedMonth = {
  year: number;
  month: number;
  /** Display label, e.g. "June 2024" */
  label: string;
  /** First day of the month (ISO date). */
  startDate: string;
  /** Last day of the month (ISO date). */
  endDate: string;
};

/**
 * Where the fictional business operates — affects GST and local context.
 */
export type BusinessLocation = {
  city: string;
  province: string;
  country: string;
  /** Alberta uses 5% GST only (no provincial sales tax). */
  salesTaxLabel: string;
  /** GST rate as a decimal (0.05 = 5%). */
  gstRate: number;
};

/**
 * Profile for the fictional practice business used throughout Ledger Quest.
 */
export type SampleBusiness = {
  id: string;
  businessName: string;
  legalName: string;
  industry: string;
  description: string;
  location: BusinessLocation;
  currency: Currency;
  simulatedMonth: SimulatedMonth;
  /** Opening bank balance at June 1, 2024, in cents. */
  openingBankBalanceCents: number;
  ownerName: string;
  entityType: "Alberta corporation";
  fiscalYearEnd: string;
  learningObjective: string;
  /** Number of accounts in the practice chart of accounts. */
  chartOfAccountsCount: number;
};

export const sampleBusiness: SampleBusiness = {
  id: "bright-path-consulting",
  businessName: "Bright Path Consulting",
  legalName: "Bright Path Consulting Inc.",
  industry: "Management consulting & professional services",
  description:
    "A solo-owned Alberta corporation providing strategy and operations consulting " +
    "to small and mid-sized businesses in the Calgary area. You are the owner-operator " +
    "learning to keep the books yourself before handing them to an accountant at year-end.",
  location: {
    city: "Calgary",
    province: "Alberta",
    country: "Canada",
    salesTaxLabel: "GST",
    gstRate: 0.05,
  },
  currency: "CAD",
  simulatedMonth: {
    year: 2024,
    month: 6,
    label: "June 2024",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
  },
  openingBankBalanceCents: 1_250_000,
  ownerName: "Alex Morgan",
  entityType: "Alberta corporation",
  fiscalYearEnd: "December 31",
  learningObjective:
    "Record every June 2024 transaction with consistent double-entry bookkeeping, " +
    "classify accounts correctly, produce a trial balance and financial statements, " +
    "and complete common year-end adjusting entries so your books are ready for corporate tax preparation.",
  chartOfAccountsCount: chartOfAccounts.length,
};

/** Opening bank balance as a formatted CAD string for display. */
export function formatOpeningBalance(): string {
  const dollars = sampleBusiness.openingBankBalanceCents / 100;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: sampleBusiness.currency,
  }).format(dollars);
}

/** GST rate for the sample business (5% in Alberta). */
export function getGstRate(): number {
  return sampleBusiness.location.gstRate;
}

/** Calculate GST in cents from a taxable base amount (rounded to whole cents). */
export function calculateGstCents(taxableBaseCents: number): number {
  return Math.round(taxableBaseCents * sampleBusiness.location.gstRate);
}
