import type { LessonContent } from "@/lib/content/schemas";
import type { WorldId } from "@/lib/types";

export type {
  BossTipContent,
  ConsistencyRuleContent,
  LessonContent,
  LessonExample,
} from "@/lib/content/schemas";

/** All lesson content indexed by week. */
const week1Lessons: LessonContent[] = [
  {
    id: "lesson-why-bookkeeping",
    week: 1,
    worldId: "daily-ledger",
    title: "Why Bookkeeping Matters",
    storyIntro:
      "It is Monday morning in Calgary. You have just incorporated Bright Path Consulting, " +
      "and your first client invoice went out last week. Coffee in hand, you open your banking app " +
      "and wonder: \"Where did that money go, and what do I owe at tax time?\" " +
      "That is exactly what bookkeeping answers — one small record at a time.",
    learningObjectives: [
      "Understand that bookkeeping means recording everyday financial transactions",
      "Recognize common transaction types: meals, travel, supplies, equipment, and more",
      "See why consistent records help you run a healthier business",
      "Build a simple daily habit you can actually keep",
    ],
    explanation: [
      "Bookkeeping is not about being a math genius. It is the habit of writing down what your business earns, spends, owns, and owes — usually every day or every few days.",
      "Think of it like keeping a logbook for your company car. You note every trip, every fuel stop, every repair. Your business finances deserve the same care.",
      "Good records help you organize messy bank statements into a clear picture. You can see whether the business is healthy, whether you can afford a new laptop, and what to tell your accountant at year-end.",
      "Banks, business partners, and investors all trust owners who know their numbers. Even if you are solo today, clean books make future growth much easier.",
      "You do not need hours each night. Most owners thrive with a 10–15 minute daily check-in: open the bank feed, record new transactions, and move on with your day.",
    ],
    examples: [
      {
        title: "Client lunch in downtown Calgary",
        description:
          "You meet a prospect at a café and pay $48 for lunch. That is a business meal — record it when it happens, not three months later.",
        accountHint: "Meals and Entertainment",
      },
      {
        title: "Staples run for office supplies",
        description:
          "Pens, notebooks, and printer paper for workshop materials. Small purchases add up — track them consistently.",
        accountHint: "Supplies",
      },
      {
        title: "Laptop for client projects",
        description:
          "A $2,400 computer used for consulting work is equipment, not a one-time mystery expense.",
        accountHint: "Equipment",
      },
      {
        title: "Flight to Edmonton for a client site visit",
        description:
          "Travel for business — flights, hotels, parking — belongs in your books the same way every time.",
        accountHint: "Travel Expense",
      },
    ],
    bossTip: {
      title: "Pick a time and protect it",
      body:
        "Block 15 minutes on your calendar — end of day or first thing morning — and treat it like a client meeting. " +
        "Recording transactions while they are fresh beats reconstructing June from memory in December.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Once you decide how to record a type of transaction, stick with that same logic going forward. " +
        "Consistency makes your reports trustworthy and your tax prep cheaper.",
      example:
        "If you always put client lunches in Meals and Entertainment, do not randomly put the next lunch in Office Expenses. " +
        "Your future self — and your accountant — will thank you.",
    },
    primaryChallengeId: "challenge-classify-transaction",
    durationMinutes: 8,
  },
  {
    id: "lesson-double-entry",
    week: 1,
    worldId: "daily-ledger",
    title: "Double-Entry Basics",
    storyIntro:
      "You just paid $126 for a monthly software subscription on your business credit card. " +
      "Your bank balance did not change — but something still happened to your business. " +
      "Double-entry bookkeeping captures both sides of moments like this, so nothing slips through the cracks.",
    learningObjectives: [
      "Learn that every transaction has two opposing sides",
      "Understand what happens when cash goes down — you usually receive something in return",
      "Separate sales tax (GST) from the underlying expense or revenue",
      "See how double-entry keeps your books balanced",
    ],
    explanation: [
      "Double-entry bookkeeping sounds intimidating, but the idea is simple: every transaction affects at least two accounts, and the debits always equal the credits.",
      "When cash goes down, your business usually received something valuable in exchange — a service subscription, supplies, a piece of equipment, or a reduction in money you owe.",
      "When cash goes up, something else changes too — maybe you earned revenue, or a client paid an invoice you sent last month.",
      "In Alberta, most business sales include 5% GST. When you record a sale or purchase, separate the tax from the base amount. The GST you collect is not your money to keep — it belongs in GST/HST Payable until you remit it to the CRA.",
      "Two-sided entries are why your books can prove they are correct: if debits and credits do not match, you know something needs fixing before you trust your reports.",
    ],
    examples: [
      {
        title: "Paying for software on a credit card",
        description:
          "Cash does not leave your bank yet, but you owe more on the credit card and you gained a prepaid subscription.",
        accountHint: "Credit Card Payable ↑ · Prepaid Expenses ↑",
      },
      {
        title: "Client pays a $2,100 invoice (including GST)",
        description:
          "Bank balance goes up $2,100. Revenue is $2,000 and GST Payable is $100 — split them, do not lump tax into income.",
        accountHint: "Bank ↑ · Consulting Income ↑ · GST/HST Payable ↑",
      },
      {
        title: "Buying fuel for a client visit",
        description:
          "Cash or credit card goes down; you received vehicle expense (or track mileage separately — but be consistent!).",
        accountHint: "Vehicle Expense or Mileage ↑ · Bank or Credit Card ↓",
      },
      {
        title: "Entertainment with a referral partner",
        description:
          "A $90 dinner builds relationships. Record the full cost, note who attended, and use the same account each time.",
        accountHint: "Meals and Entertainment",
      },
    ],
    bossTip: {
      title: "Think in exchanges, not just spending",
      body:
        "Before you save a transaction, ask: \"What did my business give up, and what did it get?\" " +
        "Money leaving is only half the story. Training yourself to see both sides makes double-entry feel natural within a week.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Handle GST the same way every time. Split tax from revenue on sales and from expenses on purchases when you claim input tax credits.",
      example:
        "A $105 supply purchase with $5 GST should not be recorded as a flat $105 expense one day and split the next. " +
        "Pick one approach and use it for every taxable transaction.",
    },
    primaryChallengeId: "challenge-classify-transaction",
    durationMinutes: 12,
  },
  {
    id: "lesson-june-sprint",
    week: 1,
    worldId: "daily-ledger",
    title: "June Ledger Sprint",
    storyIntro:
      "June 2024 is your first full month of real practice. Bright Path Consulting has client payments coming in, " +
      "a new laptop on order, mileage to Calgary clients, and the usual stream of coffee meetings and supply runs. " +
      "Your mission: record every transaction from June 1 through June 30 — consistently, accurately, and in balance.",
    learningObjectives: [
      "Record everyday transactions: meals, entertainment, vehicle, office, supplies, travel, and equipment",
      "Apply double-entry rules to real Bright Path Consulting scenarios",
      "Keep GST separate on taxable sales and purchases",
      "Practice the daily bookkeeping habit until it feels routine",
    ],
    explanation: [
      "This is where learning meets doing. You will work through June 2024 one transaction at a time — the same way a real business owner maintains their books before tax season.",
      "Meals and entertainment, vehicle costs, office expenses, supplies, travel, and equipment purchases all show up in a typical consulting month. Each type has a home in your chart of accounts.",
      "Remember the exchange idea: every payment has two sides. Every deposit does too. If your entry does not balance, pause and find the missing piece.",
      "Sales tax matters in Alberta. When you invoice clients or buy taxable goods, record the GST separately so your GST/HST Payable account stays accurate for your quarterly filing.",
      "Perfection is not the goal — consistency is. Record transactions the same way each time, review your work at week-end, and build the habit of touching your books daily.",
    ],
    examples: [
      {
        title: "June 5 — Client payment deposited",
        description:
          "A Calgary client pays $4,200 for consulting work (including GST). Split revenue and tax; increase your bank balance.",
        accountHint: "Bank · Consulting Income · GST/HST Payable",
      },
      {
        title: "June 12 — Business lunch with a prospect",
        description:
          "You pay $52 for lunch on your credit card. Record the meal and the credit card liability — not just \"expense.\"",
        accountHint: "Meals and Entertainment · Credit Card Payable",
      },
      {
        title: "June 18 — Laptop purchase",
        description:
          "$2,400 for a business computer is equipment (an asset), not an immediate full expense.",
        accountHint: "Equipment · Bank or Credit Card",
      },
      {
        title: "June 22 — Drive to client site (45 km)",
        description:
          "Log business kilometres consistently. Use Vehicle Expense - Mileage if you claim by the kilometre method.",
        accountHint: "Vehicle Expense - Mileage",
      },
      {
        title: "June 28 — Office supplies with GST",
        description:
          "$84 total at Staples: $80 supplies + $4 GST. Split the tax if you track input tax credits.",
        accountHint: "Supplies · GST/HST (recoverable) · Credit Card Payable",
      },
    ],
    bossTip: {
      title: "Batch by week, not by panic",
      body:
        "If you miss a day, catch up before the weekend — not at year-end. " +
        "Owners who reconcile weekly spot problems early and sleep better when their accountant asks for the June file.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "June is your training ground. How you record meals, mileage, and equipment this month sets the pattern for every month after.",
      example:
        "If June lunches go to Meals and Entertainment, July lunches go there too. " +
        "If you capitalize equipment over $500, use that same threshold every time — write it down so you do not debate it later.",
    },
    primaryChallengeId: "challenge-double-entry-duel",
    durationMinutes: 25,
  },
];

