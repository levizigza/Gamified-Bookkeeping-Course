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
  { transaction: "Paid $65 fuel for client visit", accountName: "Travel Expense", correctSide: "debit", explanation: "Fuel for client travel is an operating expense — debits increase expenses. Pick Travel and stick with it (consistency).", week: 1 },
  { transaction: "Paid $65 fuel for client visit", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the bank when you paid at the pump.", week: 1 },
  { transaction: "Paid $22 parking at downtown client meeting", accountName: "Travel Expense", correctSide: "debit", explanation: "Parking for business travel is a travel expense — debit to increase. Same bucket every time.", week: 1 },
  { transaction: "Booked $1,200 flight to Edmonton for a project", accountName: "Travel Expense", correctSide: "debit", explanation: "Business travel costs are expenses — they increase with debits.", week: 1 },
  { transaction: "Booked $1,200 flight to Edmonton for a project", accountName: "Bank/Cash", correctSide: "credit", explanation: "You paid for the flight from your bank account — cash decreased.", week: 1 },
  { transaction: "Paid $85 for team lunch (entertainment)", accountName: "Meals & Entertainment", correctSide: "debit", explanation: "Business meals and entertainment are expenses — expenses go up with debits.", week: 1 },
  { transaction: "Bought $40/month software subscription", accountName: "Software/Subscriptions", correctSide: "debit", explanation: "Monthly software costs are operating expenses — debit to record. Same pattern as daily spends.", week: 1 },
  { transaction: "Paid $150 for internet (40% business use)", accountName: "Office Expenses", correctSide: "debit", explanation: "Shared workspace/internet costs often land in Office Expenses — debit the business portion.", week: 1 },
  { transaction: "Paid $44.10 taxi to a client site ($42 + $2.10 GST)", accountName: "Travel Expense", correctSide: "debit", explanation: "You gained a ride. The $42 base is Travel Expense — expenses increase with debits.", week: 1 },
  { transaction: "Paid $44.10 taxi to a client site ($42 + $2.10 GST)", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash went OUT for the taxi. Asset accounts decrease with credits.", week: 1 },
  { transaction: "Paid $44.10 taxi to a client site ($42 + $2.10 GST)", accountName: "GST/HST Payable", correctSide: "debit", explanation: "GST you paid on a business ride is an input tax credit — debit GST/HST Payable (it reduces what you owe CRA).", week: 1 },
  { transaction: "Bought $200 Home Depot materials + $10 GST ($210 total)", accountName: "Supplies", correctSide: "debit", explanation: "Job materials are Supplies / direct cost — debit. Never migrate them to Office Expenses later (consistency).", week: 1 },
  { transaction: "Bought $200 Home Depot materials + $10 GST ($210 total)", accountName: "GST/HST Payable", correctSide: "debit", explanation: "Split sales tax from the materials. Debit GST/HST Payable for the input tax credit.", week: 1 },
  { transaction: "Bought $200 Home Depot materials + $10 GST ($210 total)", accountName: "Bank/Cash", correctSide: "credit", explanation: "You paid the full $210 receipt from the bank — cash went down (credit).", week: 1 },
  { transaction: "Paid monthly telephone bill $95", accountName: "Telephone Expense", correctSide: "debit", explanation: "Monthly bills (phone, insurance, subscriptions) use the same double-entry pattern as daily spends — debit the expense.", week: 1 },
  { transaction: "Bought a $480 cordless drill for client jobs", accountName: "Equipment", correctSide: "debit", explanation: "Tools that last years are Equipment (an asset), not Supplies. Cash went out; you gained equipment.", week: 1 },
  { transaction: "Bought a $480 cordless drill for client jobs", accountName: "Bank/Cash", correctSide: "credit", explanation: "Cash left the bank for the drill — assets decrease with credits.", week: 1 },


  // Week 2 — spending/selling (cash now or later) + account buckets toward trial balance
  { transaction: "Sold consulting work — client paid $1,050 cash today", accountName: "Bank/Cash", correctSide: "debit", explanation: "Selling with immediate funds: cash/bank goes up — debit the current asset.", week: 2 },
  { transaction: "Sold consulting work — client paid $1,050 cash today", accountName: "Consulting Income", correctSide: "credit", explanation: "Income/revenue is the gain from services sold — credit income; it increases assets.", week: 2 },
  { transaction: "Invoiced a client $2,100 — due in 30 days (no cash yet)", accountName: "Accounts Receivable", correctSide: "debit", explanation: "Selling with no immediate funds: receivable (current asset) goes up until they pay.", week: 2 },
  { transaction: "Invoiced a client $2,100 — due in 30 days (no cash yet)", accountName: "Consulting Income", correctSide: "credit", explanation: "You still earned income — revenue increases even when cash arrives later.", week: 2 },
  { transaction: "Bought a $2,400 laptop for work (paid from bank)", accountName: "Equipment", correctSide: "debit", explanation: "Fixed asset: equipment you hold to help generate income — debits increase assets.", week: 2 },
  { transaction: "Bought a $2,400 laptop for work (paid from bank)", accountName: "Bank/Cash", correctSide: "credit", explanation: "Spending with immediate funds: cash went out — credit Bank/Cash.", week: 2 },
  { transaction: "Bought office furniture $800 on the business credit card", accountName: "Furniture and Fixtures", correctSide: "debit", explanation: "Furniture and fittings are fixed assets — held long-term to support the business.", week: 2 },
  { transaction: "Bought office furniture $800 on the business credit card", accountName: "Credit Card Payable", correctSide: "credit", explanation: "Spending with no immediate bank funds: current liability (credit card) goes up.", week: 2 },
  { transaction: "Drew $3,000 on the business line of credit into the bank", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash/bank (current asset) increased when the LOC funded your account.", week: 2 },
  { transaction: "Drew $3,000 on the business line of credit into the bank", accountName: "Line of Credit", correctSide: "credit", explanation: "Line of credit is a current liability — what you owe and will likely pay within a year.", week: 2 },
  { transaction: "Took a $20,000 five-year bank loan — cash deposited", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came in now — debit Bank/Cash.", week: 2 },
  { transaction: "Took a $20,000 five-year bank loan — cash deposited", accountName: "Bank Loan Payable", correctSide: "credit", explanation: "Long-term liability: bank loan carried for one year or more — credit the loan.", week: 2 },
  { transaction: "Prepaid $600 for a 12-month software license", accountName: "Prepaid Expenses", correctSide: "debit", explanation: "Current asset: prepaid expenses will be used within a year.", week: 2 },
  { transaction: "Prepaid $600 for a 12-month software license", accountName: "Bank/Cash", correctSide: "credit", explanation: "Immediate funds left the bank — even though the benefit is prepaid.", week: 2 },
  { transaction: "Bought $400 of inventory on 30-day supplier terms", accountName: "Inventory", correctSide: "debit", explanation: "Current asset from trading — inventory you will sell or use within about a year.", week: 2 },
  { transaction: "Bought $400 of inventory on 30-day supplier terms", accountName: "Accounts Payable", correctSide: "credit", explanation: "No immediate funds: money owed to a third party soon — current liability.", week: 2 },
  { transaction: "Collected $200 GST on a consulting sale", accountName: "GST/HST Payable", correctSide: "credit", explanation: "Taxes payable are a current liability — you owe CRA, not income.", week: 2 },
  { transaction: "Paid credit card bill of $231 from the bank", accountName: "Credit Card Payable", correctSide: "debit", explanation: "Paying a current liability decreases it — liabilities decrease with debits.", week: 2 },
  { transaction: "Paid credit card bill of $231 from the bank", accountName: "Bank/Cash", correctSide: "credit", explanation: "Immediate funds out — current asset Bank/Cash decreases (credit).", week: 2 },
  { transaction: "Owner invested $5,000 cash for shares", accountName: "Capital Stock", correctSide: "credit", explanation: "Equity grows when the owner invests — equity increases with credits.", week: 2 },

  // Week 3 — Reports Room concepts
  { transaction: "Year-end: close $5,758 net income to equity", accountName: "Retained Earnings", correctSide: "credit", explanation: "Profits kept in the business increase equity — credit side.", week: 3 },
  { transaction: "Client paid an outstanding $2,100 invoice", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came in — assets increase with debits.", week: 3 },
  { transaction: "Client paid an outstanding $2,100 invoice", accountName: "Accounts Receivable", correctSide: "credit", explanation: "The client no longer owes you — A/R decreases with credits.", week: 3 },
  { transaction: "Year-end: close $5,758 net income to equity", accountName: "Income Summary", correctSide: "debit", explanation: "Closing the Income Summary account — debit to zero it out and move net income to Retained Earnings.", week: 3 },
  { transaction: "Wrote off $200 unpaid invoice as bad debt", accountName: "Bad Debt Expense", correctSide: "debit", explanation: "Writing off an uncollectible invoice is an expense — debit to increase.", week: 3 },
  { transaction: "Wrote off $200 unpaid invoice as bad debt", accountName: "Accounts Receivable", correctSide: "credit", explanation: "Removing the unpaid invoice reduces A/R — credit to decrease the asset.", week: 3 },
  { transaction: "Received $300 refund from cancelled flight", accountName: "Bank/Cash", correctSide: "debit", explanation: "Cash came back in — assets increase with debits.", week: 3 },
  { transaction: "Received $300 refund from cancelled flight", accountName: "Travel Expense", correctSide: "credit", explanation: "The refund reduces the original expense — credit to decrease.", week: 3 },

  // Week 4 — year-end common journals (Journals #1–#3)
  { transaction: "Journal #1: record $14,500 total depreciation", accountName: "Depreciation Expense", correctSide: "debit", explanation: "Journal #1 debits Depreciation expenses for vehicle + furniture + computers amortization.", week: 4 },
  { transaction: "Journal #1: vehicle amortization $9,000", accountName: "Accumulated Amortization - Vehicle", correctSide: "credit", explanation: "Cum. Amortization - Vehicle is credited $9,000 ($30,000 × 30%).", week: 4 },
  { transaction: "Journal #2: home office claim $3,585", accountName: "Home Office Use/Rent", correctSide: "debit", explanation: "10% of $35,850 eligible home costs — debit Home office use/rent.", week: 4 },
  { transaction: "Journal #2: home office claim $3,585", accountName: "Shareholder Loan", correctSide: "credit", explanation: "Credit Shareholders' loan — the business owes you for home costs you paid personally.", week: 4 },
  { transaction: "Journal #3: mileage claim $15,600", accountName: "Vehicle Expense - Mileage", correctSide: "debit", explanation: "Debit Vehicle expenses (Mileage) for (5,000 × $0.68) + (20,000 × $0.61).", week: 4 },
  { transaction: "Journal #3: mileage claim $15,600", accountName: "Shareholder Loan", correctSide: "credit", explanation: "Credit Shareholders' loan when mileage costs were personally funded.", week: 4 },
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
  // Week 1 — everyday bookkeeping categories (meals, travel, office, supplies, equipment)
  { accountName: "Bank/Cash", hint: "Money in your chequing account", correctCategory: "asset", explanation: "Cash is something your business OWNS — that makes it an asset.", week: 1 },
  { accountName: "Consulting Income", hint: "Revenue from client projects", correctCategory: "income", explanation: "Money earned from your work is income/revenue.", week: 1 },
  { accountName: "Supplies", hint: "Workshop materials, pens, Home Depot job materials", correctCategory: "expense", explanation: "Consumable materials and job supplies are expenses. Consistency: keep them in Supplies — not Office Expenses later.", week: 1 },
  { accountName: "Office Expenses", hint: "Cleaning, minor workspace costs", correctCategory: "expense", explanation: "General workspace costs belong in Office Expenses — do not dump job materials here.", week: 1 },
  { accountName: "Travel Expense", hint: "Fuel, parking, taxis, flights for client work", correctCategory: "expense", explanation: "Business travel costs are operating expenses. Consistency: keep taxis and fuel here — not in Office Expenses.", week: 1 },
  { accountName: "Meals & Entertainment", hint: "Client lunches and team dinners", correctCategory: "expense", explanation: "Business meals and entertainment are expenses (often only 50% deductible).", week: 1 },
  { accountName: "Equipment", hint: "Laptop or tools that last years", correctCategory: "asset", explanation: "Long-lasting tools the business owns are assets — not a one-time mystery expense.", week: 1 },
  { accountName: "Telephone Expense", hint: "Monthly phone bill", correctCategory: "expense", explanation: "Monthly bills (phone, insurance, subscriptions) are still operating expenses — same pattern as daily spends.", week: 1 },
  { accountName: "GST/HST Payable", hint: "Sales tax YOU paid on a taxi or Home Depot run (input tax credit)", correctCategory: "liability", explanation: "In this course, GST on purchases is debited to GST/HST Payable as an input tax credit — one net tax account, not a separate recoverable asset.", week: 1 },

  // Week 2 — current vs fixed assets, current vs long-term liabilities, income, expense, equity
  { accountName: "Accounts Receivable", hint: "Current asset — clients owe you within a year", correctCategory: "asset", explanation: "Receivable from trading: a current asset. Selling with no immediate funds still increases what you own.", week: 2 },
  { accountName: "Prepaid Expenses", hint: "Current asset — benefit used within ~1 year", correctCategory: "asset", explanation: "Prepaid software or insurance is a current asset until you use it up.", week: 2 },
  { accountName: "Inventory", hint: "Current asset — goods from trading, under 1 year", correctCategory: "asset", explanation: "Inventory you will sell or use soon is a current asset.", week: 2 },
  { accountName: "Building", hint: "Fixed asset — held to help generate income", correctCategory: "asset", explanation: "A building is a fixed asset: valuable property you hold because it helps earn revenue.", week: 2 },
  { accountName: "Vehicle", hint: "Fixed asset — company car used for years", correctCategory: "asset", explanation: "Vehicles are fixed assets — not a one-month expense.", week: 2 },
  { accountName: "Furniture and Fixtures", hint: "Fixed asset — desks and fittings", correctCategory: "asset", explanation: "Furniture and fittings are fixed assets held long-term to support the business.", week: 2 },
  { accountName: "Investments (long-term)", hint: "Fixed asset — held for lasting value/income", correctCategory: "asset", explanation: "Long-term investments sit with fixed assets when you hold them to contribute to income.", week: 2 },
  { accountName: "Credit Card Payable", hint: "Current liability — due within a year", correctCategory: "liability", explanation: "Credit card is a current liability — what you owe and will likely pay within a year.", week: 2 },
  { accountName: "Line of Credit", hint: "Current liability — revolving bank credit", correctCategory: "liability", explanation: "Line of credit balances are current liabilities.", week: 2 },
  { accountName: "GST/HST Payable", hint: "Current liability — taxes owed to CRA", correctCategory: "liability", explanation: "Taxes collected are a current liability until remitted — not your income.", week: 2 },
  { accountName: "Shareholder Loan", hint: "Current liability — owed to the owner", correctCategory: "liability", explanation: "Shareholder’s loan is typically a current liability for small corporations.", week: 2 },
  { accountName: "Bank Loan (5-year)", hint: "Long-term liability — carried 1+ years", correctCategory: "liability", explanation: "A multi-year bank loan is a long-term liability — it will reduce assets as you repay it.", week: 2 },
  { accountName: "Mortgage Payable", hint: "Long-term liability — property debt", correctCategory: "liability", explanation: "Mortgages are long-term liabilities paid over many years.", week: 2 },
  { accountName: "Accounts Payable", hint: "Current liability — money owed to a third party soon", correctCategory: "liability", explanation: "Supplier bills due within a year are current liabilities.", week: 2 },
  { accountName: "Consulting Income", hint: "Income — gain from services sold", correctCategory: "income", explanation: "Income/revenue increases your assets when you sell services or goods.", week: 2 },
  { accountName: "Bank Service Charges", hint: "Expense — spending that reduces assets", correctCategory: "expense", explanation: "Expenses are money spent to acquire a service — they reduce assets.", week: 2 },
  { accountName: "Capital Stock", hint: "Equity — owner wealth invested", correctCategory: "equity", explanation: "Equity shows how owner wealth is growing or reducing — Capital Stock is owner investment.", week: 2 },
  { accountName: "Retained Earnings", hint: "Equity — profits kept in the business", correctCategory: "equity", explanation: "Retained Earnings is the equity aggregate of wealth growing or shrinking from profits.", week: 2 },

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
      { accountName: "Travel Expense", debitCents: 6500, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 6500,
    explanation: "Expense of $65 was debited to Travel. Bank/Cash must be credited $65 — cash left your account.", week: 1,
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
  {
    scenario: "Taxi to client site: $42 + $2.10 GST ($44.10 total cash)",
    lines: [
      { accountName: "Travel Expense", debitCents: 4200, creditCents: null },
      { accountName: "GST/HST Payable", debitCents: null, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: 4410 },
    ],
    missingIndex: 1, missingSide: "debit", correctAmountCents: 210,
    explanation: "Cash out $44.10 and Travel Expense $42. The missing $2.10 debit is GST you can recover — sales tax split from the ride.", week: 1,
  },
  {
    scenario: "Client lunch $80 + $4 GST on the business card (meals & entertainment)",
    lines: [
      { accountName: "Meals & Entertainment", debitCents: null, creditCents: null },
      { accountName: "GST/HST Payable", debitCents: 400, creditCents: null },
      { accountName: "Credit Card Payable", debitCents: null, creditCents: 8400 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 8000,
    explanation: "Credits total $84. GST is $4. Meals & Entertainment must be debited $80 — everyday entertainment, split from tax.", week: 1,
  },
  {
    scenario: "Home Depot materials: $200 + $10 GST paid from bank",
    lines: [
      { accountName: "Supplies", debitCents: 20000, creditCents: null },
      { accountName: "GST/HST Payable", debitCents: 1000, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 2, missingSide: "credit", correctAmountCents: 21000,
    explanation: "Debits total $210. Bank/Cash must be credited $210 — cash went down when you paid the receipt.", week: 1,
  },
  {
    scenario: "Client paid $4,200 including 5% GST ($200 GST)",
    lines: [
      { accountName: "Bank/Cash", debitCents: 420000, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: 400000 },
      { accountName: "GST/HST Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 2, missingSide: "credit", correctAmountCents: 20000,
    explanation: "Debits = $4,200. Credits so far = $4,000. The remaining $200 is GST collected — credit to GST/HST Payable.", week: 1,
  },

  // Week 2 — entries that feed the month-end trial balance (spend/sell, cash now or later)
  {
    scenario: "Sold services — client paid $1,050 cash (immediate funds)",
    lines: [
      { accountName: "Bank/Cash", debitCents: 105000, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 105000,
    explanation: "Selling with immediate funds. Debits $1,050 — income must be credited $1,050 so the trial balance stays even.", week: 2,
  },
  {
    scenario: "Invoiced client $2,100 — due in 30 days (no immediate funds)",
    lines: [
      { accountName: "Accounts Receivable", debitCents: null, creditCents: null },
      { accountName: "Consulting Income", debitCents: null, creditCents: 210000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 210000,
    explanation: "Selling with no cash yet. Credits $2,100 — debit Receivable $2,100. Both sides will appear on the trial balance.", week: 2,
  },
  {
    scenario: "Bought $800 furniture on credit card (no bank cash yet)",
    lines: [
      { accountName: "Furniture and Fixtures", debitCents: 80000, creditCents: null },
      { accountName: "Credit Card Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 80000,
    explanation: "Fixed asset up; current liability up. Debits $800 — credit Credit Card Payable $800.", week: 2,
  },
  {
    scenario: "Paid $231 credit card bill from bank",
    lines: [
      { accountName: "Credit Card Payable", debitCents: 23100, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 23100,
    explanation: "You reduced a current liability. Bank/Cash must be credited $231 — trial balance stays balanced.", week: 2,
  },
  {
    scenario: "Prepaid $600 for a 12-month software license",
    lines: [
      { accountName: "Prepaid Expenses", debitCents: null, creditCents: null },
      { accountName: "Bank/Cash", debitCents: null, creditCents: 60000 },
    ],
    missingIndex: 0, missingSide: "debit", correctAmountCents: 60000,
    explanation: "Current asset Prepaid goes up $600; cash down $600. Debits must equal credits on the trial balance.", week: 2,
  },
  {
    scenario: "Five-year bank loan $20,000 deposited to bank",
    lines: [
      { accountName: "Bank/Cash", debitCents: 2000000, creditCents: null },
      { accountName: "Bank Loan Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 2000000,
    explanation: "Cash (current asset) up; long-term liability up. Credit Bank Loan $20,000 to balance.", week: 2,
  },
  {
    scenario: "Bought $400 inventory on 30-day terms",
    lines: [
      { accountName: "Inventory", debitCents: 40000, creditCents: null },
      { accountName: "Accounts Payable", debitCents: null, creditCents: null },
    ],
    missingIndex: 1, missingSide: "credit", correctAmountCents: 40000,
    explanation: "Current asset Inventory up; current liability AP up. Credit AP $400 — no immediate funds.", week: 2,
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
  // Week 1 — why organized books matter: see cash health at a glance
  { event: "Client deposits $4,200 into your business bank account", correctAnswer: "up", explanation: "Organized books show cash IN clearly — your bank balance increases and you can assess health.", week: 1 },
  { event: "You pay $95 for the monthly phone bill", correctAnswer: "down", explanation: "Monthly bills still move cash. Recording them daily/weekly keeps your picture of health accurate.", week: 1 },
  { event: "You send a $2,100 invoice to a client (they'll pay in 30 days)", correctAnswer: "no_change", explanation: "No cash moved yet. Good books still record the invoice so you know what clients owe — for decisions and stakeholders.", week: 1 },
  { event: "You buy $80 of supplies and pay with your debit card", correctAnswer: "down", explanation: "Everyday spend: cash OUT. Consistent recording (Supplies, not random Office Expenses) keeps data trustworthy.", week: 1 },
  { event: "Owner invests $5,000 into the business bank account", correctAnswer: "up", explanation: "Cash IN from the owner. Banks and partners care that this is recorded correctly — not as revenue.", week: 1 },
  { event: "You hail a $44.10 taxi to a client meeting and pay from the business account", correctAnswer: "down", explanation: "Cash OUT for a service. Sales tax may be on the receipt — still a cash decrease for the full amount paid.", week: 1 },
  { event: "You buy Home Depot materials on the business debit card", correctAnswer: "down", explanation: "Cash OUT for goods. Organized books split materials vs GST so tax filings stay clean.", week: 1 },
  { event: "You charge a client lunch to the business credit card", correctAnswer: "no_change", explanation: "Bank cash did not move yet. Recording it still organizes data and meets receipt obligations for taxes.", week: 1 },

  // Week 2 — spending & selling: immediate funds vs no immediate funds
  { event: "Client pays $1,050 today for consulting (selling — immediate funds)", correctAnswer: "up", explanation: "Selling with immediate funds: cash/bank goes UP. Income increases your assets now.", week: 2 },
  { event: "You invoice a client $2,100 due in 30 days (selling — no immediate funds)", correctAnswer: "no_change", explanation: "Selling with no immediate funds: receivable goes up, but bank cash does not move yet.", week: 2 },
  { event: "You buy a $2,400 laptop from the business bank account (spending — immediate funds)", correctAnswer: "down", explanation: "Spending with immediate funds: cash OUT for a fixed asset (equipment).", week: 2 },
  { event: "You buy furniture on the business credit card (spending — no immediate funds)", correctAnswer: "no_change", explanation: "No bank cash yet — a current liability (credit card) goes up instead.", week: 2 },
  { event: "You draw $3,000 on the line of credit into your bank", correctAnswer: "up", explanation: "Cash/bank (current asset) increases; you also owe a current liability (LOC).", week: 2 },
  { event: "A five-year bank loan of $20,000 is deposited to your account", correctAnswer: "up", explanation: "Immediate funds in — cash up. The offset is a long-term liability (bank loan).", week: 2 },
  { event: "You prepay $600 for yearly software from the bank", correctAnswer: "down", explanation: "Immediate funds out. Prepaid is still a current asset — cash left now.", week: 2 },
  { event: "Supplier ships $400 inventory on 30-day terms", correctAnswer: "no_change", explanation: "No immediate funds: inventory and accounts payable both rise — bank cash unchanged.", week: 2 },
  { event: "You pay last month’s $400 supplier bill from the bank", correctAnswer: "down", explanation: "Paying a current liability uses immediate funds — cash DOWN.", week: 2 },

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
  // Week 3 — two wealth statements fed by the Trial Balance
  { accountName: "Consulting Income", hint: "Revenue from client work (period)", correctStatement: "pl", correctSection: "Revenue", explanation: "Income appears on the Profit & Loss — it shows wealth increasing for the period.", week: 3 },
  { accountName: "Direct Costs", hint: "Costs tied to delivering the work", correctStatement: "pl", correctSection: "Cost of Sales", explanation: "Direct costs sit on the P&L above gross profit — Revenue − Direct costs = Gross profit.", week: 3 },
  { accountName: "Gross Profit", hint: "Revenue minus direct costs", correctStatement: "pl", correctSection: "Gross Profit", explanation: "Gross profit is a P&L subtotal — not a Balance Sheet line. It measures core job profitability.", week: 3 },
  { accountName: "Supplies", hint: "Materials used this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Supplies expense reduces net income on the P&L for the period.", week: 3 },
  { accountName: "Bank Service Charges", hint: "Bank fees this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Bank fees are operating expenses on the P&L — period costs, not assets.", week: 3 },
  { accountName: "Continuing Education", hint: "Courses and training this year", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Education spend for the period belongs on the P&L as an expense.", week: 3 },
  { accountName: "Dues and Subscriptions", hint: "Memberships and software dues", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Dues and subscriptions for the period are P&L expenses.", week: 3 },
  { accountName: "Insurance Expense", hint: "Business coverage premiums", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Insurance expense for the period goes on the P&L.", week: 3 },
  { accountName: "Meals & Entertainment", hint: "Client meals this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Meals reduce period profit — Profit & Loss, not Balance Sheet.", week: 3 },
  { accountName: "Office Expenses", hint: "Workspace costs this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Office expenses are period costs on the P&L.", week: 3 },
  { accountName: "Professional Fees", hint: "Accountant and lawyer costs", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Professional fees for the period sit on the P&L.", week: 3 },
  { accountName: "Telephone Expense", hint: "Phone costs this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Telephone expense is a P&L operating cost.", week: 3 },
  { accountName: "Travel Expense", hint: "Flights, hotels, client travel", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Travel for the period belongs on the Profit & Loss.", week: 3 },
  { accountName: "Royalties", hint: "Royalty payments this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Royalties paid this period reduce net income on the P&L.", week: 3 },
  { accountName: "Donations", hint: "Charitable gifts this period", correctStatement: "pl", correctSection: "Operating Expenses", explanation: "Donations for the period are P&L expenses (tax treatment may differ — educational simplification).", week: 3 },
  { accountName: "Net Income", hint: "Bottom line for the period", correctStatement: "pl", correctSection: "Net Income", explanation: "Net income is the P&L bottom line — the increase (or decrease) of wealth for the period. It then flows into equity.", week: 3 },
  { accountName: "Bank/Cash", hint: "Money you own today", correctStatement: "bs", correctSection: "Assets", explanation: "Cash is a Balance Sheet asset — position today, not period performance.", week: 3 },
  { accountName: "Accounts Receivable", hint: "Clients still owe you", correctStatement: "bs", correctSection: "Assets", explanation: "Receivables are Balance Sheet assets — unpaid invoices still count as wealth you own.", week: 3 },
  { accountName: "Prepaid Expenses", hint: "Paid ahead, benefit left", correctStatement: "bs", correctSection: "Assets", explanation: "Prepayments are current assets on the Balance Sheet.", week: 3 },
  { accountName: "Furniture and Equipment", hint: "Fixed assets you still hold", correctStatement: "bs", correctSection: "Assets", explanation: "Furniture and equipment are Balance Sheet assets (often shown net of amortization).", week: 3 },
  { accountName: "Accum. Amortization", hint: "Wear-and-tear total to date", correctStatement: "bs", correctSection: "Assets", explanation: "Accumulated amortization is a contra-asset on the Balance Sheet — it reduces fixed-asset book value.", week: 3 },
  { accountName: "Credit Card Payable", hint: "Card balance owing today", correctStatement: "bs", correctSection: "Liabilities", explanation: "What you owe on the card today is a Balance Sheet liability.", week: 3 },
  { accountName: "GST/HST Payable", hint: "Taxes owed to CRA now", correctStatement: "bs", correctSection: "Liabilities", explanation: "Tax payable is a Balance Sheet liability — not a P&L expense line.", week: 3 },
  { accountName: "Corporate Taxes Payable", hint: "Income taxes owed", correctStatement: "bs", correctSection: "Liabilities", explanation: "Corporate taxes payable are liabilities on the Balance Sheet.", week: 3 },
  { accountName: "Capital Stock", hint: "Owner investment in shares", correctStatement: "bs", correctSection: "Equity", explanation: "Capital stock is equity on the Balance Sheet — owner wealth invested.", week: 3 },
  { accountName: "Retained Earnings", hint: "Profits kept in the business", correctStatement: "bs", correctSection: "Equity", explanation: "Retained earnings are equity — accumulated wealth kept after profits.", week: 3 },
  { accountName: "Dividends Paid", hint: "Cash returned to owners", correctStatement: "bs", correctSection: "Equity", explanation: "Dividends reduce equity on the Balance Sheet (they are not an operating expense on the P&L).", week: 3 },
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
  { scenario: "Sample Balance Sheet: Total Assets $235,611 and Total Liabilities $17,868.", givenLabel1: "Assets", givenValue1: 235611, givenLabel2: "Liabilities", givenValue2: 17868, missingLabel: "Equity", correctValue: 217743, explanation: "A = L + E → $235,611 = $17,868 + E → E = $217,743. Total Liabilities & Equity must match Total Assets.", week: 3 },
  { scenario: "Balance Sheet: Liabilities $17,868 and Equity $217,743.", givenLabel1: "Liabilities", givenValue1: 17868, givenLabel2: "Equity", givenValue2: 217743, missingLabel: "Assets", correctValue: 235611, explanation: "A = L + E → A = $17,868 + $217,743 = $235,611. That is why Total Assets equals Total Liabilities & Equity.", week: 3 },
  { scenario: "Bright Path June 30: Assets $16,000 and Liabilities $4,200.", givenLabel1: "Assets", givenValue1: 16000, givenLabel2: "Liabilities", givenValue2: 4200, missingLabel: "Equity", correctValue: 11800, explanation: "A = L + E → $16,000 = $4,200 + E → E = $11,800. Equity is the owner's share of wealth on the Balance Sheet.", week: 3 },
  { scenario: "A business has $3,000 in liabilities and $12,000 in equity.", givenLabel1: "Liabilities", givenValue1: 3000, givenLabel2: "Equity", givenValue2: 12000, missingLabel: "Assets", correctValue: 15000, explanation: "A = L + E → A = $3,000 + $12,000 = $15,000. Creditors and owners together claim every asset.", week: 3 },
  { scenario: "Startup: $20,000 assets and $20,000 equity — no debt.", givenLabel1: "Assets", givenValue1: 20000, givenLabel2: "Equity", givenValue2: 20000, missingLabel: "Liabilities", correctValue: 0, explanation: "A = L + E → $20,000 = L + $20,000 → L = $0. Fully owner-funded.", week: 3 },
  { scenario: "After a profitable period: Assets $25,000, Liabilities $8,000.", givenLabel1: "Assets", givenValue1: 25000, givenLabel2: "Liabilities", givenValue2: 8000, missingLabel: "Equity", correctValue: 17000, explanation: "Profits increase equity. A = L + E → E = $17,000.", week: 3 },
  { scenario: "Bank & cash $168,267 plus other assets bring Total Assets to $235,611. Equity is $217,743.", givenLabel1: "Assets", givenValue1: 235611, givenLabel2: "Equity", givenValue2: 217743, missingLabel: "Liabilities", correctValue: 17868, explanation: "A = L + E → $235,611 = L + $217,743 → L = $17,868 — the Balance Sheet liability total.", week: 3 },
  { scenario: "End of June practice month: liabilities $4,200, equity $11,800.", givenLabel1: "Liabilities", givenValue1: 4200, givenLabel2: "Equity", givenValue2: 11800, missingLabel: "Assets", correctValue: 16000, explanation: "A = L + E → A = $16,000. Your Trial Balance must support this Balance Sheet equation.", week: 3 },
];

// ---------------------------------------------------------------------------
// Game 7: Report Reader (Week 3) — Interpret financial statements → decisions
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
    scenario: "The report flow",
    statementData: "Transactions → Trial Balance → Profit & Loss + Balance Sheet → Insights → Decisions",
    question: "What do financial statements compile?",
    options: [
      "All transactions into two statements that show wealth up or down",
      "Only the bank balance",
      "Tax forms for CRA only",
    ],
    correctIndex: 0,
    explanation: "Financial statements are a compilation of all transactions into two statements (P&L and Balance Sheet) that picture the increase/decrease of your wealth.", week: 3,
  },
  {
    scenario: "Sample P&L shape",
    statementData: "Revenue: $31,198 | Direct Costs: $7,000 | Gross Profit: $24,198 | Expenses: $6,434 | Net Income: $17,764",
    question: "How is gross profit calculated here?",
    options: ["Revenue − Direct costs", "Revenue − Expenses", "Assets − Liabilities"],
    correctIndex: 0,
    explanation: "$31,198 − $7,000 = $24,198 gross profit. Expenses come after that to reach net income.", week: 3,
  },
  {
    scenario: "Sample P&L — wealth for the period",
    statementData: "Gross Profit: $24,198 | Expenses: $6,434 | Net Income: $17,764",
    question: "Did wealth increase for this period?",
    options: ["Yes — net income is positive", "No — expenses wiped everything out", "Can't tell without the Balance Sheet"],
    correctIndex: 0,
    explanation: "Positive net income means the P&L shows wealth increased for the period (before looking at cash timing on the Balance Sheet).", week: 3,
  },
  {
    scenario: "Which report?",
    statementData: "You need net income and the biggest expense lines (travel, office, royalties…).",
    question: "Which statement do you open?",
    options: ["Profit & Loss", "Balance Sheet", "Only the Trial Balance"],
    correctIndex: 0,
    explanation: "Period performance — income, expenses, net income — lives on the Profit & Loss.", week: 3,
  },
  {
    scenario: "Which report?",
    statementData: "You need Total Assets, liabilities (cards, taxes), and equity today.",
    question: "Which statement do you open?",
    options: ["Balance Sheet", "Profit & Loss", "Only expense receipts"],
    correctIndex: 0,
    explanation: "Position today — assets, liabilities, equity — lives on the Balance Sheet. The Trial Balance feeds it.", week: 3,
  },
  {
    scenario: "Balance Sheet equation",
    statementData: "Total Assets: $235,611 | Total Liabilities: $17,868 | Total Equity: $217,743",
    question: "Does the Balance Sheet balance?",
    options: ["Yes — Assets = Liabilities + Equity", "No — equity is too high", "Need the P&L to check"],
    correctIndex: 0,
    explanation: "$17,868 + $217,743 = $235,611. Total Liabilities & Equity matches Total Assets.", week: 3,
  },
  {
    scenario: "Insight → Decision",
    statementData: "P&L Net Income: $17,764 | Balance Sheet Cash: low | Accounts Receivable: high",
    question: "Best next decision?",
    options: [
      "Collect outstanding invoices before a big cash purchase",
      "Ignore A/R — profit already proves cash is fine",
      "Delete the Trial Balance and start over",
    ],
    correctIndex: 0,
    explanation: "Insight: profitable but cash thin because clients haven't paid. Decision: collect before spending.", week: 3,
  },
  {
    scenario: "Insight → Decision",
    statementData: "P&L shows Travel + Office as the largest expenses; Net Income still positive.",
    question: "What insight supports a smart decision?",
    options: [
      "Review travel and office spend if you want more profit next period",
      "Move those expenses onto the Balance Sheet as assets",
      "Stop recording June transactions",
    ],
    correctIndex: 0,
    explanation: "Insights from the P&L highlight big cost drivers. Decisions might mean negotiating, cutting, or budgeting — not hiding costs on the Balance Sheet.", week: 3,
  },
  {
    scenario: "Bright Path — June practice",
    statementData: "Revenue: $8,400 | Expenses: $2,642 | Net Income: $5,758 | Cash: $2,300 | A/R: $4,200",
    question: "Why can June look profitable while cash feels tight?",
    options: ["$4,200 of invoices not collected yet", "The P&L is always wrong", "Equity must be negative"],
    correctIndex: 0,
    explanation: "Profit ≠ cash. Uncollected receivables explain the gap — classic Insights → Decisions pairing of P&L + Balance Sheet.", week: 3,
  },
  {
    scenario: "Trial Balance bridge",
    statementData: "Debits = Credits on the Trial Balance for June 30.",
    question: "What comes next in the flow?",
    options: [
      "Build Profit & Loss and Balance Sheet, then Insights → Decisions",
      "Skip reports and guess next month's sales",
      "Only file taxes with no statements",
    ],
    correctIndex: 0,
    explanation: "Transactions → Trial Balance → P&L + Balance Sheet → Insights → Decisions. A balanced TB is the green light.", week: 3,
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
  // Journal #1 — Depreciation (Week 4 curriculum worksheets)
  {
    scenario: "Vehicle cost $30,000. Depreciation rate 30%.",
    question: "What is this period's amortization, and what is net book value?",
    options: ["Amortization $9,000 · NBV $21,000", "Amortization $21,000 · NBV $9,000", "Amortization $30,000 · NBV $0", "Amortization $3,000 · NBV $27,000"],
    correctIndex: 0,
    explanation: "$30,000 × 30% = $9,000 amortization. NBV = $30,000 − $9,000 = $21,000.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Furniture $15,000 at 20%. Computers $5,000 at 50%.",
    question: "What is total amortization for furniture + computers?",
    options: ["$5,500", "$3,000", "$2,500", "$20,000"],
    correctIndex: 0,
    explanation: "Furniture $15,000 × 20% = $3,000. Computers $5,000 × 50% = $2,500. Total $5,500.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Journal #1 — year-end depreciation for vehicle, furniture, and computers.",
    question: "Vehicle $9,000 + Furniture $3,000 + Computers $2,500. What is the debit to Depreciation expenses?",
    options: ["$14,500", "$9,000", "$14,000", "$5,500"],
    correctIndex: 0,
    explanation: "Journal #1 debits Depreciation expenses for the total amortization: $9,000 + $3,000 + $2,500 = $14,500.",
    category: "depreciation", week: 4,
  },
  {
    scenario: "Journal #1 credits Cum. Amortization by asset.",
    question: "Which accounts are credited for the $14,500 total?",
    options: [
      "Cum. Amort. — Vehicle $9,000; Furniture $3,000; Computers $2,500",
      "Only Bank/Cash $14,500",
      "Shareholders' loan $14,500",
      "Consulting Income $14,500",
    ],
    correctIndex: 0,
    explanation: "Depreciation expense is debited once; each asset's accumulated amortization is credited for its own amount.",
    category: "depreciation", week: 4,
  },

  // Journal #2 — Home office
  {
    scenario: "Office area 150. Total home area 1,500.",
    question: "What is the business-use percentage?",
    options: ["10%", "15%", "150%", "1%"],
    correctIndex: 0,
    explanation: "150 ÷ 1,500 = 10% business use.",
    category: "home_office", week: 4,
  },
  {
    scenario: "Eligible home costs total $35,850 (heat, electricity, insurance, maintenance, mortgage interest, property taxes, internet, others). Business use is 10%.",
    question: "What is the home office claim?",
    options: ["$3,585", "$35,850", "$358.50", "$3,000"],
    correctIndex: 0,
    explanation: "$35,850 × 10% = $3,585 — Journal #2 amount.",
    category: "home_office", week: 4,
  },
  {
    scenario: "Journal #2 — home office use.",
    question: "How do you record the $3,585 claim when you paid home bills personally?",
    options: [
      "Debit Home office use/rent $3,585 · Credit Shareholders' loan $3,585",
      "Debit Bank $3,585 · Credit Home office $3,585",
      "Debit Shareholders' loan · Credit Home office",
      "Expense it to Travel Expense",
    ],
    correctIndex: 0,
    explanation: "Journal #2: Dr Home office use/rent; Cr Shareholders' loan — the business owes you for the business share of home costs.",
    category: "home_office", week: 4,
  },

  // Journal #3 — Mileage
  {
    scenario: "Total distance 35,000 km. Business distance 25,000 km. First 5,000 km @ $0.68; remaining @ $0.61.",
    question: "What is the total mileage expense?",
    options: ["$15,600", "$17,000", "$12,200", "$3,400"],
    correctIndex: 0,
    explanation: "(5,000 × $0.68) = $3,400. (20,000 × $0.61) = $12,200. Total $15,600.",
    category: "mileage", week: 4,
  },
  {
    scenario: "Journal #3 — mileage claim $15,600.",
    question: "Which journal entry is correct?",
    options: [
      "Debit Vehicle expenses (Mileage) · Credit Shareholders' loan",
      "Debit Shareholders' loan · Credit Vehicle expenses",
      "Debit Bank · Credit Mileage",
      "Debit Depreciation · Credit Vehicle",
    ],
    correctIndex: 0,
    explanation: "Journal #3: Dr Vehicle expenses (Mileage) $15,600; Cr Shareholders' loan $15,600.",
    category: "mileage", week: 4,
  },
  {
    scenario: "Mileage worksheet shows first-tier and remaining-tier amounts.",
    question: "How much is the first 5,000 km portion at $0.68?",
    options: ["$3,400", "$12,200", "$15,600", "$5,000"],
    correctIndex: 0,
    explanation: "5,000 × $0.68 = $3,400. The remaining 20,000 km at $0.61 add $12,200.",
    category: "mileage", week: 4,
  },

  // Handover to accountants
  {
    scenario: "Week 4 closing order.",
    question: "What comes before handover to accountants for tax preparation?",
    options: [
      "Post year-end common journals (depreciation, home office, mileage)",
      "Skip the trial balance forever",
      "Delete the Balance Sheet",
      "Only send personal bank statements",
    ],
    correctIndex: 0,
    explanation: "Other entries before closing the period, then handover. Journals #1–#3 first.",
    category: "handoff", week: 4,
  },
  {
    scenario: "Preparing the tax-prep package.",
    question: "Which item is NOT part of the business handoff?",
    options: ["Your personal bank statements", "Adjusted trial balance", "Profit & Loss", "Mileage log supporting Journal #3"],
    correctIndex: 0,
    explanation: "Accountants need business TB, P&L, BS, GL, bank recs, and supporting schedules — not personal bank statements.",
    category: "handoff", week: 4,
  },
  {
    scenario: "After Journals #1–#3.",
    question: "What must be true about the trial balance before handoff?",
    options: ["Total debits equal total credits", "Only assets have balances", "Revenue must be zero", "Equity must be deleted"],
    correctIndex: 0,
    explanation: "A balanced adjusted trial balance is the green light before tax preparation handover.",
    category: "handoff", week: 4,
  },
  {
    scenario: "Flow reminder at year-end.",
    question: "Where do year-end journals sit in the curriculum flow?",
    options: [
      "After daily transactions — before final Insights → Decisions and tax handoff",
      "Instead of the Trial Balance",
      "Only after the accountant files",
      "They replace the Profit & Loss",
    ],
    correctIndex: 0,
    explanation: "Transactions (and year-end journals) still compile into the Trial Balance, then P&L + BS → Insights → Decisions, then accountant handoff.",
    category: "handoff", week: 4,
  },
];
