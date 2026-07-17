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
    description: "A timed reflex game that builds instinct for which side of the journal each account belongs on.",
    skill: "Double-entry foundations",
    weeks: "Week 1–4",
    style: "neon",
    featured: true,
  },
  {
    id: "category-blitz",
    title: "Category Blitz",
    icon: "🗂️",
    tagline: "Sort accounts into the five buckets",
    description: "Kinesthetic sorting into Asset, Liability, Equity, Income, and Expense—fast pattern recognition.",
    skill: "Account classification",
    weeks: "Week 1–4",
    style: "8bit",
  },
  {
    id: "balance-entry",
    title: "Balance the Entry",
    icon: "⚖️",
    tagline: "Make debits equal credits",
    description: "Fill the missing amount so the journal entry balances—hands-on double-entry practice.",
    skill: "Journal balancing",
    weeks: "Week 1–4",
    style: "paper",
  },
  {
    id: "cash-flow-snap",
    title: "Cash Flow Snap",
    icon: "💰",
    tagline: "Does cash go up, down, or stay?",
    description: "Instant decisions about how everyday transactions move cash—no formulas, just business sense.",
    skill: "Cash impact",
    weeks: "Week 1–4",
    style: "cash",
  },
  {
    id: "statement-sorter",
    title: "Statement Sorter",
    icon: "📋",
    tagline: "P&L or Balance Sheet?",
    description: "Drag and place accounts onto the right financial statement—visual statement literacy.",
    skill: "Financial statements",
    weeks: "Week 3",
    style: "3d",
    featured: true,
  },
  {
    id: "equation-hero",
    title: "Equation Hero",
    icon: "🧮",
    tagline: "Solve A = L + E",
    description: "Find the missing piece of the accounting equation—Assets always equal Liabilities plus Equity.",
    skill: "Accounting equation",
    weeks: "Week 3",
    style: "equation",
  },
  {
    id: "report-reader",
    title: "Report Reader",
    icon: "🔍",
    tagline: "Read the story in the numbers",
    description: "Interpret P&L and Balance Sheet signals and make smart owner decisions from the reports.",
    skill: "Business insights",
    weeks: "Week 3",
    style: "detective",
  },
  {
    id: "year-end-prep",
    title: "Year-End Prep",
    icon: "🎯",
    tagline: "Close the year with confidence",
    description: "Depreciation, home office, mileage, and accountant handoff—the Year-End Boss warm-up.",
    skill: "Year-end readiness",
    weeks: "Week 4",
    style: "boss",
  },
];

export function getArcadeGame(id: string): ArcadeGame | undefined {
  return ARCADE_GAMES.find((game) => game.id === id);
}