const week2Lessons: LessonContent[] = [
  {
    id: "lesson-account-types",
    week: 2,
    worldId: "account-sorter",
    title: "Account Categories",
    storyIntro:
      "June is winding down at Bright Path Consulting. Your bank feed, credit card, and invoice folder " +
      "are full of transactions — but your accountant asks, \"Can you send me a trial balance?\" " +
      "Before you can build one, you need to know what kind of account each line belongs to.",
    learningObjectives: [
      "Understand that transactions include both spending and selling",
      "Tell the difference between immediate cash movement and amounts owed later",
      "Classify fixed assets, current assets, liabilities, income, expenses, and equity",
      "See how income increases wealth and expenses reduce what the business owns",
    ],
    explanation: [
      "Every transaction your business records ends up in an account. Accounts are grouped into categories that tell the story of what you own, owe, earn, and spend.",
      "Fixed assets are valuable items you keep for years to help earn income — vehicles, equipment, buildings, furniture, and long-term investments.",
      "Current assets convert to cash within about a year: bank balances, accounts receivable (money owed to you), prepaid expenses, and inventory.",
      "Long-term liabilities are debts due after one year, like a bank loan or mortgage. Current liabilities are due sooner: credit cards, taxes payable, lines of credit, and often shareholder loans.",
      "Income and revenue increase your business wealth when you earn it — even if cash has not arrived yet. Expenses reduce assets (or increase liabilities) when you spend.",
      "Equity shows how owner wealth in the business is growing or shrinking — owner investments plus retained profits.",
    ],
    examples: [
      {
        title: "Client pays you today",
        description:
          "Cash hits your bank immediately. Bank (current asset) goes up — funds moved right away.",
        accountHint: "Current Asset · Bank/Cash",
      },
      {
        title: "You send an invoice — payment due in 30 days",
        description:
          "No cash yet, but you earned revenue. Accounts Receivable (current asset) goes up.",
        accountHint: "Current Asset · Accounts Receivable",
      },
      {
        title: "Company truck purchased",
        description:
          "A vehicle used for years is a fixed asset — not a one-month expense.",
        accountHint: "Fixed Asset · Vehicle",
      },
      {
        title: "Credit card purchase",
        description:
          "You spent, but cash has not left the bank. Credit Card Payable (current liability) increases.",
        accountHint: "Current Liability · Credit Card Payable",
      },
    ],
    bossTip: {
      title: "Learn the buckets once",
      body:
        "You do not need to memorize every account name — learn the seven big buckets. " +
        "When a new account appears, ask: is it something we own, owe, earn, spend, or owner wealth?",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Classify similar items the same way every month. Your trial balance only makes sense if accounts stay in the same category.",
      example:
        "If Shareholder Loan is a current liability in June, keep it there in July unless your accountant advises a change.",
    },
    primaryChallengeId: "challenge-sort-accounts",
    durationMinutes: 12,
  },
  {
    id: "lesson-trial-balance",
    week: 2,
    worldId: "account-sorter",
    title: "Trial Balance Puzzle",
    storyIntro:
      "It is June 30, 2024. You have recorded dozens of transactions for Bright Path Consulting. " +
      "Now you need a trial balance — a list of every account with its debit or credit total — " +
      "to prove your books are in balance before building reports.",
    learningObjectives: [
      "Understand that daily transactions compile into a trial balance",
      "Know that a trial balance summarizes all accounts, usually at month-end",
      "Recognize that a trial balance lists assets, liabilities, income, expenses, and equity",
      "Confirm total debits equal total credits before moving to financial statements",
    ],
    explanation: [
      "A trial balance is a checkpoint. You list every account and its balance — debits in one column, credits in the other.",
      "If you have recorded double-entry correctly all month, total debits will equal total credits. If not, you find mistakes before building your P&L and Balance Sheet.",
      "Assets and expenses normally have debit balances. Liabilities, equity, and revenue normally have credit balances.",
      "The trial balance includes every account type: current and fixed assets, current and long-term liabilities, income, expenses, and equity.",
      "Month-end is the usual time to prepare one — for Bright Path, that means June 30, 2024 before you open the Reports Room.",
    ],
    examples: [
      {
        title: "Bank/Cash balance",
        description: "Shows up as a debit on the trial balance if you have money in the account.",
        accountHint: "Debit balance · Current Asset",
      },
      {
        title: "Consulting Income total",
        description: "Revenue accounts appear as credits on the trial balance.",
        accountHint: "Credit balance · Income",
      },
      {
        title: "Credit Card Payable",
        description: "What you owe the card company shows as a credit balance.",
        accountHint: "Credit balance · Current Liability",
      },
      {
        title: "Out-of-balance trial balance",
        description:
          "If debits are $12,400 and credits are $12,350, you are off by $50 — find the error before reporting.",
        accountHint: "Fix before Week 3 reports",
      },
    ],
    bossTip: {
      title: "Run the trial balance before you celebrate month-end",
      body:
        "A balanced trial balance is your green light. If it does not balance, fix the entries now — " +
        "not the night before you meet your accountant.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Use the same chart of accounts each month so your trial balance lines up period after period.",
      example:
        "If Supplies is account 6100 in June, do not rename or renumber it in July without a reason.",
    },
    primaryChallengeId: "challenge-trial-balance",
    durationMinutes: 15,
  },
];

