import type { JournalEntry, JournalLine } from "@/lib/types/accounting";
import { JOURNAL_ENTRY_EXAMPLES } from "@/lib/accounting/journalValidation";

function entry(
  id: string,
  date: string,
  description: string,
  lines: JournalLine[],
): JournalEntry {
  return {
    id,
    date,
    description,
    lines: lines as [JournalLine, JournalLine, ...JournalLine[]],
  };
}

/**
 * June 2024 journal entries for Bright Path Consulting.
 * Combined into a balanced ledger for trial balance and reports practice.
 */
export const brightPathJune2024Entries: JournalEntry[] = [
  entry("je-06-01-owner-deposit", "2024-06-01", "Owner initial investment deposited to bank", [
    { accountId: "bank-cash", debitCents: 500_000 },
    { accountId: "capital-stock", creditCents: 500_000 },
  ]),
  JOURNAL_ENTRY_EXAMPLES.receivingConsultingIncomeByDeposit,
  entry("je-06-08-supplies-cc", "2024-06-08", "Office supplies on business Visa (incl. GST)", [
    { accountId: "supplies", debitCents: 8_000 },
    { accountId: "gst-hst-payable", debitCents: 400 },
    { accountId: "credit-card-payable", creditCents: 8_400 },
  ]),
  JOURNAL_ENTRY_EXAMPLES.payingTelephoneByCreditCard,
  entry("je-06-12-lunch", "2024-06-12", "Client lunch at The Nash", [
    { accountId: "meals-and-entertainment", debitCents: 5_200 },
    { accountId: "credit-card-payable", creditCents: 5_200 },
  ]),
  JOURNAL_ENTRY_EXAMPLES.buyingEquipment,
  JOURNAL_ENTRY_EXAMPLES.recordingSalesTaxPayable,
  entry("je-06-25-bank-fee", "2024-06-25", "Monthly bank service charge", [
    { accountId: "bank-service-charges", debitCents: 1_500 },
    { accountId: "bank-cash", creditCents: 1_500 },
  ]),
];

export function getBrightPathJune2024Entries(): JournalEntry[] {
  return brightPathJune2024Entries;
}
