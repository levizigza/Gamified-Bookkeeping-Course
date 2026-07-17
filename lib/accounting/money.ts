import type { MoneyAmount } from "@/lib/types/accounting";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";

/** Format a MoneyAmount for display (CAD, en-CA). */
export function formatMoney(money: MoneyAmount): string {
  return formatCentsForMessage(money.amountCents);
}

export function centsToMoney(
  amountCents: number,
  currency: MoneyAmount["currency"] = "CAD",
): MoneyAmount {
  return { amountCents, currency };
}

export function addCents(a: number, b: number): number {
  return a + b;
}
