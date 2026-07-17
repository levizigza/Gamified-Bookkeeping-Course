/** Sort buckets shown in the Account Sorter challenge. */
export type SortCategory =
  | "current_asset"
  | "fixed_asset"
  | "current_liability"
  | "long_term_liability"
  | "revenue"
  | "expense"
  | "equity";

export const SORT_CATEGORY_LABELS: Record<SortCategory, string> = {
  current_asset: "Current Asset",
  fixed_asset: "Fixed Asset",
  current_liability: "Current Liability",
  long_term_liability: "Long-Term Liability",
  revenue: "Income / Revenue",
  expense: "Expense",
  equity: "Equity",
};

export const ACCOUNT_SORTER_CHALLENGE_ID = "challenge-sort-accounts";

/** Mastery % learning target for Account Sorter (board unlock uses key stars). */
export const REPORTS_ROOM_MASTERY_THRESHOLD = 80;

export type SortableAccount = {
  id: string;
  name: string;
  correctCategory: SortCategory;
  /** Shown when the user picks correctly. */
  correctFeedback: string;
  /** Shown when the user picks incorrectly — explains the right bucket. */
  incorrectFeedback: string;
  baseXp: number;
};

export type AccountSorterChallenge = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  items: SortableAccount[];
  /** Bonus XP every streak milestone (see scoring). */
  streakBonusXp: number;
  streakStartsAt: number;
};