const week3Lessons: LessonContent[] = [
  {
    id: "lesson-profit-loss",
    week: 3,
    worldId: "reports-room",
    title: "Profit & Loss",
    storyIntro:
      "Your June trial balance balances — a milestone worth celebrating. Now your accountant asks the next question: " +
      "\"How much did you actually make?\" That answer lives on your Profit & Loss statement.",
    learningObjectives: [
      "Understand that the trial balance feeds into financial statements",
      "Read a Profit & Loss (Income Statement) for business performance",
      "See how income, direct costs, gross profit, expenses, and net income fit together",
      "Use P&L results to judge whether the month was profitable",
    ],
    explanation: [
      "Financial statements compile everything you recorded into two main reports: Profit & Loss and Balance Sheet.",
      "The Profit & Loss covers a period — like all of June 2024 — and shows whether you made or lost money.",
      "Start with income (consulting fees, sales). Subtract direct costs tied to specific projects. What is left is gross profit.",
      "Then subtract operating expenses — meals, phone, supplies, bank fees, and the rest. The bottom line is net income.",
      "A positive net income means the business performed well this month. A negative number is a loss — a signal to review pricing and spending.",
    ],
    examples: [
      {
        title: "Consulting income on the P&L",
        description: "All consulting fees earned in June appear as income — even if some invoices are still waiting for payment.",
        accountHint: "Income section",
      },
      {
        title: "Meals and supplies as expenses",
        description: "Operating costs reduce profit. They belong below gross profit on the P&L.",
        accountHint: "Expenses section",
      },
      {
        title: "Net income tells the story",
        description: "If income is $6,000 and expenses are $1,500, net income is $4,500 — your performance score for June.",
        accountHint: "Bottom line",
      },
    ],
    bossTip: {
      title: "Check net income monthly",
      body:
        "Do not wait until tax season. Glance at net income every month — if it trends down for three months, " +
        "that is a conversation you want to have before cash gets tight.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Build your P&L the same way every month so you can compare June to July honestly.",
      example:
        "If consulting income includes GST-split revenue in June, use the same mapping in July — not a lump-sum shortcut.",
    },
    primaryChallengeId: "challenge-build-pl",
    durationMinutes: 12,
  },
  {
    id: "lesson-balance-sheet",
    week: 3,
    worldId: "reports-room",
    title: "Balance Sheet",
    storyIntro:
      "Profit tells you how the month went. The Balance Sheet tells you where you stand today — " +
      "how much cash you have, what clients still owe you, what you owe on the credit card, and how much wealth stays in the business.",
    learningObjectives: [
      "Understand that the Balance Sheet shows business position at a point in time",
      "See how assets, liabilities, and equity connect through the accounting equation",
      "Confirm that assets equal liabilities plus equity",
      "Use reports together to support real business decisions",
    ],
    explanation: [
      "The Balance Sheet is a snapshot — usually at month-end, like June 30, 2024.",
      "Assets are what the business owns: cash, amounts owed by clients, equipment, and more.",
      "Liabilities are what the business owes: credit cards, taxes payable, loans.",
      "Equity is the owner's stake — investments plus profits kept in the business.",
      "The accounting equation must hold: Assets = Liabilities + Equity. When it does, your balance sheet balances.",
      "Together, P&L and Balance Sheet create insights: performance plus position equals smarter decisions about spending, saving, and growth.",
    ],
    examples: [
      {
        title: "Cash and equipment as assets",
        description: "Your bank balance and laptop both appear on the asset side — one current, one fixed.",
        accountHint: "Assets",
      },
      {
        title: "Credit card and GST as liabilities",
        description: "What you owe others stays on the liability side until you pay it down.",
        accountHint: "Liabilities",
      },
      {
        title: "Owner investment as equity",
        description: "Capital Stock shows money the owner put in. Net income for the period adds to equity too.",
        accountHint: "Equity",
      },
    ],
    bossTip: {
      title: "Read P&L and Balance Sheet as a pair",
      body:
        "A profitable month with little cash in the bank means collections may lag. Cash with a loss might mean heavy spending. " +
        "Look at both before you hire, buy equipment, or raise prices.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Prepare both statements from the same trial balance each month.",
      example:
        "If June's trial balance is your source of truth, generate P&L and Balance Sheet from it — do not maintain separate spreadsheets.",
    },
    primaryChallengeId: "challenge-insight-detective",
    durationMinutes: 12,
  },
];

