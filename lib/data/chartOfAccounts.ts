import type { Account, AccountSubType, AccountType } from "@/lib/types/accounting";

/**
 * Which side increases an account's balance.
 * Assets and expenses normally increase with debits; liabilities, equity, and income with credits.
 */
export type NormalBalance = "debit" | "credit";

/**
 * A chart-of-accounts entry with beginner-friendly teaching metadata.
 */
export type ChartAccount = {
  id: string;
  /** Standard account number for sorting and reference. */
  code: string;
  name: string;
  accountType: AccountType;
  accountSubType: AccountSubType;
  normalBalance: NormalBalance;
  /** Plain-language explanation for learners. */
  beginnerDescription: string;
  /** Real-world examples of when to use this account. */
  exampleUses: string[];
  active: boolean;
};

/** Convert a chart entry to the core Account type used by journal logic. */
export function toAccount(entry: ChartAccount): Account {
  return {
    id: entry.id,
    code: entry.code,
    name: entry.name,
    type: entry.accountType,
    subType: entry.accountSubType,
    active: entry.active,
    description: entry.beginnerDescription,
  };
}

export const chartOfAccounts: ChartAccount[] = [
  // -------------------------------------------------------------------------
  // Assets — Current
  // -------------------------------------------------------------------------
  {
    id: "bank-cash",
    code: "1000",
    name: "Bank/Cash",
    accountType: "asset",
    accountSubType: "current_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Money your business has in the bank or on hand. When cash comes in, this account goes up (debit). When you pay bills, it goes down (credit).",
    exampleUses: [
      "Client payment deposited to your business chequing account",
      "E-transfer received for a consulting invoice",
      "Petty cash used for small office purchases",
    ],
    active: true,
  },
  {
    id: "accounts-receivable",
    code: "1100",
    name: "Accounts Receivable",
    accountType: "asset",
    accountSubType: "current_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Money clients owe you for work you have already done but have not been paid for yet. Think of it as IOUs from customers.",
    exampleUses: [
      "Invoice sent to a client on June 15 with 30-day payment terms",
      "Outstanding consulting fees at month-end",
      "Recording revenue when work is done, before cash arrives",
    ],
    active: true,
  },
  {
    id: "prepaid-expenses",
    code: "1200",
    name: "Prepaid Expenses",
    accountType: "asset",
    accountSubType: "current_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Expenses you paid in advance for a future benefit. You have not used up the full value yet, so it is still an asset.",
    exampleUses: [
      "Annual software subscription paid upfront in June",
      "Insurance premium covering July through June",
      "Conference registration paid before the event date",
    ],
    active: true,
  },
  {
    id: "inventory",
    code: "1300",
    name: "Inventory",
    accountType: "asset",
    accountSubType: "current_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Products or materials you hold to sell or use in your work. Most service businesses keep little or no inventory, but the account exists if you resell goods.",
    exampleUses: [
      "Training workbooks purchased to resell to clients",
      "Branded merchandise kept for client gifts",
      "Office toner cartridges tracked as stock on hand",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Assets — Fixed
  // -------------------------------------------------------------------------
  {
    id: "vehicle",
    code: "1500",
    name: "Vehicle",
    accountType: "asset",
    accountSubType: "fixed_asset",
    normalBalance: "debit",
    beginnerDescription:
      "A vehicle owned by the business for work travel. The full purchase price goes here; wear-and-tear is tracked separately in Accumulated Amortization.",
    exampleUses: [
      "Buying a company car used to visit Calgary clients",
      "Down payment on a business-use SUV",
      "Transferring a personally owned vehicle into the corporation",
    ],
    active: true,
  },
  {
    id: "equipment",
    code: "1510",
    name: "Equipment",
    accountType: "asset",
    accountSubType: "fixed_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Long-lasting tools and technology the business owns — items you use for more than one year, like computers and printers.",
    exampleUses: [
      "Laptop purchased for consulting work in June 2024",
      "External monitor and docking station",
      "Projector for client workshops",
    ],
    active: true,
  },
  {
    id: "furniture-and-fixtures",
    code: "1520",
    name: "Furniture and Fixtures",
    accountType: "asset",
    accountSubType: "fixed_asset",
    normalBalance: "debit",
    beginnerDescription:
      "Desks, chairs, shelving, and other office furnishings that last multiple years and are used in your workspace.",
    exampleUses: [
      "Standing desk for your home office",
      "Filing cabinet and bookshelves",
      "Meeting-room chairs for a small office lease",
    ],
    active: true,
  },
  {
    id: "accumulated-amortization-vehicle",
    code: "1590",
    name: "Accumulated Amortization - Vehicle",
    accountType: "asset",
    accountSubType: "fixed_asset",
    normalBalance: "credit",
    beginnerDescription:
      "The total wear-and-tear written off your vehicle over time. This is a contra-asset: it reduces the vehicle's book value on your balance sheet.",
    exampleUses: [
      "Monthly amortization entry for a company vehicle",
      "Year-end adjustment spreading the vehicle cost over its useful life",
      "Showing net vehicle value = Vehicle minus Accumulated Amortization",
    ],
    active: true,
  },
  {
    id: "accumulated-amortization-equipment",
    code: "1595",
    name: "Accumulated Amortization - Equipment",
    accountType: "asset",
    accountSubType: "fixed_asset",
    normalBalance: "credit",
    beginnerDescription:
      "The total amortization recorded against equipment since purchase. It lowers the equipment's carrying value on the balance sheet.",
    exampleUses: [
      "Amortizing a laptop over 36 months",
      "Year-end entry for computers and office equipment",
      "Tracking how much of your equipment's cost has been expensed",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Liabilities — Current
  // -------------------------------------------------------------------------
  {
    id: "accounts-payable",
    code: "2000",
    name: "Accounts Payable",
    accountType: "liability",
    accountSubType: "current_liability",
    normalBalance: "credit",
    beginnerDescription:
      "Bills you owe suppliers for goods or services already received but not yet paid. It is money you need to pay soon.",
    exampleUses: [
      "Invoice from your web designer due in 30 days",
      "Office supply order received but not paid until July",
      "Subcontractor bill for project help in June",
    ],
    active: true,
  },
  {
    id: "credit-card-payable",
    code: "2100",
    name: "Credit Card Payable",
    accountType: "liability",
    accountSubType: "current_liability",
    normalBalance: "credit",
    beginnerDescription:
      "The balance owed on your business credit card. Each purchase increases what you owe; payments reduce it.",
    exampleUses: [
      "Business purchases on a corporate Visa",
      "Monthly credit card statement balance",
      "Paying down the card from your bank account",
    ],
    active: true,
  },
  {
    id: "gst-hst-payable",
    code: "2200",
    name: "GST/HST Payable",
    accountType: "liability",
    accountSubType: "current_liability",
    normalBalance: "credit",
    beginnerDescription:
      "Sales tax you collected from customers and must remit to the Canada Revenue Agency (CRA). In Alberta, GST is 5% on most taxable sales.",
    exampleUses: [
      "GST charged on a consulting invoice to an Alberta client",
      "Net GST owed after claiming input tax credits on purchases",
      "Filing your quarterly GST return",
    ],
    active: true,
  },
  {
    id: "corporate-taxes-payable",
    code: "2300",
    name: "Corporate Taxes Payable",
    accountType: "liability",
    accountSubType: "current_liability",
    normalBalance: "credit",
    beginnerDescription:
      "Income tax your corporation owes based on taxable profit. You accrue it during the year and pay it when you file your corporate return.",
    exampleUses: [
      "Estimated corporate tax owing at year-end",
      "Instalment payments due to CRA",
      "Tax provision recorded before your accountant finalizes the return",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Liabilities — Long-term
  // -------------------------------------------------------------------------
  {
    id: "shareholder-loan",
    code: "2500",
    name: "Shareholder Loan",
    accountType: "liability",
    accountSubType: "long_term_liability",
    normalBalance: "credit",
    beginnerDescription:
      "Money the business owes to its owner (or that the owner owes the business). Common in small corporations when personal and business funds mix.",
    exampleUses: [
      "Owner pays a business expense personally and the company owes them back",
      "Owner withdraws cash from the company for personal use",
      "Tracking funds loaned between you and your corporation",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Equity
  // -------------------------------------------------------------------------
  {
    id: "capital-stock",
    code: "3000",
    name: "Capital Stock",
    accountType: "equity",
    accountSubType: "equity",
    normalBalance: "credit",
    beginnerDescription:
      "The owner's initial investment in the corporation — shares issued when the company was set up or when new capital is contributed.",
    exampleUses: [
      "Incorporating and depositing startup funds",
      "Owner investing additional cash into the business",
      "Issuing new shares to raise capital",
    ],
    active: true,
  },
  {
    id: "retained-earnings",
    code: "3100",
    name: "Retained Earnings",
    accountType: "equity",
    accountSubType: "equity",
    normalBalance: "credit",
    beginnerDescription:
      "Profits the business kept instead of paying out as dividends. It grows when you earn money and shrinks when you take dividends or have losses.",
    exampleUses: [
      "Closing net income into equity at year-end",
      "Accumulated profits from prior years",
      "Offsetting prior-year losses carried forward",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Income / Revenue
  // -------------------------------------------------------------------------
  {
    id: "consulting-income",
    code: "4000",
    name: "Consulting Income",
    accountType: "income",
    accountSubType: "revenue",
    normalBalance: "credit",
    beginnerDescription:
      "Money earned from professional advice, project work, and hourly consulting. This is your main revenue as a service business.",
    exampleUses: [
      "Monthly retainer from a Calgary energy-sector client",
      "Fixed-fee strategy project completed in June",
      "Hourly billing for workshop facilitation",
    ],
    active: true,
  },
  {
    id: "sales-revenue",
    code: "4100",
    name: "Sales Revenue",
    accountType: "income",
    accountSubType: "revenue",
    normalBalance: "credit",
    beginnerDescription:
      "Income from selling physical products or materials, separate from your consulting services. Use this when you resell goods.",
    exampleUses: [
      "Selling training manuals to workshop attendees",
      "Reselling software licences marked up to clients",
      "Merchandise sales at a conference booth",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Direct costs
  // -------------------------------------------------------------------------
  {
    id: "direct-costs",
    code: "5000",
    name: "Direct Costs",
    accountType: "expense",
    accountSubType: "direct_cost",
    normalBalance: "debit",
    beginnerDescription:
      "Costs tied directly to delivering a specific project or sale. If you did not have the project, you would not have this expense.",
    exampleUses: [
      "Subcontractor hired only for one client engagement",
      "Materials purchased solely for a client deliverable",
      "Third-party data licence billed through to the client",
    ],
    active: true,
  },

  // -------------------------------------------------------------------------
  // Operating expenses
  // -------------------------------------------------------------------------
  {
    id: "supplies",
    code: "6100",
    name: "Supplies",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Small items consumed in day-to-day operations — stationery, printer paper, and other low-cost materials.",
    exampleUses: [
      "Staples run for pens, notebooks, and folders",
      "Printer ink and paper",
      "Whiteboard markers for client sessions",
    ],
    active: true,
  },
  {
    id: "meals-and-entertainment",
    code: "6200",
    name: "Meals and Entertainment",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Business meals and client entertainment. Keep receipts and note who attended and the business purpose — tax rules may limit deductibility.",
    exampleUses: [
      "Lunch meeting with a prospective client in downtown Calgary",
      "Coffee while discussing a project scope",
      "Team dinner after a successful workshop (if applicable)",
    ],
    active: true,
  },
  {
    id: "office-expenses",
    code: "6300",
    name: "Office Expenses",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "General costs of running your workspace that do not fit a more specific category — cleaning, minor repairs, and shared office fees.",
    exampleUses: [
      "Co-working day pass in Calgary",
      "Janitorial supplies for a leased office",
      "Postage and courier charges",
    ],
    active: true,
  },
  {
    id: "telephone-expense",
    code: "6400",
    name: "Telephone Expense",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Business portion of phone, mobile, and internet plans used for client calls, email, and remote work.",
    exampleUses: [
      "Monthly business cell phone plan",
      "Internet service for your home office (business-use portion)",
      "VoIP subscription for client conferencing",
    ],
    active: true,
  },
  {
    id: "travel-expense",
    code: "6500",
    name: "Travel Expense",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Costs of travelling for business — flights, hotels, parking, and transit when you are away from your usual workplace.",
    exampleUses: [
      "Flight to Edmonton for a client site visit",
      "Hotel during a multi-day conference",
      "Airport parking and rideshare to client meetings",
    ],
    active: true,
  },
  {
    id: "insurance-expense",
    code: "6600",
    name: "Insurance Expense",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Business insurance premiums such as general liability and professional (errors & omissions) coverage.",
    exampleUses: [
      "Annual E&O policy for consulting work",
      "Commercial general liability insurance",
      "Monthly premium for business liability coverage",
    ],
    active: true,
  },
  {
    id: "professional-fees",
    code: "6700",
    name: "Professional Fees",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Fees paid to other professionals who support your business — lawyers, accountants, bookkeepers, and specialized consultants.",
    exampleUses: [
      "Accountant preparing your corporate tax return",
      "Lawyer reviewing a client contract template",
      "Bookkeeping support for month-end cleanup",
    ],
    active: true,
  },
  {
    id: "bank-service-charges",
    code: "6800",
    name: "Bank Service Charges",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Fees your bank charges for account maintenance, transfers, wire payments, and other banking services.",
    exampleUses: [
      "Monthly business chequing account fee",
      "Wire transfer fee for paying a vendor",
      "Overdraft or NSF charges (avoid these when possible!)",
    ],
    active: true,
  },
  {
    id: "continuing-education",
    code: "6900",
    name: "Continuing Education",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Courses, certifications, and training that keep your professional skills current and benefit your consulting practice.",
    exampleUses: [
      "Online course on project management",
      "Industry conference registration",
      "Professional designation annual dues tied to education",
    ],
    active: true,
  },
  {
    id: "depreciation-expense",
    code: "7000",
    name: "Depreciation Expense",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "The portion of your equipment and vehicle cost expensed this period. Paired with Accumulated Amortization on the balance sheet.",
    exampleUses: [
      "Monthly amortization on your business laptop",
      "Year-end amortization entry for vehicles and equipment",
      "Spreading a $3,000 computer over 36 months",
    ],
    active: true,
  },
  {
    id: "home-office-rent",
    code: "7100",
    name: "Home Office Use/Rent",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "The business-use portion of home costs — rent, mortgage interest, utilities, and maintenance for space used regularly for work.",
    exampleUses: [
      "15% of rent for a dedicated home office room",
      "Business share of home electricity and heating",
      "Year-end home office adjustment before tax filing",
    ],
    active: true,
  },
  {
    id: "vehicle-expense-mileage",
    code: "7200",
    name: "Vehicle Expense - Mileage",
    accountType: "expense",
    accountSubType: "operating_expense",
    normalBalance: "debit",
    beginnerDescription:
      "Vehicle costs claimed using a per-kilometre rate for business trips. Alternative to tracking gas, insurance, and repairs separately.",
    exampleUses: [
      "Kilometres driven to client sites in Calgary and area",
      "Business trips between Edmonton and Calgary",
      "Logged mileage for CRA reasonable per-km allowance",
    ],
    active: true,
  },
];

/** Look up a chart account by its id. */
export function getChartAccountById(id: string): ChartAccount | undefined {
  return chartOfAccounts.find((account) => account.id === id);
}

/** Look up a chart account by its account code. */
export function getChartAccountByCode(code: string): ChartAccount | undefined {
  return chartOfAccounts.find((account) => account.code === code);
}

/** Return all accounts of a given type (asset, liability, etc.). */
export function getChartAccountsByType(accountType: AccountType): ChartAccount[] {
  return chartOfAccounts.filter((account) => account.accountType === accountType);
}

/** Return all active accounts as core Account objects for journal logic. */
export function getActiveAccounts(): Account[] {
  return chartOfAccounts.filter((a) => a.active).map(toAccount);
}
