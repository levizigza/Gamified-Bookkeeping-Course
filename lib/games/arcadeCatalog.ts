export type ArcadeGame = {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  skill: string;
  weeks: string;
  style: "neon" | "8bit" | "paper" | "3d" | "cash" | "equation" | "detective" | "boss";
  featured?: boolean;
};

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "debit-credit",
    title: "Debit or Credit?",
    icon: "⚡",
    tagline: "Speed-tap the correct side",
    description:
      "Week 1–2: everyday GST drills, then spending/selling sides that feed the trial balance (loans, prepaid, inventory, LOC).",
    skill: "Double-entry · cash now or later",
    weeks: "Week 1–2",
    style: "neon",
    featured: true,
  },
  {
    id: "category-blitz",
    title: "Category Blitz",
    icon: "🗂️",
    tagline: "Sort everyday types — then finer buckets",
    description:
      "Week 1: five big buckets. Week 2 (?week=2): fixed vs current assets, long-term vs current liabilities, income, expense, equity.",
    skill: "Account types · trial balance buckets",
    weeks: "Week 1–2",
    style: "8bit",
  },
  {
    id: "balance-entry",
    title: "Balance the Entry",
    icon: "⚖️",
    tagline: "Make debits equal credits",
    description:
      "Week 1 GST entries; Week 2 sell/spend and loan/prepaid lines — the same skill that keeps a trial balance in balance.",
    skill: "Journal balancing · trial balance",
    weeks: "Week 1–2",
    style: "paper",
  },
  {
    id: "cash-flow-snap",
    title: "Cash Flow Snap",
    icon: "💰",
    tagline: "Does cash go up, down, or stay?",
    description:
      "Week 1: why books matter. Week 2: spending & selling with immediate funds vs no immediate funds.",
    skill: "Cash health · immediate vs later",
    weeks: "Week 1–2",
    style: "cash",
  },
  {
    id: "statement-sorter",
    title: "Statement Sorter",
    icon: "📋",
    tagline: "P&L or Balance Sheet?",
    description:
      "Week 3: sort Trial Balance accounts onto the two wealth statements — Profit & Loss (period) vs Balance Sheet (today).",
    skill: "Financial statements · TB → reports",
    weeks: "Week 3",
    style: "3d",
    featured: true,
  },
  {
    id: "equation-hero",
    title: "Equation Hero",
    icon: "🧮",
    tagline: "Solve A = L + E",
    description:
      "Prove the Balance Sheet: Assets always equal Liabilities plus Equity — using sample statement totals.",
    skill: "Accounting equation · Balance Sheet",
    weeks: "Week 3",
    style: "equation",
  },
  {
    id: "report-reader",
    title: "Report Reader",
    icon: "🔍",
    tagline: "Insights → Decisions",
    description:
      "Read P&L shape (gross profit, net income) and Balance Sheet cash signals — then choose the smart owner decision.",
    skill: "Insights → Decisions",
    weeks: "Week 3",
    style: "detective",
  },
  {
    id: "year-end-prep",
    title: "Year-End Prep",
    icon: "🎯",
    tagline: "Journals #1–#3 then handoff",
    description:
      "Week 4: depreciation ($14,500), home office ($3,585), mileage ($15,600) — then handover to accountants for tax prep.",
    skill: "Year-end journals · tax handoff",
    weeks: "Week 4",
    style: "boss",
  },
];

export function getArcadeGame(id: string): ArcadeGame | undefined {
  return ARCADE_GAMES.find((game) => game.id === id);
}
