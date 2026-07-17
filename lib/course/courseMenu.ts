export type CourseTopic = {
  id: string;
  number: string;
  title: string;
  subtopics?: string[];
  lessonId?: string;
};

export type CourseWeek = {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  worldName: string;
  icon: string;
  locked: boolean;
  summary: string;
  topics: CourseTopic[];
};

export const COURSE_BRAND = {
  company: "Ledger Quest",
  product: "Bookkeeping for Business Owners",
  tagline: "A game-style course for owners who want clean books — and confident decisions.",
} as const;

export const COURSE_PREREQUISITES = [
  "No prior bookkeeping knowledge required",
  "Use a phone, tablet, or computer with a modern web browser",
] as const;

export const COURSE_OBJECTIVES = [
  "Record routine bookkeeping transactions each day",
  "Read and understand basic financial statements",
  "Prepare complete records so an accountant can focus on tax preparation",
  "Make business decisions using current financial information",
] as const;

export const COURSE_WEEKS: CourseWeek[] = [
  {
    id: "week-1",
    week: 1,
    title: "Daily Ledger",
    worldName: "Daily Ledger",
    icon: "📒",
    locked: false,
    summary:
      "What bookkeeping is, why owners need it, and how double-entry plus sales tax work in about five minutes a day.",
    topics: [
      {
        id: "w1-t1",
        number: "1",
        title: "What is bookkeeping?",
        lessonId: "lesson-why-bookkeeping",
        subtopics: [
          "Record everyday transactions (meals, vehicle, office, supplies, travel, equipment)",
          "Consistency principle — use the same account every time",
        ],
      },
      {
        id: "w1-t2",
        number: "2",
        title: "Why is it so important?",
        lessonId: "lesson-why-bookkeeping",
        subtopics: [
          "Organize your financial data",
          "See business health and make decisions from data",
          "Meet legal obligations (taxes, banks, partners)",
        ],
      },
      {
        id: "w1-t3",
        number: "3",
        title: "What is double-entry bookkeeping? And sales taxes",
        lessonId: "lesson-double-entry",
        subtopics: [
          "Two opposing sides to every transaction",
          "Spend cash → cash down + goods/services gained",
          "Sales tax on everyday buys (taxi, Home Depot)",
          "Most owners need about 5 minutes a day",
        ],
      },
    ],
  },
  {
    id: "week-2",
    week: 2,
    title: "Account Sorter",
    worldName: "Account Sorter",
    icon: "🗂️",
    locked: true,
    summary:
      "Spending and selling (cash now or later), then compile the month into a Trial Balance and sort assets, liabilities, income, expenses, and equity.",
    topics: [
      {
        id: "w2-t0",
        number: "1",
        title: "Assets, Liabilities, Income and Expenses",
        lessonId: "lesson-account-types",
        subtopics: [
          "Spending and selling — money moves now or later",
          "Fixed vs current assets; long-term vs current liabilities",
          "Income, expenses, and equity in plain language",
        ],
      },
      {
        id: "w2-t1",
        number: "2",
        title: "Trial Balance",
        lessonId: "lesson-trial-balance",
        subtopics: [
          "Daily entries compile into a month-end summary",
          "Holds assets, liabilities, income/revenues, and expenses",
          "Debits must equal credits before you build reports",
        ],
      },
    ],
  },
  {
    id: "week-3",
    week: 3,
    title: "Reports Room",
    worldName: "Reports Room",
    icon: "📊",
    locked: true,
    summary:
      "Transactions compile into a Trial Balance, then into two wealth statements — Profit & Loss and Balance Sheet — so you can turn insights into decisions.",
    topics: [
      {
        id: "w3-t0",
        number: "1",
        title: "The report flow",
        lessonId: "lesson-profit-loss",
        subtopics: [
          "Transactions → Trial Balance → Profit & Loss + Balance Sheet",
          "Insights from both reports → better Decisions",
        ],
      },
      {
        id: "w3-t1",
        number: "2",
        title: "Financial statements",
        lessonId: "lesson-profit-loss",
        subtopics: [
          "Two statements that show increase/decrease of your wealth",
          "Profit & Loss: income, direct costs, gross profit, expenses, net income",
          "Practice reading a real P&L layout",
        ],
      },
      {
        id: "w3-t2",
        number: "3",
        title: "Balance Sheet & the equation",
        lessonId: "lesson-balance-sheet",
        subtopics: [
          "Assets, liabilities, and equity at a point in time",
          "Assets = Liabilities + Equity",
          "Trial Balance feeds both statements",
        ],
      },
      {
        id: "w3-t3",
        number: "4",
        title: "Insights → Decisions",
        lessonId: "lesson-balance-sheet",
        subtopics: [
          "Read net income, cash, and receivables together",
          "Decide next moves from the numbers — not from memory",
          "June practice: keep recording through month-end so reports stay trustworthy",
        ],
      },
    ],
  },
  {
    id: "week-4",
    week: 4,
    title: "Year-End Boss Fight",
    worldName: "Year-End Boss Fight",
    icon: "⚔️",
    locked: true,
    summary:
      "Before closing the year: post depreciation, home office, and mileage journals — then hand a clean package to your accountant for tax prep.",
    topics: [
      {
        id: "w4-t0",
        number: "1",
        title: "Year-end common journals",
        lessonId: "lesson-depreciation",
        subtopics: [
          "Same flow still applies: Transactions → Trial Balance → Profit & Loss + Balance Sheet → Insights → Decisions",
          "Other entries before closing the financial period (year)",
        ],
      },
      {
        id: "w4-t1",
        number: "2",
        title: "a. Depreciation",
        lessonId: "lesson-depreciation",
        subtopics: [
          "Vehicle $30,000 × 30% = $9,000 (NBV $21,000)",
          "Furniture $15,000 × 20% = $3,000 (NBV $12,000)",
          "Computers $5,000 × 50% = $2,500 (NBV $2,500)",
          "Journal #1: Dr Depreciation $14,500 / Cr Cum. Amort. by asset",
        ],
      },
      {
        id: "w4-t2",
        number: "3",
        title: "b. Home office expenses",
        lessonId: "lesson-depreciation",
        subtopics: [
          "Office 150 ÷ home 1,500 = 10% business use",
          "Eligible home costs $35,850 × 10% = $3,585",
          "Journal #2: Dr Home office use/rent / Cr Shareholders' loan",
        ],
      },
      {
        id: "w4-t3",
        number: "4",
        title: "c. Mileage claim",
        lessonId: "lesson-depreciation",
        subtopics: [
          "Business distance 25,000 km (of 35,000 total)",
          "First 5,000 @ $0.68 = $3,400; remaining 20,000 @ $0.61 = $12,200",
          "Journal #3: Dr Vehicle expenses (Mileage) $15,600 / Cr Shareholders' loan",
        ],
      },
      {
        id: "w4-t4",
        number: "5",
        title: "Handover to accountants for tax preparation",
        lessonId: "lesson-handoff",
        subtopics: [
          "Balanced trial balance + P&L + Balance Sheet",
          "Supporting schedules: depreciation, home office %, mileage log",
          "Complete bookkeeping so accountants can focus on tax filing",
        ],
      },
    ],
  },
];

export function getCourseWeek(week: number): CourseWeek | undefined {
  return COURSE_WEEKS.find((w) => w.week === week);
}