export const accountSorterChallenge: AccountSorterChallenge = {
  id: ACCOUNT_SORTER_CHALLENGE_ID,
  title: "Account Sorter",
  description:
    "Sort each account into fixed vs current assets, long-term vs current liabilities, income, expense, or equity. " +
    "Aim for 80% or higher to reach the Week 2 learning target.",
  lessonId: "lesson-account-types",
  streakBonusXp: 5,
  streakStartsAt: 3,
  items: [
    {
      id: "sort-bank-cash",
      name: "Bank/Cash",
      correctCategory: "current_asset",
      correctFeedback:
        "Cash in your bank is a current asset — you can use it within the next year to pay bills or buy supplies.",
      incorrectFeedback:
        "Bank/Cash is money available right now. That makes it a current asset, not an expense or liability.",
      baseXp: 10,
    },
    {
      id: "sort-ar",
      name: "Accounts Receivable",
      correctCategory: "current_asset",
      correctFeedback:
        "Money clients owe you is a current asset — you expect to collect it within a year.",
      incorrectFeedback:
        "Accounts Receivable is cash you have not received yet but is owed to you soon. It is a current asset.",
      baseXp: 10,
    },
    {
      id: "sort-prepaid",
      name: "Prepaid Expenses",
      correctCategory: "current_asset",
      correctFeedback:
        "Prepaid insurance or subscriptions are current assets — you paid early for a benefit you have not used up yet.",
      incorrectFeedback:
        "Prepaid items are assets because your business still has value coming. They are current assets.",
      baseXp: 10,
    },
    {
      id: "sort-inventory",
      name: "Inventory",
      correctCategory: "current_asset",
      correctFeedback:
        "Inventory you plan to sell or use soon is a current asset sitting on your shelf or in storage.",
      incorrectFeedback:
        "Inventory is something your business owns and will use or sell within a year — a current asset.",
      baseXp: 10,
    },
    {
      id: "sort-vehicle",
      name: "Vehicle",
      correctCategory: "fixed_asset",
      correctFeedback:
        "A company vehicle lasts years and helps you earn income — that is a fixed asset on your balance sheet.",
      incorrectFeedback:
        "Vehicles are valuable long-term items used in the business. They are fixed assets, not everyday expenses.",
      baseXp: 10,
    },
    {
      id: "sort-equipment",
      name: "Equipment",
      correctCategory: "fixed_asset",
      correctFeedback:
        "Laptops, printers, and tools you keep for years are fixed assets — they help generate income over time.",
      incorrectFeedback:
        "Equipment is held for more than a year. Capitalize it as a fixed asset, not an immediate expense.",
      baseXp: 10,
    },
    {
      id: "sort-furniture",
      name: "Furniture and Fixtures",
      correctCategory: "fixed_asset",
      correctFeedback:
        "Desks, chairs, and shelving last multiple years — fixed assets that support your workspace and help you earn.",
      incorrectFeedback:
        "Furniture is a long-lasting business item. Record it as a fixed asset, not a current expense.",
      baseXp: 10,
    },
    {
      id: "sort-building",
      name: "Building",
      correctCategory: "fixed_asset",
      correctFeedback:
        "A building you own for the business is a fixed asset — valuable property held to help generate income over years.",
      incorrectFeedback:
        "Buildings are long-term property. They are fixed assets, not current assets or expenses.",
      baseXp: 10,
    },
    {
      id: "sort-investments",
      name: "Investments (long-term)",
      correctCategory: "fixed_asset",
      correctFeedback:
        "Long-term investments you hold to contribute to future income are treated like fixed assets — you are holding them for lasting value.",
      incorrectFeedback:
        "Investments held for more than a year to help generate wealth sit with fixed assets, not with cash or inventory.",
      baseXp: 10,
    },
    {
      id: "sort-ap",
      name: "Accounts Payable",
      correctCategory: "current_liability",
      correctFeedback:
        "Bills you owe suppliers within the year are current liabilities — short-term debts (money owed to a third party soon).",
      incorrectFeedback:
        "Accounts Payable is money you owe soon. That is a current liability, not an expense (the expense was recorded when you received the goods).",
      baseXp: 10,
    },
    {
      id: "sort-loc",
      name: "Line of Credit",
      correctCategory: "current_liability",
      correctFeedback:
        "A business line of credit is a current liability — amounts drawn are typically due or revolving within a year.",
      incorrectFeedback:
        "Line of credit balances are what you owe the bank soon. Classify them as current liabilities, not long-term loans unless your agreement says otherwise.",
      baseXp: 10,
    },
    {
      id: "sort-cc",
      name: "Credit Card Payable",
      correctCategory: "current_liability",
      correctFeedback:
        "Your outstanding credit card balance is a current liability — due within the next year.",
      incorrectFeedback:
        "What you owe on the company card is a liability, not an expense. The expenses were recorded when you swiped the card.",
      baseXp: 10,
    },
    {
      id: "sort-gst",
      name: "GST/HST Payable",
      correctCategory: "current_liability",
      correctFeedback:
        "Taxes you collected and owe CRA are a current liability until you remit them.",
      incorrectFeedback:
        "Tax collected from customers is not your money — it is a current liability (taxes) until paid to the government.",
      baseXp: 10,
    },
    {
      id: "sort-shareholder-loan",
      name: "Shareholder Loan",
      correctCategory: "current_liability",
      correctFeedback:
        "Shareholder’s loan — amounts the company owes the owner — is typically a current liability for small corporations.",
      incorrectFeedback:
        "Money the business owes back to the owner is a liability. For Bright Path Consulting we classify Shareholder Loan as current.",
      baseXp: 10,
    },
    {
      id: "sort-bank-loan",
      name: "Bank Loan (5-year term)",
      correctCategory: "long_term_liability",
      correctFeedback:
        "A bank loan repaid over five years is a long-term liability — debt carried for one year or more.",
      incorrectFeedback:
        "Loans due beyond one year are long-term liabilities. A 5-year bank loan does not belong with credit cards or a line of credit.",
      baseXp: 10,
    },
    {
      id: "sort-mortgage",
      name: "Mortgage Payable",
      correctCategory: "long_term_liability",
      correctFeedback:
        "A mortgage on business property is a long-term liability — paid over many years and it will reduce assets as you pay it down.",
      incorrectFeedback:
        "Mortgages are multi-year debts. They are long-term liabilities, not current ones.",
      baseXp: 10,
    },
    {
      id: "sort-consulting-income",
      name: "Consulting Income",
      correctCategory: "revenue",
      correctFeedback:
        "Income/revenue is a gain in exchange for services you sold — it increases your assets (cash or receivable).",
      incorrectFeedback:
        "Consulting Income is revenue from services. It is not the bank account itself — income increases assets when earned.",
      baseXp: 10,
    },
    {
      id: "sort-meals",
      name: "Meals and Entertainment",
      correctCategory: "expense",
      correctFeedback:
        "Expense is money spent to acquire a good or service — client meals reduce your assets (or increase a credit-card liability).",
      incorrectFeedback:
        "Meals are costs of running the business. They are expenses, not assets or liabilities.",
      baseXp: 10,
    },
    {
      id: "sort-supplies",
      name: "Supplies",
      correctCategory: "expense",
      correctFeedback:
        "Supplies you consume are expenses — spending that reduces assets when you buy them for use (not as inventory for resale).",
      incorrectFeedback:
        "Supplies are operating expenses. Small consumables are expensed, not capitalized as equipment.",
      baseXp: 10,
    },
    {
      id: "sort-capital-stock",
      name: "Capital Stock",
      correctCategory: "equity",
      correctFeedback:
        "Equity shows how owner wealth is growing or reducing. Capital Stock is owner investment through shares.",
      incorrectFeedback:
        "Capital Stock is owner equity, not a loan or revenue. It represents ownership in the business.",
      baseXp: 10,
    },
    {
      id: "sort-retained-earnings",
      name: "Retained Earnings",
      correctCategory: "equity",
      correctFeedback:
        "Equity aggregate: profits kept in the business accumulate here — wealth growing or reducing over time.",
      incorrectFeedback:
        "Retained Earnings is accumulated profit belonging to owners. It is equity, not income or an asset.",
      baseXp: 10,
    },
  ],
};

export function getAccountSorterChallenge(): AccountSorterChallenge {
  return accountSorterChallenge;
}

export const SORT_CATEGORIES: SortCategory[] = [
  "current_asset",
  "fixed_asset",
  "current_liability",
  "long_term_liability",
  "revenue",
  "expense",
  "equity",
];
