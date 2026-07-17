import type { AccountType } from "@/lib/types/accounting";

// ---------------------------------------------------------------------------
// Game 1: Debit or Credit?
// ---------------------------------------------------------------------------

export type DebitCreditQuestion = {
  transaction: string;
  accountName: string;
  correctSide: "debit" | "credit";
  explanation: string;
  week: number;
};

export const debitCreditQuestions: DebitCreditQuestion[] = [
  // Week 1 — Daily Ledger basics
  { transaction: "Client pays $4,200 for consulting work", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came IN, so Bank/Cash increases — that's a debit for asset accounts.", week: 1 },
  { transaction: "Client pays $4,200 for consulting work", accountName: "Consulting Income", correctSide: "credit", explanation: "You earned revenue — income accounts increase on the credit side.", week: 1 },
  { transaction: "Bought office supplies for $80", accountName: "Supplies", correctSide: "debit", explanation: "Expenses increase with debits. You spent money on supplies.", week: 1 },
  { transaction: "Bought office supplies for $80", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash went OUT — asset accounts decrease with credits.", week: 1 },
  { transaction: "Paid $95 phone bill", accountName: "Telephone Expense", correctSide: "debit", explanation: "Recording an expense — expenses always increase on the debit side.", week: 1 },
  { transaction: "Paid $95 phone bill", accountName: "Bank/Cash", correctSide: "credit", explanation: "You paid cash, so Bank/Cash decreases — that's a credit.", week: 1 },
  { transaction: "Owner invested $5,000 to start the business", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came into the business — assets increase with debits.", week: 1 },
  { transaction: "Owner invested $5,000 to start the business", accountName: "Capital Stock", correctSide: "credit", explanation: "Owner's equity increased — equity accounts increase with credits.", week: 1 },
  { transaction: "Sent invoice to client for $2,100 (not yet paid)", accountName: "Accounts Receivable", correctSide: "debit", explanation: "Someone owes you money — A/R is an asset that increases with debits.", week: 1 },
  { transaction: "Sent invoice to client for $2,100 (not yet paid)", accountName: "Consulting Income", correctSide: "credit", explanation: "You earned the revenue when the work was done, even before cash arrives.", week: 1 },
  { transaction: "Paid $65 fuel for client visit", accountName: "Vehicle Expense", correctSide: "debit", explanation: "Fuel for business travel is an operating expense — debits increase expenses.", week: 1 },
  { transaction: "Paid $65 fuel for client visit", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the bank when you paid at the pump.", week: 1 },
  { transaction: "Paid $22 parking at downtown client meeting", accountName: "Vehicle Expense", correctSide: "debit", explanation: "Parking for business purposes is a vehicle/travel expense — debit to increase.", week: 1 },
  { transaction: "Booked $1,200 flight to Edmonton for a project", accountName: "Travel Expense", correctSide: "debit", explanation: "Business travel costs are expenses — they increase with debits.", week: 1 },
  { transaction: "Booked $1,200 flight to Edmonton for a project", accountName: "Bank/Cash", correctSide: "credit", explanation: "You paid for the flight from your bank account — cash decreased.", week: 1 },
  { transaction: "Paid $85 for team lunch (entertainment)", accountName: "Meals & Entertainment", correctSide: "debit", explanation: "Business entertainment is an expense — expenses go up with debits.", week: 1 },
  { transaction: "Bought $40/month software subscription", accountName: "Software/Subscriptions", correctSide: "debit", explanation: "Monthly software costs are operating expenses — debit to record.", week: 1 },
  { transaction: "Paid $150 for internet (40% business use)", accountName: "Internet Expense", correctSide: "debit", explanation: "The business portion ($60) of shared internet is an expense — debit side.", week: 1 },

  // Week 2 — Account Sorter concepts
  { transaction: "Bought a $2,400 laptop for work", accountName: "Equipment", correctSide: "debit", explanation: "A long-term asset was acquired — fixed assets increase with debits.", week: 2 },
  { transaction: "Bought a $2,400 laptop for work", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the business to buy the laptop.", week: 2 },
  { transaction: "Received $15 bank service charge", accountName: "Bank Service Charges", correctSide: "debit", explanation: "The bank fee is an expense — expenses increase on the debit side.", week: 2 },
  { transaction: "Paid credit card bill of $231", accountName: "Credit Card Payable", correctSide: "debit", explanation: "Paying down a liability decreases it — liabilities decrease with debits.", week: 2 },
  { transaction: "Paid credit card bill of $231", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the bank to pay the credit card.", week: 2 },
  { transaction: "Collected $200 GST on a consulting sale", accountName: "GST/HST Payable", correctSide: "credit", explanation: "You owe this tax to CRA — liabilities increase with credits.", week: 2 },
  { transaction: "Bought printer paper on credit card for $45", accountName: "Supplies", correctSide: "debit", explanation: "Supplies are an expense — they increase on the debit side.", week: 2 },
  { transaction: "Bought printer paper on credit card for $45", accountName: "Credit Card Payable", correctSide: "credit", explanation: "You owe the credit card company — liabilities increase with credits.", week: 2 },
  { transaction: "Paid $500 accountant bill that was in Accounts Payable", accountName: "Accounts Payable", correctSide: "debit", explanation: "Paying a bill reduces what you owe — liabilities decrease with debits.", week: 2 },
  { transaction: "Paid $500 accountant bill that was in Accounts Payable", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left your bank to pay the bill.", week: 2 },
  { transaction: "Bought $84 supplies including $4 GST", accountName: "GST/HST Recoverable", correctSide: "debit", explanation: "GST paid on purchases is recoverable — it's an asset (CRA owes YOU).", week: 2 },
  { transaction: "Prepaid $600 for 12-month software license", accountName: "Prepaid Expenses", correctSide: "debit", explanation: "Paying upfront for future benefit creates an asset — prepaid goes up with debits.", week: 2 },
  { transaction: "Prepaid $600 for 12-month software license", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the bank to prepay the license.", week: 2 },
  { transaction: "Owner withdrew $1,000 from the business", accountName: "Shareholder Loan", correctSide: "debit", explanation: "The business is now owed money by the owner — the shareholder loan asset increases with a debit.", week: 2 },

  // Week 3 — Reports Room concepts
  { transaction: "Year-end: close $5,758 net income to equity", accountName: "Retained Earnings", correctSide: "credit", explanation: "Profits kept in the business increase equity — credit side.", week: 3 },
  { transaction: "Client paid an outstanding $2,100 invoice", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came in — assets increase with debits.", week: 3 },
  { transaction: "Client paid an outstanding $2,100 invoice", accountName: "Accounts Receivable", correctSide: "credit", explanation: "The client no longer owes you — A/R decreases with credits.", week: 3 },
  { transaction: "Year-end: close $5,758 net income to equity", accountName: "Income Summary", correctSide: "debit", explanation: "Closing the Income Summary account — debit to zero it out and move net income to Retained Earnings.", week: 3 },
  { transaction: "Wrote off $200 unpaid invoice as bad debt", accountName: "Bad Debt Expense", correctSide: "debit", explanation: "Writing off an uncollectible invoice is an expense — debit to increase.", week: 3 },
  { transaction: "Wrote off $200 unpaid invoice as bad debt", accountName: "Accounts Receivable", correctSide: "credit", explanation: "Removing the unpaid invoice reduces A/R — credit to decrease the asset.", week: 3 },
  { transaction: "Received $300 refund from cancelled flight", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came back in — assets increase with debits.", week: 3 },
  { transaction: "Received $300 refund from cancelled flight", accountName: "Travel Expense", correctSide: "credit", explanation: "The refund reduces the original expense — credit to decrease.", week: 3 },

  // Week 4 — Year-End Boss Fight
  { transaction: "Record $9,000 vehicle depreciation", accountName: "Depreciation Expense", correctSide: "debit", explanation: "Depreciation is an expense — expenses increase with debits.", week: 4 },
  { transaction: "Record $9,000 vehicle depreciation", accountName: "Accumulated Amortization - Vehicle", correctSide: "credit", explanation: "This contra-asset increases with credits, reducing the vehicle's book value.", week: 4 },
  { transaction: "Record home office claim of $450", accountName: "Home Office Use/Rent", correctSide: "debit", explanation: "Home office is an expense — it increases on the debit side.", week: 4 },
  { transaction: "Record home office claim of $450", accountName: "Shareholder Loan", correctSide: "credit", explanation: "You paid personally, so the business owes you — Shareholder Loan liability increases with a credit.", week: 4 },
  { transaction: "Record 500 km mileage claim at $0.70/km", accountName: "Vehicle Expense - Mileage", correctSide: "debit", explanation: "Mileage is an operating expense — debits increase expenses.", week: 4 },
  { transaction: "Record 500 km mileage claim at $0.70/km", accountName: "Shareholder Loan", correctSide: "credit", explanation: "You drove your personal car — the business owes you, so Shareholder Loan liability increases (credit).", week: 4 },
  { transaction: "Record $400 laptop depreciation (55% CCA rate)", accountName: "Depreciation Expense", correctSide: "debit", explanation: "Spreading the laptop cost over time creates an expense — debit side.", week: 4 },
  { transaction: "Record $400 laptop depreciation (55% CCA rate)", accountName: "Accumulated Amortization - Equipment", correctSide: "credit", explanation: "Accumulated amortization is a contra-asset — it increases with credits.", week: 4 },
];

// ---------------------------------------------------------------------------
// Game 2: Account Category Blitz
// ---------------------------------------------------------------------------

export type CategoryQuestion = {
  accountName: string;
  hint: string;
  correctCategory: AccountType;
  explanation: string;
  week: number;
};

export const categoryQuestions: CategoryQuestion[] = [
  // Week 1
  { accountName: "Bank/Cash", hint: "Money in your chequing account", correctCategory: "asset", explanation: "Cash is something your business OWNS — that makes it an asset.", week: 1 },
  { accountName: "Consulting Income", hint: "Revenue from client projects", correctCategory: "income", explanation: "Money earned from your work is income/revenue.", week: 1 },
  { accountName: "Supplies", hint: "Pens, paper, printer ink", correctCategory: "expense", explanation: "Small items consumed in daily operations are expenses.", week: 1 },
  { accountName: "Accounts Receivable", hint: "Money clients owe you", correctCategory: "asset", explanation: "IOUs from clients are something you OWN — an asset.", week: 1 },
  { accountName: "Accounts Payable", hint: "Bills you haven't paid yet", correctCategory: "liability", explanation: "Money you OWE to others is a liability.", week: 1 },
  { accountName: "Capital Stock", hint: "Owner's initial investment", correctCategory: "equity", explanation: "The owner's stake in the business is equity.", week: 1 },
  { accountName: "Telephone Expense", hint: "Monthly phone bill", correctCategory: "expense", explanation: "Phone bills are a regular operating expense.", week: 1 },
  { accountName: "Vehicle Expense", hint: "Fuel, parking, maintenance", correctCategory: "expense", explanation: "Costs of running a business vehicle are expenses.", week: 1 },
  { accountName: "Travel Expense", hint: "Flights and hotels for clients", correctCategory: "expense", explanation: "Business travel costs are operating expenses.", week: 1 },
  { accountName: "Meals & Entertainment", hint: "Client lunches and team dinners", correctCategory: "expense", explanation: "Business meals and entertainment are expenses (often only 50% deductible).", week: 1 },

  // Week 2
  { accountName: "Equipment", hint: "Laptop, printer, projector", correctCategory: "asset", explanation: "Long-lasting tools the business owns are fixed assets.", week: 2 },
  { accountName: "Credit Card Payable", hint: "Balance owed on business Visa", correctCategory: "liability", explanation: "You OWE the credit card company — that's a liability.", week: 2 },
  { accountName: "GST/HST Payable", hint: "Sales tax collected for CRA", correctCategory: "liability", explanation: "Tax you collected but must remit — you OWE it to the government.", week: 2 },
  { accountName: "GST/HST Recoverable", hint: "Sales tax YOU paid on purchases", correctCategory: "asset", explanation: "GST you paid on business purchases — CRA owes YOU this back. It's an asset.", week: 2 },
  { accountName: "Prepaid Expenses", hint: "Software subscription paid upfront", correctCategory: "asset", explanation: "You paid for future benefit — it's an asset until used up.", week: 2 },
  { accountName: "Shareholder Loan", hint: "Money owner lent to/from the company", correctCategory: "liability", explanation: "Money owed between the business and owner is a liability.", week: 2 },
  { accountName: "Bank Service Charges", hint: "Monthly bank fees", correctCategory: "expense", explanation: "Fees the bank charges are an operating expense.", week: 2 },
  { accountName: "Loans Payable", hint: "Business line of credit balance", correctCategory: "liability", explanation: "Money borrowed from a bank that you must repay — a liability.", week: 2 },
  { accountName: "Inventory", hint: "Products held for sale", correctCategory: "asset", explanation: "Goods you own that you plan to sell — a current asset.", week: 2 },

  // Week 3
  { accountName: "Retained Earnings", hint: "Profits kept in the business", correctCategory: "equity", explanation: "Accumulated profits belong to the owners — that's equity.", week: 3 },
  { accountName: "Sales Revenue", hint: "Income from selling products", correctCategory: "income", explanation: "Revenue from product sales is income.", week: 3 },
  { accountName: "Professional Fees", hint: "Accountant and lawyer bills", correctCategory: "expense", explanation: "Fees paid to professionals are operating expenses.", week: 3 },
  { accountName: "Insurance Expense", hint: "Business liability coverage", correctCategory: "expense", explanation: "Insurance premiums are operating expenses.", week: 3 },
  { accountName: "Bad Debt Expense", hint: "Invoice a client will never pay", correctCategory: "expense", explanation: "When you write off an uncollectible invoice, it becomes an expense.", week: 3 },
  { accountName: "Interest Income", hint: "Bank interest earned on savings", correctCategory: "income", explanation: "Interest earned by the business is a type of income.", week: 3 },
  { accountName: "Cost of Goods Sold", hint: "Direct cost of products sold", correctCategory: "expense", explanation: "The direct cost of producing/buying what you sold — it's an expense that reduces gross profit.", week: 3 },

  // Week 4
  { accountName: "Vehicle", hint: "Company car for client visits", correctCategory: "asset", explanation: "A vehicle the business owns is a fixed asset.", week: 4 },
  { accountName: "Depreciation Expense", hint: "Wear and tear on equipment", correctCategory: "expense", explanation: "Spreading an asset's cost over time is an expense.", week: 4 },
  { accountName: "Home Office Use/Rent", hint: "Business portion of home costs", correctCategory: "expense", explanation: "The business share of home costs is an operating expense.", week: 4 },
  { accountName: "Accumulated Amortization", hint: "Total depreciation recorded so far", correctCategory: "asset", explanation: "Technically a contra-asset — it reduces the asset's book value. It lives on the asset side of the Balance Sheet.", week: 4 },
  { accountName: "Vehicle Expense - Mileage", hint: "Per-km driving reimbursement", correctCategory: "expense", explanation: "Mileage claims for business driving are operating expenses.", week: 4 },
];

// ---------------------------------------------------------------------------
// Game 3: Balance the Entry
// ---------------------------------------------------------------------------

export type BalanceQuestion = {
  scenario: string;
  lines: { accountName: string; debitCents: number | null; creditCents: number | null }[];
  missingIndex: number;
  missingSide: "debit" | "credit";
  correctAmountCents: number;
  explanation: string;
  week: number;
};

export const balanceQuestions: BalanceQuestion[] = [
  // Week 1
  {
    scenario: "Client paid $1,000 for consulting work",
    lines: [
      { accountName: "Bank/Cash", debitCents: 100000, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 100000,
    explanation: "Total debits are $1,000. Credits must equal debits, so Consulting Income gets a $1,000 credit.", week: 1,
  },
  {
    scenario: "Bought supplies for $80 cash",
    lines: [
      { accountName: "Supplies", debitCents: null, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: 8000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 8000,
    explanation: "Credits total $80. The debit to Supplies must also be $80 to balance.", week: 1,
  },
  {
    scenario: "Owner invested $5,000 cash in the business",
    lines: [
      { accountName: "Bank/Cash", debitCents: 500000, creditCents: null },
      { accountName: "Capital Stock", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 500000,
    explanation: "Cash increased by $5,000 (debit). Capital Stock must be credited $5,000 — equity increases on the credit side.", week: 1,
  },
  {
    scenario: "Sent a $2,100 invoice (client will pay later)",
    lines: [
      { accountName: "Accounts Receivable", debitCents: null, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: 210000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 210000,
    explanation: "Revenue earned is $2,100 (credit). Accounts Receivable must be debited $2,100 — someone owes you.", week: 1,
  },
  {
    scenario: "Paid $65 for fuel on a client trip",
    lines: [
      { accountName: "Vehicle Expense", debitCents: 6500, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 6500,
    explanation: "Expense of $65 was debited. Bank/Cash must be credited $65 — cash left your account.", week: 1,
  },
  {
    scenario: "Booked $1,200 flight for a client project",
    lines: [
      { accountName: "Travel Expense", debitCents: null, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: 120000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 120000,
    explanation: "Bank credited $1,200. Travel Expense must be debited $1,200 to balance.", week: 1,
  },

  // Week 2
  {
    scenario: "Client paid $4,200 including 5% GST ($200 GST)",
    lines: [
      { accountName: "Bank/Cash", debitCents: 420000, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: 400000 },
      { accountName: "GST/HST Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 2, missingSide: "credit", correctAmountCents: 20000,
    explanation: "Debits = $4,200. Credits so far = $4,000. The remaining $200 is GST collected — credit to GST/HST Payable.", week: 2,
  },
  {
    scenario: "Paid $231 credit card bill from bank",
    lines: [
      { accountName: "Credit Card Payable", debitCents: 23100, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 23100,
    explanation: "You debited $231 to reduce the liability. Bank/Cash must be credited $231 to balance.", week: 2,
  },
  {
    scenario: "Paid $52 for a client lunch on credit card",
    lines: [
      { accountName: "Meals & Entertainment", debitCents: 5200, creditCents: null },
      { accountName: "Credit Card Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 5200,
    explanation: "Expense debited $52. Credit Card Payable must be credited $52 — you owe the card company.", week: 2,
  },
  {
    scenario: "Bought $84 supplies including $4 GST (on debit card)",
    lines: [
      { accountName: "Supplies", debitCents: 8000, creditCents: null },
      { accountName: "GST/HST Recoverable", debitCents: 400, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 2, missingSide: "credit", correctAmountCents: 8400,
    explanation: "Total debits = $80 + $4 = $84. Bank/Cash must be credited the full $84 you paid.", week: 2,
  },
  {
    scenario: "Prepaid $600 for a 12-month software license",
    lines: [
      { accountName: "Prepaid Expenses", debitCents: null, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: 60000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 60000,
    explanation: "Cash went down by $600. Prepaid Expenses must be debited $600 — you own future benefit.", week: 2,
  },

  // Week 3
  {
    scenario: "Wrote off $200 unpaid invoice as bad debt",
    lines: [
      { accountName: "Bad Debt Expense", debitCents: 20000, creditCents: null },
      { accountName: "Accounts Receivable", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 20000,
    explanation: "Bad debt of $200 was expensed. A/R must be credited $200 — the client won't pay.", week: 3,
  },
  {
    scenario: "Close $8,500 net income to Retained Earnings",
    lines: [
      { accountName: "Income Summary", debitCents: 850000, creditCents: null },
      { accountName: "Retained Earnings", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 850000,
    explanation: "Closing net income moves $8,500 to equity. Retained Earnings increases with a credit.", week: 3,
  },

  // Week 4
  {
    scenario: "Recorded $750 depreciation on equipment",
    lines: [
      { accountName: "Depreciation Expense", debitCents: null, creditCents: null },
      { accountName: "Accum. Amortization", debitCents: null, creditCents: 75000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 75000,
    explanation: "Credits total $750. Depreciation Expense must be debited $750 to keep the entry balanced.", week: 4,
  },
  {
    scenario: "Record $450 home office claim (Shareholder Loan)",
    lines: [
      { accountName: "Home Office Use/Rent", debitCents: 45000, creditCents: null },
      { accountName: "Shareholder Loan", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 45000,
    explanation: "You paid personally, so the business owes you $450. Shareholder Loan must be credited.", week: 4,
  },
  {
    scenario: "Record 500 km mileage at $0.70/km = $350",
    lines: [
      { accountName: "Vehicle Expense - Mileage", debitCents: null, creditCents: null },
      { accountName: "Shareholder Loan", debitCents: null, creditCents: 35000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 35000,
    explanation: "Shareholder Loan credited $350. Mileage expense must be debited $350 to balance.", week: 4,
  },
];

// ---------------------------------------------------------------------------
// Game 4: Cash Flow Snap
// ---------------------------------------------------------------------------

export type CashFlowQuestion = {
  event: string;
  correctAnswer: "up" | "down" | "no_change";
  explanation: string;
  week: number;
};

export const cashFlowQuestions: CashFlowQuestion[] = [
  // Week 1
  { event: "Client deposits $4,200 into your business bank account", correctAnswer: "up", explanation: "Cash came IN — your bank balance increases.", week: 1 },
  { event: "You pay $95 for the monthly phone bill", correctAnswer: "down", explanation: "Cash went OUT — you paid a bill from the bank.", week: 1 },
  { event: "You send a $2,100 invoice to a client (they'll pay in 30 days)", correctAnswer: "no_change", explanation: "No cash moved yet! You recorded revenue on account, but money hasn't arrived.", week: 1 },
  { event: "You buy $80 of supplies and pay with your debit card", correctAnswer: "down", explanation: "Cash left the bank account when you swiped the debit card.", week: 1 },
  { event: "Owner invests $5,000 into the business bank account", correctAnswer: "up", explanation: "Cash came IN from the owner's personal funds.", week: 1 },
  { event: "You pay the $15 monthly bank service fee", correctAnswer: "down", explanation: "The bank deducted the fee — cash went down.", week: 1 },
  { event: "You fill up the car with $65 fuel on the business debit card", correctAnswer: "down", explanation: "Cash left the bank — you paid for fuel.", week: 1 },
  { event: "You book a $1,200 flight and pay from your business account", correctAnswer: "down", explanation: "Cash left the bank to pay for the flight.", week: 1 },

  // Week 2
  { event: "You buy a $2,400 laptop for consulting work", correctAnswer: "down", explanation: "Cash left the bank to buy equipment.", week: 2 },
  { event: "Your accountant bills you $500 (invoice due in 30 days)", correctAnswer: "no_change", explanation: "No cash moved yet — you recorded the bill in Accounts Payable but haven't paid.", week: 2 },
  { event: "You pay this month's $231 credit card bill", correctAnswer: "down", explanation: "Cash went OUT to pay down the credit card liability.", week: 2 },
  { event: "A client buys $1,050 of services (including $50 GST)", correctAnswer: "up", explanation: "Cash came IN — the full $1,050 hit your bank account.", week: 2 },
  { event: "You buy printer paper with your business credit card", correctAnswer: "no_change", explanation: "No cash moved! You charged it to the credit card — Bank/Cash didn't change.", week: 2 },
  { event: "You prepay $600 for a yearly software license", correctAnswer: "down", explanation: "Cash left the bank — even though it's prepaid, the money went out now.", week: 2 },
  { event: "A supplier offers you 30-day terms on a $400 order", correctAnswer: "no_change", explanation: "No cash moved — you recorded the bill in Accounts Payable. You'll pay later.", week: 2 },
  { event: "You pay off last month's $400 supplier bill", correctAnswer: "down", explanation: "Cash went OUT — you paid the Accounts Payable balance.", week: 2 },

  // Week 3
  { event: "A client pays their outstanding $2,100 invoice", correctAnswer: "up", explanation: "Cash came IN — the client finally paid what they owed you.", week: 3 },
  { event: "You receive a $300 refund from a cancelled flight", correctAnswer: "up", explanation: "Cash came back IN to your bank account.", week: 3 },
  { event: "You close revenue and expense accounts to Retained Earnings", correctAnswer: "no_change", explanation: "Closing entries just reclassify balances — no cash moves.", week: 3 },
  { event: "You write off a $200 invoice that a client will never pay", correctAnswer: "no_change", explanation: "No cash moves — you're removing the receivable from your books. The money never came.", week: 3 },
  { event: "Bank pays you $12 interest on your savings account", correctAnswer: "up", explanation: "Interest deposited by the bank — cash goes up.", week: 3 },

  // Week 4
  { event: "You record $750 depreciation on your laptop", correctAnswer: "no_change", explanation: "Depreciation is a non-cash expense — no money actually leaves the bank.", week: 4 },
  { event: "You record a $450 home office expense claim", correctAnswer: "no_change", explanation: "This is an adjusting entry — no cash moves for the journal entry itself.", week: 4 },
  { event: "You record 500 km of business mileage at $0.70/km", correctAnswer: "no_change", explanation: "Mileage claims are adjusting entries — no cash leaves the bank for the journal entry.", week: 4 },
  { event: "You remit $850 GST/HST to CRA by bank transfer", correctAnswer: "down", explanation: "Cash left the bank to pay the tax authority — GST you collected must be remitted.", week: 4 },
  { event: "You record $9,000 vehicle depreciation for the year", correctAnswer: "no_change", explanation: "Depreciation allocates cost over time — it's a non-cash entry.", week: 4 },
];

// ---------------------------------------------------------------------------
// Game 5: Statement Sorter (Week 3)
// ---------------------------------------------------------------------------

export type StatementSortQuestion = {
  accountName: string;
  hint: string;
  correctStatement: "pl" | "bs";
  correctSection: string;
  explanation: string;
  week: number;
};

export const statementSortQuestions: StatementSortQuestion[] = [
  { accountName: "Consulting Income", hint: "Revenue from client work", correctStatement: "pl", correctSection: "Revenue", explanation: "Income accounts appear on the Profit & Loss — they show what you EARNED during the period.", week: 3 },
  { accountName: "Supplies", hint: "Office supplies used up", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Expenses appear on the P&L — they show what you SPENT during the period.", week: 3 },
  { accountName: "Bank/Cash", hint: "Money in your chequing account", correctStatement: "bs", correctSection: "Assets", explanation: "Cash is something you OWN at a point in time — it goes on the Balance Sheet.", week: 3 },
  { accountName: "Accounts Receivable", hint: "Money clients owe you", correctStatement: "bs", correctSection: "Assets", explanation: "A/R is what's owed to you RIGHT NOW — it's a Balance Sheet asset.", week: 3 },
  { accountName: "Equipment", hint: "Laptop and office furniture", correctStatement: "bs", correctSection: "Assets", explanation: "Equipment you own sits on the Balance Sheet as a fixed asset.", week: 3 },
  { accountName: "Accounts Payable", hint: "Bills you haven't paid yet", correctStatement: "bs", correctSection: "Liabilities", explanation: "What you OWE at this moment — Balance Sheet liability.", week: 3 },
  { accountName: "Telephone Expense", hint: "Monthly phone bill", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Phone costs are an expense for the PERIOD — P&L.", week: 3 },
  { accountName: "Credit Card Payable", hint: "Visa balance owing", correctStatement: "bs", correctSection: "Liabilities", explanation: "Outstanding credit card debt is a Balance Sheet liability.", week: 3 },
  { accountName: "Capital Stock", hint: "Owner's investment", correctStatement: "bs", correctSection: "Equity", explanation: "Owner's capital is equity — it goes on the Balance Sheet.", week: 3 },
  { accountName: "Retained Earnings", hint: "Accumulated profits", correctStatement: "bs", correctSection: "Equity", explanation: "Profits kept in the business are equity — Balance Sheet.", week: 3 },
  { accountName: "Travel Expense", hint: "Flights and hotels", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Travel costs are expenses for a period — they go on the P&L.", week: 3 },
  { accountName: "Meals & Entertainment", hint: "Client lunch receipts", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Entertainment costs are period expenses — P&L.", week: 3 },
  { accountName: "GST/HST Payable", hint: "Sales tax owed to CRA", correctStatement: "bs", correctSection: "Liabilities", explanation: "Tax you owe right now is a current liability — Balance Sheet.", week: 3 },
  { accountName: "Depreciation Expense", hint: "Wear and tear charge", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Depreciation expense is recorded for the period — it appears on the P&L.", week: 3 },
  { accountName: "Accum. Amortization", hint: "Total depreciation to date", correctStatement: "bs", correctSection: "Assets", explanation: "Accumulated amortization is a contra-asset — it appears on the Balance Sheet, reducing the asset value.", week: 3 },
  { accountName: "Cost of Goods Sold", hint: "Direct cost of products sold", correctStatement: "pl", correctSection: "Cost of Sales", explanation: "COGS is a direct cost deducted from revenue — it's on the P&L above gross profit.", week: 3 },
  { accountName: "Sales Revenue", hint: "Income from product sales", correctStatement: "pl", correctSection: "Revenue", explanation: "Revenue earned during the period goes on the P&L.", week: 3 },
  { accountName: "Prepaid Expenses", hint: "Annual license paid upfront", correctStatement: "bs", correctSection: "Assets", explanation: "Prepaid amounts are a current asset — you own future benefit. Balance Sheet.", week: 3 },
  { accountName: "Loans Payable", hint: "Bank line of credit balance", correctStatement: "bs", correctSection: "Liabilities", explanation: "Debt owed to the bank is a liability on the Balance Sheet.", week: 3 },
  { accountName: "Professional Fees", hint: "Accountant and lawyer costs", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Professional service costs are expenses for the period — P&L.", week: 3 },
];

// ---------------------------------------------------------------------------
// Game 6: Equation Hero (Week 3) — A = L + E
// ---------------------------------------------------------------------------

export type EquationQuestion = {
  scenario: string;
  givenLabel1: string;
  givenValue1: number;
  givenLabel2: string;
  givenValue2: number;
  missingLabel: string;
  correctValue: number;
  explanation: string;
  week: number;
};

export const equationQuestions: EquationQuestion[] = [
  { scenario: "Bright Path Consulting has $15,000 in assets and $6,000 in liabilities.", givenLabel1: "Assets", givenValue1: 15000, givenLabel2: "Liabilities", givenValue2: 6000, missingLabel: "Equity", correctValue: 9000, explanation: "A = L + E → $15,000 = $6,000 + E → E = $9,000. The owner's equity is what's left after subtracting what you owe.", week: 3 },
  { scenario: "A business has $3,000 in liabilities and $12,000 in equity.", givenLabel1: "Liabilities", givenValue1: 3000, givenLabel2: "Equity", givenValue2: 12000, missingLabel: "Assets", correctValue: 15000, explanation: "A = L + E → A = $3,000 + $12,000 = $15,000. Total assets must equal the combined claims of creditors and owners.", week: 3 },
  { scenario: "A startup has $20,000 in assets and $20,000 in equity.", givenLabel1: "Assets", givenValue1: 20000, givenLabel2: "Equity", givenValue2: 20000, missingLabel: "Liabilities", correctValue: 0, explanation: "A = L + E → $20,000 = L + $20,000 → L = $0. This business has no debt — everything is funded by the owner.", week: 3 },
  { scenario: "After a profitable month: $25,000 assets, $8,000 liabilities.", givenLabel1: "Assets", givenValue1: 25000, givenLabel2: "Liabilities", givenValue2: 8000, missingLabel: "Equity", correctValue: 17000, explanation: "A = L + E → $25,000 = $8,000 + E → E = $17,000. Profits increased equity.", week: 3 },
  { scenario: "Business took a $5,000 loan. Assets are now $30,000, equity is $22,000.", givenLabel1: "Assets", givenValue1: 30000, givenLabel2: "Equity", givenValue2: 22000, missingLabel: "Liabilities", correctValue: 8000, explanation: "A = L + E → $30,000 = L + $22,000 → L = $8,000. The loan (and any other debts) total $8,000.", week: 3 },
  { scenario: "End of June: liabilities $4,200, equity $11,800.", givenLabel1: "Liabilities", givenValue1: 4200, givenLabel2: "Equity", givenValue2: 11800, missingLabel: "Assets", correctValue: 16000, explanation: "A = L + E → A = $4,200 + $11,800 = $16,000. Everything the business owns totals $16,000.", week: 3 },
  { scenario: "Owner withdrew $2,000. Assets $18,000, liabilities $7,000.", givenLabel1: "Assets", givenValue1: 18000, givenLabel2: "Liabilities", givenValue2: 7000, missingLabel: "Equity", correctValue: 11000, explanation: "A = L + E → $18,000 = $7,000 + E → E = $11,000. The withdrawal reduced equity from what it was.", week: 3 },
  { scenario: "New business: owner invested $10,000 cash, no debts.", givenLabel1: "Liabilities", givenValue1: 0, givenLabel2: "Equity", givenValue2: 10000, missingLabel: "Assets", correctValue: 10000, explanation: "A = L + E → A = $0 + $10,000 = $10,000. On day one, assets equal the owner's investment.", week: 3 },
];

// ---------------------------------------------------------------------------
// Game 7: Report Reader (Week 3) — Interpret financial statements
// ---------------------------------------------------------------------------

export type ReportReaderQuestion = {
  scenario: string;
  statementData: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  week: number;
};

export const reportReaderQuestions: ReportReaderQuestion[] = [
  {
    scenario: "Bright Path Consulting — June P&L",
    statementData: "Revenue: $8,400 | Expenses: $2,642 | Net Income: $5,758",
    question: "Was June profitable?",
    options: ["Yes — net income is positive", "No — expenses are too high", "Can't tell from this data"],
    correctIndex: 0,
    explanation: "Net income of $5,758 means revenue exceeded expenses. June was profitable!", week: 3,
  },
  {
    scenario: "Bright Path Consulting — June P&L",
    statementData: "Revenue: $8,400 | Expenses: $2,642 | Net Income: $5,758",
    question: "What percentage of revenue went to expenses?",
    options: ["About 31%", "About 50%", "About 69%"],
    correctIndex: 0,
    explanation: "$2,642 ÷ $8,400 = 31.5%. Less than a third of revenue went to expenses — a healthy margin.", week: 3,
  },
  {
    scenario: "Balance Sheet — June 30",
    statementData: "Assets: $16,000 | Liabilities: $4,200 | Equity: $11,800",
    question: "Does the accounting equation balance?",
    options: ["Yes — Assets = Liabilities + Equity", "No — there's an error", "Need more information"],
    correctIndex: 0,
    explanation: "$16,000 = $4,200 + $11,800 ✓ The equation balances perfectly.", week: 3,
  },
  {
    scenario: "Two months compared",
    statementData: "June Revenue: $8,400, Expenses: $2,642 | July Revenue: $6,200, Expenses: $3,100",
    question: "Which month had better profitability?",
    options: ["June — higher net income ($5,758 vs $3,100)", "July — lower expenses", "They're about equal"],
    correctIndex: 0,
    explanation: "June net income: $5,758. July net income: $3,100. June was more profitable by $2,658.", week: 3,
  },
  {
    scenario: "Cash position review",
    statementData: "P&L shows Net Income: $5,758 | Balance Sheet shows Cash: $2,300, A/R: $4,200",
    question: "The business is profitable but cash is low. Why?",
    options: ["$4,200 in invoices haven't been collected yet", "The P&L is wrong", "Expenses were too high"],
    correctIndex: 0,
    explanation: "Profit doesn't mean cash! $4,200 is sitting in Accounts Receivable — clients owe money but haven't paid yet.", week: 3,
  },
  {
    scenario: "Growth decision",
    statementData: "Revenue: $8,400 | Net Income: $5,758 | Cash: $2,300 | Credit Card Payable: $231",
    question: "Should you buy a $3,000 marketing package right now?",
    options: ["Risky — only $2,300 cash available", "Yes — net income covers it", "Yes — the business is profitable enough"],
    correctIndex: 0,
    explanation: "Profitability ≠ cash available. With only $2,300 in the bank, a $3,000 purchase would overdraw the account. Wait for A/R to be collected.", week: 3,
  },
  {
    scenario: "Debt assessment",
    statementData: "Assets: $16,000 | Liabilities: $12,000 | Equity: $4,000",
    question: "Is this business heavily leveraged (in debt)?",
    options: ["Yes — liabilities are 75% of assets", "No — it has positive equity", "Can't tell without the P&L"],
    correctIndex: 0,
    explanation: "$12,000 ÷ $16,000 = 75% debt-to-assets ratio. That's high — most of the business is funded by debt, not the owner.", week: 3,
  },
  {
    scenario: "Year-end closing",
    statementData: "P&L Net Income: $5,758 | Previous Retained Earnings: $0 (first year)",
    question: "What will Retained Earnings be after closing?",
    options: ["$5,758", "$0", "$5,758 minus dividends only"],
    correctIndex: 0,
    explanation: "Net income flows to Retained Earnings at year-end. First year, no prior balance, so RE = $5,758.", week: 3,
  },
];

// ---------------------------------------------------------------------------
// Game 8: Year-End Prep (Week 4) — Calculations & handoff
// ---------------------------------------------------------------------------

export type YearEndQuestion = {
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "depreciation" | "home_office" | "mileage" | "handoff";
  week: number;
};

export const yearEndQuestions: YearEndQuestion[] = [
  // Depreciation
  {
    scenario: "You bought a laptop for $2,400 in June. CCA rate for computers is 55%.",
    question: "What is the first-year depreciation? (Half-year rule applies: use half the rate in year 1)",
    options: ["$660", "$1,320", "$2,400", "$550"],
    correctIndex: 0,
    explanation: "$2,400 × 55% × 50% (half-year rule) = $660. In the first year, CRA only allows half the normal rate.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Your company vehicle cost $45,000. CCA rate for vehicles is 30%.",
    question: "What is the first-year depreciation?",
    options: ["$6,750", "$13,500", "$4,500", "$9,000"],
    correctIndex: 0,
    explanation: "$45,000 × 30% × 50% (half-year rule) = $6,750. The half-year rule applies to the first year.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Equipment with a net book value of $5,000. CCA rate is 20%.",
    question: "What is this year's depreciation? (Not the first year)",
    options: ["$1,000", "$500", "$5,000", "$2,500"],
    correctIndex: 0,
    explanation: "$5,000 × 20% = $1,000. After the first year, you apply the full rate to the remaining book value.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Laptop cost $2,400, accumulated depreciation is $660.",
    question: "What is the net book value (NBV)?",
    options: ["$1,740", "$2,400", "$660", "$3,060"],
    correctIndex: 0,
    explanation: "$2,400 - $660 = $1,740. NBV = Original Cost - Accumulated Depreciation.",
    category: "depreciation", week: 4,
  },

  // Home office
  {
    scenario: "Your home is 1,200 sq ft. Your office is 120 sq ft.",
    question: "What percentage of home expenses can you claim?",
    options: ["10%", "12%", "20%", "25%"],
    correctIndex: 0,
    explanation: "120 ÷ 1,200 = 10%. You can claim 10% of eligible home expenses.",
    category: "home_office", week: 4,
  },
  {
    scenario: "Home office is 10% of your home. Annual rent: $18,000, utilities: $3,600, internet: $1,200.",
    question: "What is your total home office claim?",
    options: ["$2,280", "$22,800", "$1,800", "$2,400"],
    correctIndex: 0,
    explanation: "($18,000 + $3,600 + $1,200) × 10% = $22,800 × 10% = $2,280.",
    category: "home_office", week: 4,
  },
  {
    scenario: "Your home office is 150 sq ft in a 1,500 sq ft home. Monthly rent: $1,800.",
    question: "What is the monthly home office rent claim?",
    options: ["$180", "$150", "$1,800", "$90"],
    correctIndex: 0,
    explanation: "150 ÷ 1,500 = 10%. $1,800 × 10% = $180 per month.",
    category: "home_office", week: 4,
  },

  // Mileage
  {
    scenario: "You drove 4,000 km for business this year.",
    question: "At $0.70/km, what is your mileage claim?",
    options: ["$2,800", "$2,400", "$4,000", "$700"],
    correctIndex: 0,
    explanation: "4,000 km × $0.70 = $2,800. Straightforward when under the 5,000 km tier.",
    category: "mileage", week: 4,
  },
  {
    scenario: "You drove 7,000 km for business. Rate: first 5,000 km at $0.70, remaining at $0.64.",
    question: "What is the total mileage claim?",
    options: ["$4,780", "$4,900", "$4,480", "$3,500"],
    correctIndex: 0,
    explanation: "(5,000 × $0.70) + (2,000 × $0.64) = $3,500 + $1,280 = $4,780. The rate drops after the first 5,000 km.",
    category: "mileage", week: 4,
  },
  {
    scenario: "You drove 500 km this month for business at $0.70/km.",
    question: "Which side does the mileage expense go on?",
    options: ["Debit — it's an expense", "Credit — you're paying it", "Either side works", "It's not a journal entry"],
    correctIndex: 0,
    explanation: "Vehicle Expense - Mileage is debited (expenses increase with debits). Shareholder Loan is credited (you're owed the money).",
    category: "mileage", week: 4,
  },

  // Accountant handoff
  {
    scenario: "Year-end is approaching. Your accountant needs your books.",
    question: "Which of these is NOT part of a standard handoff package?",
    options: ["Your personal bank statements", "Trial balance", "Profit & Loss statement", "Bank reconciliation"],
    correctIndex: 0,
    explanation: "Personal bank statements are not part of business books. Your accountant needs the business trial balance, P&L, BS, GL, and bank recs.",
    category: "handoff", week: 4,
  },
  {
    scenario: "Preparing the year-end package for your accountant.",
    question: "What must be true about your trial balance before handing it off?",
    options: ["Total debits must equal total credits", "All accounts must have debit balances", "Revenue must exceed expenses", "It must be signed by the owner"],
    correctIndex: 0,
    explanation: "A trial balance must balance — total debits = total credits. If it doesn't, there's an error to fix first.",
    category: "handoff", week: 4,
  },
  {
    scenario: "Your accountant asks for supporting documents.",
    question: "What would you include for a mileage claim?",
    options: ["A mileage log with dates, destinations, km, and business purpose", "Just the total kilometres driven", "Gas station receipts only", "A letter from your mechanic"],
    correctIndex: 0,
    explanation: "CRA requires a detailed mileage log: date, destination, distance, and business purpose for each trip.",
    category: "handoff", week: 4,
  },
  {
    scenario: "Year-end adjustments are complete.",
    question: "What's the correct order for preparing year-end reports?",
    options: ["Adjusted TB → P&L → Balance Sheet", "Balance Sheet → P&L → TB", "P&L → TB → Balance Sheet", "Any order works"],
    correctIndex: 0,
    explanation: "Start with the adjusted trial balance, then build the P&L (period report), then the Balance Sheet (point-in-time snapshot).",
    category: "handoff", week: 4,
  },
  {
    scenario: "Your accountant needs to verify equipment purchases.",
    question: "What supporting document should you provide?",
    options: ["The original purchase invoice/receipt", "A photo of the equipment", "Just the journal entry printout", "An insurance certificate"],
    correctIndex: 0,
    explanation: "The original invoice shows the purchase date, amount, and vendor — essential for CCA calculations and audit trail.",
    category: "handoff", week: 4,
  },
];
