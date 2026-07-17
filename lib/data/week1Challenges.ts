import type { AccountType } from "@/lib/types/accounting";

/** How a transaction affects the business bank/chequing balance. */
export type CashBankEffect = "increase" | "decrease" | "no_change";

export const CLASSIFY_TRANSACTION_CHALLENGE_ID = "challenge-classify-transaction";

/** Correct answers and teaching feedback for one practice transaction. */
export type ClassifyTransactionAnswer = {
  accountType: AccountType;
  accountId: string;
  cashEffect: CashBankEffect;
  salesTaxApplies: boolean;
  explanation: string;
  consistencyPrinciple: string;
  doubleEntryEffect: string;
};

/** A June 2024 transaction the learner must classify. */
export type ClassifyTransaction = {
  id: string;
  date: string;
  description: string;
  narrative: string;
  vendor?: string;
  /** Total amount in cents (what the user sees on the receipt or deposit). */
  amountCents: number;
  answer: ClassifyTransactionAnswer;
  xpReward: number;
};

export type ClassifyTransactionChallenge = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  transactions: ClassifyTransaction[];
  /** Recommended lesson id after completing with strong accuracy. */
  nextLessonId: string;
};

export const classifyTransactionChallenge: ClassifyTransactionChallenge = {
  id: CLASSIFY_TRANSACTION_CHALLENGE_ID,
  title: "Daily Ledger: Classify the Transaction",
  description:
    "Work through real June 2024 transactions for Bright Path Consulting. " +
    "Choose the account category, specific account, bank effect, and whether GST applies.",
  lessonId: "lesson-double-entry",
  nextLessonId: "lesson-june-sprint",
  transactions: [
    {
      id: "june-05-client-deposit",
      date: "2024-06-05",
      description: "Client payment deposited — Pinnacle Energy Ltd.",
      narrative:
        "A Calgary client paid your consulting invoice in full. $4,200 landed in your " +
        "business chequing account this morning, including 5% GST you collected on the sale.",
      vendor: "Pinnacle Energy Ltd.",
      amountCents: 420_000,
      xpReward: 40,
      answer: {
        accountType: "income",
        accountId: "consulting-income",
        cashEffect: "increase",
        salesTaxApplies: true,
        explanation:
          "This is revenue from consulting work — your main income. Cash increased because " +
          "the client paid you. GST was collected on the sale and must be tracked separately " +
          "from your consulting fees (not lumped into income).",
        consistencyPrinciple:
          "Always classify client consulting payments to Consulting Income — not Sales Revenue " +
          "unless you are selling physical goods.",
        doubleEntryEffect:
          "Debit Bank/Cash $4,200 · Credit Consulting Income $4,000 · Credit GST/HST Payable $200 " +
          "(simplified split for a $4,200 total including 5% GST).",
      },
    },
    {
      id: "june-08-staples",
      date: "2024-06-08",
      description: "Office supplies — Staples",
      narrative:
        "You picked up workshop materials at Staples and paid with your business Visa. " +
        "The receipt shows $80 in supplies plus $4 GST — $84 total. Your bank balance did not change.",
      vendor: "Staples",
      amountCents: 8_400,
      xpReward: 40,
      answer: {
        accountType: "expense",
        accountId: "supplies",
        cashEffect: "no_change",
        salesTaxApplies: true,
        explanation:
          "Supplies are an operating expense. You paid with a credit card, so Bank/Cash stays " +
          "the same — but you owe more on Credit Card Payable. GST on business purchases can " +
          "often be claimed as an input tax credit.",
        consistencyPrinciple:
          "Put every small consumable office purchase in Supplies. Do not mix them into Office " +
          "Expenses unless you have a clear rule and stick to it.",
        doubleEntryEffect:
          "Debit Supplies $80 · Debit GST/HST Payable (input tax credit) $4 · Credit Credit Card Payable $84.",
      },
    },
    {
      id: "june-12-lunch",
      date: "2024-06-12",
      description: "Business lunch — The Nash",
      narrative:
        "You treated a prospective client to lunch at The Nash in Calgary and charged $52 to " +
        "your business credit card. Keep the receipt and note who attended.",
      vendor: "The Nash",
      amountCents: 5_200,
      xpReward: 40,
      answer: {
        accountType: "expense",
        accountId: "meals-and-entertainment",
        cashEffect: "no_change",
        salesTaxApplies: true,
        explanation:
          "Client meals are Meals and Entertainment — not Supplies or Office Expenses. " +
          "Credit card purchases do not change your bank balance until you pay the card bill.",
        consistencyPrinciple:
          "Every client meal goes to the same account. Write down who attended and the business " +
          "purpose on the receipt every time.",
        doubleEntryEffect:
          "Debit Meals and Entertainment (plus GST if split) · Credit Credit Card Payable $52.",
      },
    },
    {
      id: "june-15-laptop",
      date: "2024-06-15",
      description: "Laptop purchase — Apple Store",
      narrative:
        "You bought a $2,400 MacBook Pro for consulting work and paid directly from your " +
        "business bank account. This item will last more than one year.",
      vendor: "Apple Store",
      amountCents: 240_000,
      xpReward: 45,
      answer: {
        accountType: "asset",
        accountId: "equipment",
        cashEffect: "decrease",
        salesTaxApplies: true,
        explanation:
          "A laptop used for business over multiple years is Equipment (a fixed asset), not a " +
          "full expense the day you buy it. Your bank balance dropped because you paid cash.",
        consistencyPrinciple:
          "Set a dollar threshold for equipment (e.g. over $500) and always capitalize items " +
          "above that threshold — do not expense a laptop one month and capitalize a monitor the next.",
        doubleEntryEffect:
          "Debit Equipment $2,400 (or split cost + GST) · Credit Bank/Cash $2,400.",
      },
    },
    {
      id: "june-18-mileage",
      date: "2024-06-18",
      description: "Business mileage — client site visits",
      narrative:
        "You drove 45 km round-trip to a client site in northeast Calgary. You log kilometres " +
        "weekly and claim them at the CRA reasonable rate — no fuel receipt for this entry.",
      amountCents: 0,
      xpReward: 35,
      answer: {
        accountType: "expense",
        accountId: "vehicle-expense-mileage",
        cashEffect: "no_change",
        salesTaxApplies: false,
        explanation:
          "Mileage claims use Vehicle Expense - Mileage when you track kilometres instead of " +
          "individual gas receipts. No cash moves when you log the trip — you are accruing an expense.",
        consistencyPrinciple:
          "Pick either the mileage method or the actual-expense method for vehicle costs and " +
          "use the same approach all year.",
        doubleEntryEffect:
          "Debit Vehicle Expense - Mileage · Credit a payable or clearing account (no bank movement yet).",
      },
    },
    {
      id: "june-22-invoice-sent",
      date: "2024-06-22",
      description: "Consulting invoice sent — Bow River Logistics",
      narrative:
        "You emailed a $2,100 invoice (including GST) to Bow River Logistics for June strategy " +
        "work. They have 30 days to pay — no cash has arrived yet.",
      vendor: "Bow River Logistics",
      amountCents: 210_000,
      xpReward: 45,
      answer: {
        accountType: "income",
        accountId: "consulting-income",
        cashEffect: "no_change",
        salesTaxApplies: true,
        explanation:
          "Sending an invoice creates revenue and an Accounts Receivable balance — money owed to you. " +
          "Bank/Cash does not change until the client actually pays.",
        consistencyPrinciple:
          "Record revenue when you earn it (when the invoice is sent or work is complete), using " +
          "the same rule every month — not only when cash arrives.",
        doubleEntryEffect:
          "Debit Accounts Receivable $2,100 · Credit Consulting Income $2,000 · Credit GST/HST Payable $100.",
      },
    },
    {
      id: "june-25-bank-fee",
      date: "2024-06-25",
      description: "Monthly bank service charge",
      narrative:
        "Your bank deducted a $15 monthly fee from your business chequing account. No GST applies " +
        "to most bank service charges.",
      amountCents: 1_500,
      xpReward: 35,
      answer: {
        accountType: "expense",
        accountId: "bank-service-charges",
        cashEffect: "decrease",
        salesTaxApplies: false,
        explanation:
          "Bank fees are operating expenses in Bank Service Charges. Cash went down because the " +
          "bank took the fee directly from your account. Bank fees are generally not subject to GST.",
        consistencyPrinciple:
          "Record every bank fee when it hits your statement — small charges add up over a year.",
        doubleEntryEffect:
          "Debit Bank Service Charges $15 · Credit Bank/Cash $15.",
      },
    },
    {
      id: "june-11-taxi",
      date: "2024-06-11",
      description: "Taxi to client site",
      narrative:
        "You hail a taxi from the airport to a client meeting. The receipt is $42.00 plus $2.10 GST " +
        "($44.10 total), paid from your business debit card. Cash left the bank immediately.",
      vendor: "Calgary Taxi Co.",
      amountCents: 4_410,
      xpReward: 40,
      answer: {
        accountType: "expense",
        accountId: "travel-expense",
        cashEffect: "decrease",
        salesTaxApplies: true,
        explanation:
          "A business taxi is travel spend — you gave up cash and gained a ride (service). " +
          "Split GST from the base fare so sales tax stays trackable for CRA.",
        consistencyPrinciple:
          "Put client taxis and transit in Travel Expense every time — do not bury them in Office Expenses.",
        doubleEntryEffect:
          "Debit Travel Expense $42 · Debit GST/HST Payable (input tax credit) $2.10 · Credit Bank/Cash $44.10.",
      },
    },
    {
      id: "june-14-home-depot",
      date: "2024-06-14",
      description: "Workshop materials — Home Depot",
      narrative:
        "You buy $200 of materials at Home Depot for a client workshop, plus $10 GST ($210 total), " +
        "paid on the business debit card. These are job materials — not general office cleaning costs.",
      vendor: "Home Depot",
      amountCents: 21_000,
      xpReward: 45,
      answer: {
        accountType: "expense",
        accountId: "supplies",
        cashEffect: "decrease",
        salesTaxApplies: true,
        explanation:
          "Job materials belong in Supplies (direct costs). Cash went down for the full receipt. " +
          "GST on the purchase can often be recovered — keep it separate from the materials amount.",
        consistencyPrinciple:
          "Like the plumber rule: materials for client work stay in Supplies every time — never reshuffle them into Office Expenses next month.",
        doubleEntryEffect:
          "Debit Supplies $200 · Debit GST/HST Payable (input tax credit) $10 · Credit Bank/Cash $210.",
      },
    },
    {
      id: "june-28-insurance-prepaid",
      date: "2024-06-28",
      description: "Annual insurance premium prepaid",
      narrative:
        "You paid $600 from your business bank account for a full year of professional liability " +
        "insurance starting July 1. You have not used up the coverage yet.",
      vendor: "Intact Insurance",
      amountCents: 60_000,
      xpReward: 40,
      answer: {
        accountType: "asset",
        accountId: "prepaid-expenses",
        cashEffect: "decrease",
        salesTaxApplies: false,
        explanation:
          "Insurance paid in advance for future months is a Prepaid Expense (an asset), not an " +
          "immediate Insurance Expense. Cash left your bank when you paid.",
        consistencyPrinciple:
          "Any expense covering a future period goes to Prepaid Expenses first, then you expense " +
          "a portion each month — the same way every time.",
        doubleEntryEffect:
          "Debit Prepaid Expenses $600 · Credit Bank/Cash $600. (Expense recognized monthly later.)",
      },
    },
  ],
};

export function getClassifyTransactionChallenge(): ClassifyTransactionChallenge {
  return classifyTransactionChallenge;
}

export function getClassifyTransactionById(
  id: string,
): ClassifyTransaction | undefined {
  return classifyTransactionChallenge.transactions.find((t) => t.id === id);
}
