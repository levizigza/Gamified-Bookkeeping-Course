import type { JournalLine } from "@/lib/types/accounting";

export const DOUBLE_ENTRY_DUEL_CHALLENGE_ID = "challenge-double-entry-duel";

/** One correct line in the answer key (cents only). */
export type ExpectedJournalLine = {
  accountId: string;
  debitCents: number;
  creditCents: number;
};

/** A business scenario the learner records as a journal entry. */
export type JournalScenario = {
  id: string;
  date: string;
  title: string;
  narrative: string;
  /** Optional display amount for the scenario card. */
  displayAmountCents?: number;
  salesTaxApplies: boolean;
  /** When true, GST should be credited (collected on a sale). When false but applies, debited (ITC on purchase). */
  salesTaxOnSale: boolean;
  expectedLines: ExpectedJournalLine[];
  /** Plain-language explanation for new business owners. */
  ownerExplanation: string;
  consistencyTip: string;
  maxXp: number;
};

export type DoubleEntryDuelChallenge = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  nextLessonId: string;
  scenarios: JournalScenario[];
};

function lines(
  ...entries: { accountId: string; debitCents?: number; creditCents?: number }[]
): ExpectedJournalLine[] {
  return entries.map((e) => ({
    accountId: e.accountId,
    debitCents: e.debitCents ?? 0,
    creditCents: e.creditCents ?? 0,
  }));
}