const week4Lessons: LessonContent[] = [
  {
    id: "lesson-depreciation",
    week: 4,
    worldId: "year-end-boss",
    title: "Year-End Adjustments",
    storyIntro:
      "December in Calgary. Bright Path Consulting had a solid year, but your corporate books are not quite tax-ready yet. " +
      "Your accountant emails a short list: \"Post depreciation on the vehicle and laptop, allocate home office costs, " +
      "and book the mileage we discussed.\" These are adjusting journal entries — the last bookkeeping chores before handoff.",
    learningObjectives: [
      "Recognize depreciation, home office, and mileage as common year-end adjusting entries",
      "Understand that adjusting entries update the books before tax preparation",
      "See how each entry uses double-entry accounts from your chart of accounts",
      "Complete as much bookkeeping as possible before your accountant files corporate taxes",
    ],
    explanation: [
      "Month-to-month bookkeeping captures daily transactions. Year-end is when you catch up on items that do not belong in a single June afternoon — spreading asset costs, allocating home expenses, and claiming business kilometres.",
      "Depreciation (amortization) records the wear-and-tear on vehicles, furniture, and computers. You debit Depreciation Expense and credit Accumulated Amortization so the Balance Sheet shows a realistic net book value.",
      "Home office expenses allocate a business-use percentage of rent, utilities, and similar home costs. When personal funds paid those bills, the credit often goes to Shareholder Loan — money moving between you and your corporation.",
      "Mileage claims use per-kilometre rates for business driving. Like home office, the expense is debited and Shareholder Loan is credited when the vehicle costs were personally paid.",
      "These are adjusting journal entries: they align your books with the tax year before your accountant prepares the corporate return. The goal is not perfection on your own — it is handing over clean, complete records.",
    ],
    examples: [
      {
        title: "Vehicle depreciation",
        description:
          "A $30,000 vehicle at a 30% rate produces $9,000 amortization this period. Net book value drops to $21,000 on the Balance Sheet.",
        accountHint: "Depreciation Expense / Accumulated Amortization - Vehicle",
      },
      {
        title: "Home office allocation",
        description:
          "A 150 sq ft office in a 1,500 sq ft home is 10% business use. On $35,850 of eligible costs, the claim is $3,585.",
        accountHint: "Home Office Use/Rent / Shareholder Loan",
      },
      {
        title: "Mileage claim",
        description:
          "25,000 business km at tiered CRA-style rates (first 5,000 km at $0.68, remainder at $0.61) produces a $15,600 claim.",
        accountHint: "Vehicle Expense - Mileage / Shareholder Loan",
      },
      {
        title: "Computers and furniture",
        description:
          "Furniture at $15,000 × 20% = $3,000 amortization. Computers at $5,000 × 50% = $2,500. Different assets, different rates — track each separately.",
        accountHint: "Accumulated Amortization - [Asset name]",
      },
    ],
    bossTip: {
      title: "Finish the books before tax season crunch",
      body:
        "Accountants bill less and advise better when your trial balance is balanced and common adjustments are already posted. " +
        "Block a year-end half-day, run the calculators, post the entries, then send your package.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Use the same depreciation method, home office basis, and mileage approach each year unless your accountant directs a change.",
      example:
        "If you claim mileage using per-km rates in 2024, do not switch to actual vehicle expenses in 2025 without professional guidance — CRA looks for consistency.",
    },
    primaryChallengeId: "challenge-depreciation",
    calculatorHref: "/calculators",
    calculatorLabel: "Open Year-End Calculators",
    durationMinutes: 18,
  },
  {
    id: "lesson-handoff",
    week: 4,
    worldId: "year-end-boss",
    title: "Accountant Handoff",
    storyIntro:
      "Your adjusting entries are posted. Trial balance balances. P&L and Balance Sheet tell a coherent story. " +
      "Now you package everything for your tax professional — not because you failed, but because corporate tax filing " +
      "is the finish line where expert review matters.",
    learningObjectives: [
      "Understand what \"tax-ready books\" means for a small corporation",
      "Know which reports and schedules accountants expect at year-end",
      "See how completing bookkeeping first lowers fees and surprises",
      "Build confidence handing off without hiding messy corners",
    ],
    explanation: [
      "Tax-ready does not mean you filed the return yourself. It means your general ledger is complete: every transaction recorded, trial balance balanced, and common year-end adjustments posted.",
      "Your accountant typically needs a trial balance, Profit & Loss, Balance Sheet, general ledger detail, bank reconciliations, and supporting documents for major entries (equipment invoices, mileage log, home office calculation).",
      "When you post depreciation, home office, and mileage before handoff, your accountant spends time on tax strategy — not reconstructing your year from a shoebox of receipts.",
      "Shareholder Loan balances matter at year-end. Home office and mileage credits often increase what the company owes you (or reduce what you owe the company). Your accountant will confirm the correct presentation.",
      "The goal of Week 4 is completion: do as much bookkeeping as you reasonably can, document assumptions, and let your accountant validate and file.",
    ],
    examples: [
      {
        title: "Trial balance export",
        description:
          "A balanced trial balance as of December 31 proves debits equal credits before financial statements are built.",
        accountHint: "Reports Room → Trial Balance",
      },
      {
        title: "Adjustment memo",
        description:
          "Attach a one-line note with each adjusting entry: \"Home office 10% of $35,850 eligible costs per floor plan.\" Future-you will thank present-you.",
        accountHint: "Journal entry memo field",
      },
      {
        title: "Mileage log backup",
        description:
          "Keep a simple spreadsheet of business trips: date, destination, kilometres, purpose. It supports the $15,600 claim if CRA asks.",
        accountHint: "Supporting schedule (not a GL account)",
      },
    ],
    bossTip: {
      title: "Ask what format they prefer",
      body:
        "Before sending files, ask your accountant whether they want PDF reports, Excel exports, or access to your bookkeeping software. " +
        "Five minutes of alignment saves a week of back-and-forth.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Hand off the same chart of accounts and report structure you used all year.",
      example:
        "If Bright Path's books used Consulting Income and Home Office Use/Rent all year, do not rename accounts the week before handoff.",
    },
    primaryChallengeId: "challenge-year-end-boss",
    calculatorHref: "/calculators",
    calculatorLabel: "Review Year-End Calculators",
    durationMinutes: 12,
  },
];

