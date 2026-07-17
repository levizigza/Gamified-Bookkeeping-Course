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
    title: "What Is Bookkeeping — and Why It Matters",
    storyIntro:
      "Bright Path Consulting is live in Calgary. Receipts are already piling up: a client lunch, " +
      "fuel for a site visit, Home Depot materials for a workshop, and a taxi from the airport. " +
      "Bookkeeping is how you turn that everyday noise into organized numbers you can trust.",
    learningObjectives: [
      "Define bookkeeping as recording everyday financial transactions",
      "Name common transaction types: meals & entertainment, vehicle, office, supplies, travel, equipment",
      "Apply the Consistency principle — same account, every time",
      "Explain why records matter: organize information, make business decisions, and prepare for taxes, banks, or partners",
    ],
    explanation: [
      "Bookkeeping is the recording of everyday financial transactions — meals and entertainment, vehicle expenses, office expenses, supplies, travel, equipment, and more.",
      "One important principle is Consistency. If a plumber records job materials in a supplies / direct-cost account, they should not later dump the same kind of purchase into general Office Expenses. Pick the right home and stick with it.",
      "You record everyday transactions for three practical reasons. First, your financial information stays organized. Second, you can see how the business is doing and make decisions from current numbers. Third, you can give reliable information to tax authorities, banks, partners, and other people who need it.",
      "You do not need hours each night. Most owners only need about five minutes a day. Routine transactions (travel, office, meals, supplies) happen often; others (subscriptions, telephone, insurance) usually hit once a month.",
    ],
    examples: [
      {
        title: "What counts as a bookkeeping transaction?",
        description:
          "Client lunch, fuel for a visit, printer paper, a taxi to a meeting, a flight, office cleaning, and a new laptop are all everyday records — not optional extras.",
        accountHint: "Meals · Vehicle · Supplies · Travel · Office · Equipment",
      },
      {
        title: "Consistency — the plumber rule",
        description:
          "Job materials for client work belong in Supplies (or Direct Costs) every time. Do not move them to Office Expenses next month just because it feels convenient.",
        accountHint: "Supplies / Direct Costs",
      },
      {
        title: "Why organize?",
        description:
          "A clear ledger turns bank noise into a picture of health: what you earned, what you spent, and what you can afford.",
        accountHint: "Organized data → better decisions",
      },
      {
        title: "Why do other people need clean records?",
        description:
          "Clean books help you file taxes, answer bank questions, and show partners the truth — not a reconstructed story from memory.",
        accountHint: "Taxes · Banks · Partners",
      },
    ],
    bossTip: {
      title: "Five minutes a day beats December panic",
      body:
        "Record routine receipts while they are fresh. Monthly bills (phone, insurance, software) can wait for a short weekly or month-end batch — but do not skip the daily habit.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Once you decide which account holds a type of spend, use that same account going forward.",
      example:
        "Client workshop materials → Supplies every time. Do not switch them into Office Expenses later. Your reports and your accountant both depend on that habit.",
    },
    primaryChallengeId: "challenge-why-books",
    durationMinutes: 10,
  },
  {
    id: "lesson-double-entry",
    week: 1,
    worldId: "daily-ledger",
    title: "Double-Entry Bookkeeping and Sales Taxes",
    storyIntro:
      "You hail a taxi to a client site and swipe your business card. Cash (or credit) goes down — " +
      "and you gained a ride. At Home Depot you buy materials and pay GST. Double-entry captures both " +
      "sides of every moment like this, including the tax.",
    learningObjectives: [
      "See that every transaction has two opposing sides",
      "Connect spending to what you gain in return (goods or a service)",
      "Separate sales tax from the underlying expense or revenue",
      "Practice everyday GST examples like a taxi ride or a Home Depot purchase",
    ],
    explanation: [
      "Double-entry bookkeeping means we always have two opposing sides to any transaction.",
      "Every time you spend money, your cash (or credit card) balance goes down. At the same time, you gain something in return — goods or a service.",
      "Handling sales taxes: when you hail a taxi or buy materials at Home Depot, the receipt includes GST. Split the tax from the base cost. In this course, GST you pay on business purchases is recorded in GST/HST Payable as an input tax credit (it reduces tax you owe). GST you collect on sales is also recorded in GST/HST Payable — that tax is not yours to keep.",
      "Most transactions happen regularly, such as travel, office costs, meals, and supplies. Others usually happen once a month, such as subscriptions, telephone, and insurance. The double-entry pattern stays the same; only the timing changes.",
      "For many small business owners, about five focused minutes each day can keep routine records up to date.",
    ],
    examples: [
      {
        title: "Taxi to a client meeting",
        description:
          "You pay $42 + GST. Cash/credit goes down; you gained a transportation service. Record Travel Expense plus recoverable GST when it applies.",
        accountHint: "Travel Expense · GST/HST Payable (input tax credit) · Bank or Credit Card",
      },
      {
        title: "Home Depot materials",
        description:
          "Workshop supplies $200 + $10 GST. Expense the materials and track GST separately — do not bury tax inside Supplies.",
        accountHint: "Supplies · GST/HST Payable (input tax credit) · Bank or Credit Card",
      },
      {
        title: "Spend money → gain something",
        description:
          "Fuel, software, meals, and equipment all follow the same idea: one side is what you gave up; the other is what you got.",
        accountHint: "Two sides every time",
      },
      {
        title: "Daily vs monthly rhythm",
        description:
          "Daily: meals, fuel, taxis, small supplies. Monthly: phone, insurance, software subscriptions. Same double-entry rules — different timing.",
        accountHint: "Routine vs once-a-month",
      },
    ],
    bossTip: {
      title: "Ask: what did I give up, and what did I get?",
      body:
        "That one question trains double-entry faster than memorizing debit/credit charts. Add \"was there sales tax?\" and you are already thinking like a bookkeeper.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "Handle GST the same way every time. Split tax from the purchase or sale amount on taxable transactions.",
      example:
        "A $52.50 taxi with GST should not be a flat $52.50 expense one day and a split entry the next. Pick the split approach and use it for every taxable receipt.",
    },
    primaryChallengeId: "challenge-double-entry-duel",
    durationMinutes: 12,
  },
  {
    id: "lesson-june-sprint",
    week: 1,
    worldId: "daily-ledger",
    title: "June Ledger Sprint",
    storyIntro:
      "June 2024 is your practice month. Bright Path Consulting has client payments, meals, vehicle costs, " +
      "office and supplies runs, travel, equipment, and GST on everyday buys — the same rhythm owners live every week.",
    learningObjectives: [
      "Record everyday transactions: meals, entertainment, vehicle, office, supplies, travel, and equipment",
      "Apply double-entry and GST splits to real Bright Path scenarios",
      "Practice the five-minute daily habit on a full month of activity",
      "Stay consistent: same account for the same type of spend",
    ],
    explanation: [
      "This sprint puts Week 1 into motion. You will record Bright Path’s June transactions the way a real owner maintains books before tax season.",
      "Meals and entertainment, vehicle costs, office expenses, supplies, travel, and equipment all appear in a typical consulting month — exactly the everyday categories from Module 1.",
      "Remember the exchange: every payment has two sides. When sales tax applies (taxi-style rides, Home Depot–style materials, taxable sales), split GST from the base amount.",
      "Consistency beats perfection. Use the same accounts all month, catch up weekly if you miss a day, and keep the five-minute habit.",
    ],
    examples: [
      {
        title: "June 5 — Client payment deposited",
        description:
          "A Calgary client pays $4,200 for consulting (including GST). Split revenue and tax; increase your bank balance.",
        accountHint: "Bank · Consulting Income · GST/HST Payable",
      },
      {
        title: "June 12 — Business lunch",
        description:
          "Client lunch on the credit card. Meals & Entertainment — not Supplies or Office Expenses.",
        accountHint: "Meals and Entertainment · Credit Card Payable",
      },
      {
        title: "June 18 — Laptop purchase",
        description:
          "$2,400 computer for consulting is Equipment (an asset), not a mystery expense.",
        accountHint: "Equipment · Bank or Credit Card",
      },
      {
        title: "June 22 — Client site mileage",
        description:
          "Log business kilometres consistently with Vehicle Expense - Mileage.",
        accountHint: "Vehicle Expense - Mileage",
      },
      {
        title: "June 28 — Supplies with GST",
        description:
          "Home Depot–style materials run: split supplies from GST so recoverables stay accurate.",
        accountHint: "Supplies · GST/HST Payable (input tax credit) · Credit Card or Bank",
      },
    ],
    bossTip: {
      title: "Batch by week, not by panic",
      body:
        "If you miss a day, catch up before the weekend — not at year-end. Weekly reviews catch GST mistakes early.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body:
        "June sets your pattern. How you code meals, materials, mileage, and equipment this month should match every month after.",
      example:
        "Job materials stay in Supplies. Client lunches stay in Meals & Entertainment. Do not reshuffle accounts mid-year without a reason.",
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
    title: "Assets, Liabilities, Income and Expenses",
    storyIntro:
      "June at Bright Path Consulting is full of spending and selling — some with cash right away, " +
      "some with no immediate funds (invoices and credit cards). Before a trial balance makes sense, " +
      "you need the buckets: what you own, what you owe, what you earned, and what you spent.",
    learningObjectives: [
      "See that transactions are spending or selling — with or without immediate funds",
      "Distinguish fixed assets from current assets",
      "Distinguish long-term liabilities from current liabilities",
      "Define income, expense, and equity in plain language",
    ],
    explanation: [
      "Spending and selling can involve immediate funds (cash or bank moves now) or no immediate funds (you record a receivable, payable, or credit card balance instead).",
      "A fixed asset is something valuable you acquired and are holding because it is or will help generate income: building, vehicle, equipment, furniture and fittings, and investments.",
      "A current asset comes from trading or will likely stay on your books for less than a year: cash/bank balance, receivable, prepaid expenses, and inventory.",
      "A long-term liability reduces your assets over time and is carried for one year or more: bank loan, mortgage, and money owed to a third party on a multi-year basis.",
      "A current liability is what you owe and will likely pay within a year: line of credit, credit card, taxes, and shareholder’s loan.",
      "Income/revenue is a gain measured in money in exchange for services or goods you sold — it increases your assets (cash now or receivable later).",
      "Expense is money you spend to acquire a good or a service — it reduces your assets (or increases what you owe).",
      "Equity is the owner's share of the business after subtracting what the business owes from what it owns. It includes owner investment and profits kept in the business.",
    ],
    examples: [
      {
        title: "Selling — immediate funds",
        description:
          "Client pays today. Bank (current asset) goes up. Income was earned and cash arrived now.",
        accountHint: "Income · Current Asset · Bank/Cash",
      },
      {
        title: "Selling — no immediate funds",
        description:
          "You invoice for work due in 30 days. Accounts Receivable (current asset) goes up; cash has not moved yet.",
        accountHint: "Income · Current Asset · Receivable",
      },
      {
        title: "Spending — immediate funds",
        description:
          "You buy inventory or pay a bill from the bank. Cash goes down; you gained goods or a service (or cleared a debt).",
        accountHint: "Expense or Asset · Bank/Cash",
      },
      {
        title: "Spending — no immediate funds",
        description:
          "You swipe the business credit card or take 30-day supplier terms. No bank cash yet — a current liability goes up.",
        accountHint: "Expense · Current Liability",
      },
      {
        title: "Fixed vs current asset",
        description:
          "A company vehicle or laptop you keep for years is a fixed asset. Cash, receivables, prepaid software, and inventory are current.",
        accountHint: "Fixed · Current",
      },
      {
        title: "Long-term vs current liability",
        description:
          "A five-year bank loan or mortgage is long-term. Credit card, taxes payable, line of credit, and shareholder’s loan are usually current.",
        accountHint: "Long-term · Current",
      },
    ],
    bossTip: {
      title: "Ask two questions on every transaction",
      body:
        "Is this spending or selling? Did funds move now, or later? Those answers point you to the right asset or liability bucket.",
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
    title: "Trial Balance",
    storyIntro:
      "It is June 30, 2024. You have recorded Bright Path’s daily spending and selling all month. " +
      "Those entries compile into a summarized statement — the Trial Balance — so you can prove the books before reports.",
    learningObjectives: [
      "Understand that daily transactions compile into a trial balance (usually at month-end)",
      "Know the trial balance holds assets, liabilities, income/revenues, and expenses (plus equity)",
      "Confirm total debits equal total credits before building financial statements",
      "Use the trial balance as the bridge from transactions to reports",
    ],
    explanation: [
      "As you record daily transactions, each account builds a running balance. At month-end, those account balances are gathered into one list called the Trial Balance.",
      "In the end, the trial balance holds assets, liabilities, income/revenues, and expenses (and equity for a complete picture of the chart).",
      "You list every account with its debit or credit balance. If double-entry was recorded correctly, total debits equal total credits.",
      "Assets and expenses normally show debit balances. Liabilities, equity, and income/revenue normally show credit balances.",
      "A balanced trial balance is your green light before Profit & Loss and Balance Sheet work in Week 3.",
    ],
    examples: [
      {
        title: "Month-end checkpoint",
        description:
          "June 1–30 entries roll into one list of account totals. You do not re-enter every receipt — you summarize what you already recorded.",
        accountHint: "Compile · Do not rebuild from scratch",
      },
      {
        title: "Bank/Cash on the trial balance",
        description: "Shows as a debit if you have money in the account — a current asset balance.",
        accountHint: "Debit · Current Asset",
      },
      {
        title: "Consulting Income on the trial balance",
        description: "Revenue for the month appears as a credit — income/revenue.",
        accountHint: "Credit · Income",
      },
      {
        title: "Out of balance",
        description:
          "If debits are $12,400 and credits are $12,350, you are off by $50. Find the error before reporting.",
        accountHint: "Fix before Week 3",
      },
    ],
    bossTip: {
      title: "Run the trial balance before you celebrate month-end",
      body:
        "A balanced trial balance is your green light. If it does not balance, fix the entries now — not the night before you meet your accountant.",
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
    title: "Financial Statements — Profit & Loss",
    storyIntro:
      "Bright Path's June transactions are in. The trial balance balances. Now the path opens: " +
      "Transactions → Trial Balance → Profit & Loss and Balance Sheet → Insights → Decisions. " +
      "Week 3 is where owners finally see wealth go up or down — in two statements.",
    learningObjectives: [
      "Trace the flow from transactions to trial balance to financial statements",
      "Define financial statements as two reports that picture the increase/decrease of wealth",
      "Read a Profit & Loss: revenue, direct costs, gross profit, expenses, net income",
      "Practice connecting June recording habits to trustworthy month-end reports",
    ],
    explanation: [
      "Financial statements turn your recorded transactions into two main reports. Together, they show whether the business earned a profit and what the business owns and owes.",
      "The flow is: everyday Transactions compile into a Trial Balance; from that checkpoint you build Profit & Loss and Balance Sheet; those reports create Insights that drive Decisions.",
      "The Profit & Loss covers a period (for example June 1–30, or Jan 1–Dec 31). It starts with income/revenue, subtracts direct costs to get gross profit, then subtracts operating expenses to reach income before tax and net income.",
      "Typical P&L expense lines look familiar from Week 1: supplies, bank charges, continuing education, dues, insurance, meals, office, professional fees, telephone, travel, royalties, donations — and more.",
      "Keep recording June through month-end. Reports only tell the truth if the ledger is complete — about five minutes a day still applies.",
    ],
    examples: [
      {
        title: "The flow on one page",
        description:
          "Transactions feed the Trial Balance. Two arrows leave the Trial Balance: one to Profit & Loss, one to Balance Sheet. Under both sits Insights, then Decisions.",
        accountHint: "Trial Balance → two reports → insights → decisions",
      },
      {
        title: "Sample P&L shape",
        description:
          "Revenue $31,198 − Direct costs $7,000 = Gross profit $24,198. After operating expenses, net income might be about $17,764 — wealth up for the period.",
        accountHint: "Revenue · Direct costs · Gross profit · Net income",
      },
      {
        title: "Expense detail lives on the P&L",
        description:
          "Travel, office, professional fees, and meals reduce profit for the period. They do not sit on the Balance Sheet as assets.",
        accountHint: "Operating expenses",
      },
      {
        title: "June practice",
        description:
          "Record Bright Path transactions from June 1 through June 30 so your trial balance — and then your P&L — are complete.",
        accountHint: "Month-end completeness",
      },
    ],
    bossTip: {
      title: "Gross profit first, then net income",
      body:
        "Glance at gross profit (after direct costs) before diving into every expense line. It tells you whether the core work is priced well — then expenses show what it costs to run the shop.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Build your P&L the same way every month so you can compare periods honestly.",
      example:
        "If consulting income is mapped without burying GST in revenue in June, use the same mapping in July.",
    },
    primaryChallengeId: "challenge-build-pl",
    durationMinutes: 12,
  },
  {
    id: "lesson-balance-sheet",
    week: 3,
    worldId: "reports-room",
    title: "Balance Sheet, Insights & Decisions",
    storyIntro:
      "The P&L answered \"How did we do this period?\" The Balance Sheet answers \"Where do we stand today?\" " +
      "Together they create insights — and insights are only useful if they change your next decision.",
    learningObjectives: [
      "Read a Balance Sheet: assets, liabilities, and equity at a point in time",
      "Prove Assets = Liabilities + Equity",
      "See how the Trial Balance feeds both P&L and Balance Sheet",
      "Turn report insights into owner decisions (cash, collections, spending, growth)",
    ],
    explanation: [
      "The Balance Sheet is a snapshot — often month-end or year-end. Assets (bank & cash, receivables, prepaid, furniture & equipment net of amortization) must equal liabilities plus equity.",
      "Liabilities include current items (credit cards, taxes, accrued liabilities, GST payable) and any non-current debts. Equity includes capital stock, retained earnings, and the period's net profit flowing from the P&L.",
      "The Trial Balance is the bridge: every debit and credit account total feeds one statement or the other. Income and expense accounts roll into the P&L; asset, liability, and equity accounts roll into the Balance Sheet.",
      "Insights come from reading both: profitable but low cash? Check receivables. Strong cash but weak net income? Review expenses or pricing. Insights without Decisions are just interesting numbers.",
      "Owner decisions might be: collect invoices before buying equipment, trim the largest expense line, or keep recording daily so next month's reports stay trustworthy.",
    ],
    examples: [
      {
        title: "Equation check",
        description:
          "If Total Assets are $235,611 and Total Liabilities are $17,868, Equity must be $217,743 so Assets = Liabilities + Equity.",
        accountHint: "Assets = Liabilities + Equity",
      },
      {
        title: "Contra-assets on the Balance Sheet",
        description:
          "Accumulated amortization reduces furniture, computers, or other fixed assets. The P&L shows the period's depreciation expense; the Balance Sheet shows the running total.",
        accountHint: "Accum. Amortization · Fixed assets",
      },
      {
        title: "Insight → Decision",
        description:
          "Profit & Loss net income is strong, but cash is low and Accounts Receivable is large. That means much of the profit is still in unpaid customer invoices. Collect those invoices before making a large purchase.",
        accountHint: "Insights → Decisions",
      },
      {
        title: "Which report answers which question?",
        description:
          "Net income? Profit & Loss. What we own and owe today? Balance Sheet. Raw account totals before statements? Trial Balance.",
        accountHint: "Pick the right report",
      },
    ],
    bossTip: {
      title: "Always pair the two statements",
      body:
        "A profitable month with little cash means collections may lag. Cash with a thin net income means spending or pricing needs a look. Read both before you hire, buy, or raise prices.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Prepare both statements from the same trial balance each month.",
      example:
        "If June's trial balance is your source of truth, generate P&L and Balance Sheet from it — do not keep a separate owner spreadsheet.",
    },
    primaryChallengeId: "challenge-insight-detective",
    durationMinutes: 14,
  },
];

const week4Lessons: LessonContent[] = [
  {
    id: "lesson-depreciation",
    week: 4,
    worldId: "year-end-boss",
    title: "Year-End Common Journals",
    storyIntro:
      "The familiar flow still holds: Transactions → Trial Balance → Profit & Loss + Balance Sheet → Insights → Decisions. " +
      "Before you close the year, you post a few other entries — depreciation, home office, and mileage — so the statements tell the truth.",
    learningObjectives: [
      "List the common year-end journals: depreciation, home office, and mileage",
      "Calculate amortization, net book value, home-office %, and tiered mileage",
      "Record Journals #1–#3 with balanced debits and credits",
      "See why these entries come before handover to accountants",
    ],
    explanation: [
      "Other entries before closing a financial period (year) include: (a) Depreciation, (b) Home office expenses, and (c) Mileage claim.",
      "Depreciation spreads an asset's cost over the years it helps the business. Net book value means the asset's original cost minus all depreciation recorded so far. Example: Vehicle $30,000 × 30% = $9,000 depreciation (net book value $21,000); Furniture $15,000 × 20% = $3,000 (net book value $12,000); Computers $5,000 × 50% = $2,500 (net book value $2,500). Total depreciation is $14,500.",
      "Journal #1: Debit Depreciation Expense $14,500. Credit Accumulated Amortization for Vehicle $9,000, Furniture $3,000, and Computers $2,500. Accumulated amortization is the running total of depreciation recorded for an asset.",
      "Home office: office area ÷ total home area. Example: 150 ÷ 1,500 = 10%. Apply that % to eligible home costs (heat, electricity, insurance, maintenance, mortgage interest, property taxes, internet, and similar).",
      "Journal #2: On $35,850 of eligible costs × 10% = $3,585 — Debit Home office use/rent $3,585; Credit Shareholders' loan $3,585 (the business owes you for the personal share you funded).",
      "Mileage (Canada-style teaching rates): first 5,000 business km at $0.68, remaining at $0.61. Example: 25,000 business km → $3,400 + $12,200 = $15,600.",
      "Journal #3: Debit Vehicle expenses (Mileage) $15,600; Credit Shareholders' loan $15,600.",
      "Educational note: real CCA may use half-year rules and changing CRA rates — this course uses the simplified year-end worksheets from your Week 4 materials.",
    ],
    examples: [
      {
        title: "Journal #1 — Depreciation",
        description:
          "One adjusting entry for the year: debit Depreciation Expense $14,500; credit Accumulated Amortization for Vehicle $9,000, Furniture $3,000, and Computers $2,500.",
        accountHint: "Depreciation Expense · Accumulated Amortization",
      },
      {
        title: "Journal #2 — Home office",
        description:
          "10% of $35,850 = $3,585. Dr Home office use/rent; Cr Shareholders' loan.",
        accountHint: "Home office use/rent · Shareholders' loan",
      },
      {
        title: "Journal #3 — Mileage",
        description:
          "25,000 business km: (5,000 × $0.68) + (20,000 × $0.61) = $15,600. Dr Vehicle expenses (Mileage); Cr Shareholders' loan.",
        accountHint: "Vehicle expenses (Mileage) · Shareholders' loan",
      },
      {
        title: "Keep June practice going",
        description:
          "Record Bright Path transactions June 1–30 so year-end adjustments sit on complete books — not a half-built ledger.",
        accountHint: "Daily habit → trustworthy year-end",
      },
    ],
    bossTip: {
      title: "Calculate, then journal, then hand off",
      body:
        "Run the three worksheets (depreciation, home office, mileage), post Journals #1–#3, re-check the trial balance, then package reports for your accountant.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Use the same depreciation rates, home-office floor plan %, and mileage method each year unless your accountant directs a change.",
      example:
        "If you claim the per-km mileage method in 2024, do not switch to actual vehicle expenses in 2025 without professional guidance.",
    },
    primaryChallengeId: "challenge-depreciation",
    calculatorHref: "/tools#calculators",
    calculatorLabel: "Open Year-End Calculators",
    durationMinutes: 18,
  },
  {
    id: "lesson-handoff",
    week: 4,
    worldId: "year-end-boss",
    title: "Handover to Accountants for Tax Preparation",
    storyIntro:
      "Journals #1–#3 are posted. Trial balance balances. P&L and Balance Sheet reflect the year. " +
      "Now you hand over to accountants for tax preparation — the finish line where expert review matters.",
    learningObjectives: [
      "Know what \"tax-ready books\" means after year-end common journals",
      "Assemble the handoff package: Trial Balance, Profit & Loss, Balance Sheet, General Ledger, bank reconciliations, and supporting worksheets",
      "Document depreciation, home office %, and mileage so accountants can verify quickly",
      "Complete as much bookkeeping as possible before corporate tax filing",
    ],
    explanation: [
      "Handover to accountants for tax preparation is the last Week 4 step — after other entries before closing the period.",
      "Tax-ready means that transactions are recorded, the Trial Balance balances, Journals #1–#3 for depreciation, home office, and mileage are posted, and the financial statements are generated from the adjusted Trial Balance.",
      "Include supporting schedules: asset cost/rate/amortization table, home floor plan % and eligible cost list, and a mileage log (date, destination, km, purpose).",
      "Shareholders' loan often grows when home office and mileage are credited there — flag that balance for your accountant.",
      "When you finish the bookkeeping, accountants can focus on tax strategy and filing instead of reconstructing your year.",
    ],
    examples: [
      {
        title: "Handoff checklist",
        description:
          "Adjusted trial balance, Profit & Loss, Balance Sheet, general ledger detail, bank reconciliations, plus the three year-end worksheets.",
        accountHint: "Reports + schedules",
      },
      {
        title: "Depreciation schedule",
        description:
          "Attach the vehicle, furniture, and computer table showing each asset's cost, depreciation rate, depreciation amount, and net book value. This supports Journal #1.",
        accountHint: "Supporting schedule",
      },
      {
        title: "Mileage log backup",
        description:
          "Keep trip details that support the $15,600 claim — CRA may ask even when the journal is clean.",
        accountHint: "Mileage log",
      },
    ],
    bossTip: {
      title: "Ask what format they prefer",
      body:
        "PDF reports, Excel exports, or live software access — five minutes of alignment saves a week of back-and-forth.",
    },
    consistencyRule: {
      title: "The Consistency Rule",
      body: "Hand off the same chart of accounts and report structure you used all year.",
      example:
        "If Bright Path used Home office use/rent and Vehicle expenses (Mileage) all year, do not rename them the week before handoff.",
    },
    primaryChallengeId: "challenge-year-end-boss",
    calculatorHref: "/tools#calculators",
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