export const doubleEntryDuelChallenge: DoubleEntryDuelChallenge = {
  id: DOUBLE_ENTRY_DUEL_CHALLENGE_ID,
  title: "Double-Entry Duel",
  description:
    "Read each business scenario and build the journal entry yourself. " +
    "Balance debits and credits, pick the right accounts, and handle GST when it applies.",
  lessonId: "lesson-double-entry",
  nextLessonId: "lesson-june-sprint",
  scenarios: [
    {
      id: "duel-01-owner-deposit",
      date: "2024-06-01",
      title: "Owner deposits startup money",
      narrative:
        "You open a business chequing account for Bright Path Consulting and transfer $5,000 " +
        "of your own money into it. This is your initial investment in the corporation — not revenue.",
      displayAmountCents: 500_000,
      salesTaxApplies: false,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "bank-cash", debitCents: 500_000 },
        { accountId: "capital-stock", creditCents: 500_000 },
      ),
      ownerExplanation:
        "When you put your own money into the business bank account, the business received cash (debit Bank/Cash) " +
        "and owes that value back to you as owner equity (credit Capital Stock). No GST applies — this is not a sale.",
      consistencyTip:
        "Always record owner investments to Capital Stock (or Shareholder Loan if structured as a loan), never to revenue.",
      maxXp: 50,
    },
    {
      id: "duel-02-supplies-debit-card",
      date: "2024-06-08",
      title: "Office supplies with debit card",
      narrative:
        "You buy $80 of workshop supplies at Staples plus $4 GST, paying $84 total directly from your " +
        "business debit card (money leaves your bank immediately).",
      displayAmountCents: 8_400,
      salesTaxApplies: true,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "supplies", debitCents: 8_000 },
        { accountId: "gst-hst-payable", debitCents: 400 },
        { accountId: "bank-cash", creditCents: 8_400 },
      ),
      ownerExplanation:
        "Supplies are an expense (debit Supplies). The $4 GST you paid can reduce what you owe CRA later " +
        "(debit GST/HST Payable as an input tax credit). Your bank balance dropped by the full $84 (credit Bank/Cash).",
      consistencyTip:
        "Split GST from the purchase price on taxable supplies — do not bury tax inside the expense amount.",
      maxXp: 50,
    },
    {
      id: "duel-03-telephone-cc",
      date: "2024-06-10",
      title: "Telephone bill on credit card",
      narrative:
        "Your June business phone bill is $95. You charge it to the company Visa. Your bank chequing " +
        "account is not affected until you pay the card later.",
      displayAmountCents: 9_500,
      salesTaxApplies: false,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "telephone-expense", debitCents: 9_500 },
        { accountId: "credit-card-payable", creditCents: 9_500 },
      ),
      ownerExplanation:
        "You incurred a telephone expense (debit Telephone Expense) and owe more on your credit card " +
        "(credit Credit Card Payable). Bank/Cash stays the same — the cash only moves when you pay the card bill.",
      consistencyTip:
        "Credit card purchases always hit Credit Card Payable on the credit side until you pay the statement from the bank.",
      maxXp: 50,
    },
    {
      id: "duel-04-consulting-paid",
      date: "2024-06-05",
      title: "Consulting income — paid immediately",
      narrative:
        "Pinnacle Energy Ltd. pays your $4,000 consulting fee plus $200 GST ($4,200 total) by e-transfer. " +
        "The money lands in your business bank account today.",
      displayAmountCents: 420_000,
      salesTaxApplies: true,
      salesTaxOnSale: true,
      expectedLines: lines(
        { accountId: "bank-cash", debitCents: 420_000 },
        { accountId: "consulting-income", creditCents: 400_000 },
        { accountId: "gst-hst-payable", creditCents: 20_000 },
      ),
      ownerExplanation:
        "Cash came in (debit Bank/Cash $4,200). Only $4,000 is your consulting revenue (credit Consulting Income). " +
        "The $200 GST is not yours to keep — credit GST/HST Payable until you remit it to CRA.",
      consistencyTip:
        "On every taxable sale, split GST out of the total deposit. Your income is the pre-tax amount.",
      maxXp: 50,
    },
    {
      id: "duel-05-invoice-unpaid",
      date: "2024-06-22",
      title: "Invoice sent — not paid yet",
      narrative:
        "You email a $2,000 consulting invoice plus $100 GST ($2,100 total) to Bow River Logistics. " +
        "Payment is due in 30 days. No cash has arrived.",
      displayAmountCents: 210_000,
      salesTaxApplies: true,
      salesTaxOnSale: true,
      expectedLines: lines(
        { accountId: "accounts-receivable", debitCents: 210_000 },
        { accountId: "consulting-income", creditCents: 200_000 },
        { accountId: "gst-hst-payable", creditCents: 10_000 },
      ),
      ownerExplanation:
        "The client owes you money (debit Accounts Receivable). You earned revenue (credit Consulting Income) " +
        "and collected GST on their behalf (credit GST/HST Payable). Bank/Cash does not change until they pay.",
      consistencyTip:
        "Record revenue when you earn it — when the invoice is sent — using the same accounts every month.",
      maxXp: 50,
    },
    {
      id: "duel-06-customer-pays-invoice",
      date: "2024-06-28",
      title: "Customer pays an old invoice",
      narrative:
        "Bow River Logistics finally pays the full $2,100 invoice by bank transfer. You are collecting " +
        "money they already owed you — this is not new revenue.",
      displayAmountCents: 210_000,
      salesTaxApplies: false,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "bank-cash", debitCents: 210_000 },
        { accountId: "accounts-receivable", creditCents: 210_000 },
      ),
      ownerExplanation:
        "Cash increased (debit Bank/Cash) and the amount they owed you is gone (credit Accounts Receivable). " +
        "You do not record income again — you already recognized it when you sent the invoice.",
      consistencyTip:
        "When a client pays an existing invoice, always debit Bank and credit Accounts Receivable — never duplicate revenue.",
      maxXp: 50,
    },
    {
      id: "duel-07-equipment",
      date: "2024-06-15",
      title: "Buy a business laptop",
      narrative:
        "You purchase a $2,400 MacBook Pro for consulting work, paid from your business bank account. " +
        "This is equipment you will use for more than one year.",
      displayAmountCents: 240_000,
      salesTaxApplies: false,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "equipment", debitCents: 240_000 },
        { accountId: "bank-cash", creditCents: 240_000 },
      ),
      ownerExplanation:
        "A laptop that lasts years is Equipment — an asset on your balance sheet (debit Equipment), not a one-time expense. " +
        "Cash left your bank (credit Bank/Cash). You will expense it gradually through amortization later.",
      consistencyTip:
        "Capitalize durable purchases above your threshold to Equipment — expense small items to Supplies instead.",
      maxXp: 50,
    },
    {
      id: "duel-08-pay-credit-card",
      date: "2024-06-30",
      title: "Pay credit card from bank",
      narrative:
        "You pay $500 toward your business Visa balance from your company chequing account. " +
        "This clears part of what the business owed on the card — not a new expense.",
      displayAmountCents: 50_000,
      salesTaxApplies: false,
      salesTaxOnSale: false,
      expectedLines: lines(
        { accountId: "credit-card-payable", debitCents: 50_000 },
        { accountId: "bank-cash", creditCents: 50_000 },
      ),
      ownerExplanation:
        "You reduced what you owe on the card (debit Credit Card Payable) and reduced your bank balance " +
        "(credit Bank/Cash). The expenses were already recorded when you made the purchases — this is just paying the bill.",
      consistencyTip:
        "Paying a credit card is never an expense entry. It only moves money between liability and bank.",
      maxXp: 50,
    },
  ],
};

export function getDoubleEntryDuelChallenge(): DoubleEntryDuelChallenge {
  return doubleEntryDuelChallenge;
}

/** Convert expected lines to JournalLine[] for explainJournalEntry. */
export function expectedToJournalLines(scenario: JournalScenario): JournalLine[] {
  return scenario.expectedLines.map((line) => {
    if (line.debitCents > 0) {
      return { accountId: line.accountId, debitCents: line.debitCents };
    }
    return { accountId: line.accountId, creditCents: line.creditCents };
  });
}

export function getScenarioById(id: string): JournalScenario | undefined {
  return doubleEntryDuelChallenge.scenarios.find((s) => s.id === id);
}