const allLessons: LessonContent[] = [
  ...week1Lessons,
  ...week2Lessons,
  ...week3Lessons,
  ...week4Lessons,
];

/** All Week 1 lesson content for the Daily Ledger world. */
export const week1LessonContent: LessonContent[] = week1Lessons;

/** All Week 2 lesson content for the Account Sorter world. */
export const week2LessonContent: LessonContent[] = week2Lessons;

/** All Week 3 lesson content for the Reports Room world. */
export const week3LessonContent: LessonContent[] = week3Lessons;

/** All Week 4 lesson content for the Year-End Boss Fight world. */
export const week4LessonContent: LessonContent[] = week4Lessons;

/** Return every lesson in the course (admin / CMS use). */
export function getAllLessonContent(): LessonContent[] {
  return allLessons;
}

/** Look up rich lesson content by id. */
export function getLessonContentById(id: string): LessonContent | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}

/** Return all lesson content for a given week number. */
export function getLessonsByWeek(week: number): LessonContent[] {
  return allLessons.filter((lesson) => lesson.week === week);
}

/** Return all lesson content for a world. */
export function getLessonContentByWorld(worldId: WorldId): LessonContent[] {
  return allLessons.filter((lesson) => lesson.worldId === worldId);
}

/** Check whether rich content exists for a lesson id. */
export function hasLessonContent(id: string): boolean {
  return allLessons.some((lesson) => lesson.id === id);
}
