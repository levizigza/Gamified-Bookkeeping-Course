import Link from "next/link";
import { VisualBanner } from "@/components/visuals/VisualBanner";

type GameCard = {
  id: string;
  title: string;
  icon: string;
  description: string;
  weeks: string;
  color: string;
  href: string;
};

const WEEK1_GAMES: GameCard[] = [
  {
    id: "debit-credit",
    title: "Debit or Credit?",
    icon: "⚡",
    description:
      "Choose the debit and credit sides for everyday spending, including meals, travel, supplies, and GST.",
    weeks: "Week 1",
    color: "border-blue-200 hover:border-blue-400",
    href: "/games/debit-credit?week=1",
  },
  {
    id: "category-blitz",
    title: "Category Blitz",
    icon: "🗂️",
    description:
      "Put meals, travel, office costs, supplies, and equipment into the correct account every time.",
    weeks: "Week 1",
    color: "border-purple-200 hover:border-purple-400",
    href: "/games/category-blitz?week=1",
  },
  {
    id: "balance-entry",
    title: "Balance the Entry",
    icon: "⚖️",
    description: "Double-entry + GST: taxi and Home Depot-style entries so debits equal credits.",
    weeks: "Week 1",
    color: "border-amber-200 hover:border-amber-400",
    href: "/games/balance-entry?week=1",
  },
  {
    id: "cash-flow-snap",
    title: "Cash Flow Snap",
    icon: "💰",
    description: "Decide whether each transaction makes cash go up, go down, or stay the same.",
    weeks: "Week 1",
    color: "border-green-200 hover:border-green-400",
    href: "/games/cash-flow-snap?week=1",
  },
];

const WEEK2_GAMES: GameCard[] = [
  {
    id: "category-blitz-w2",
    title: "Account Sorter Blitz",
    icon: "🗂️",
    description:
      "Fixed vs current assets, long-term vs current liabilities, income, expense, and equity.",
    weeks: "Week 2",
    color: "border-purple-200 hover:border-purple-400",
    href: "/games/category-blitz?week=2",
  },
  {
    id: "cash-flow-snap-w2",
    title: "Cash Flow Snap",
    icon: "💰",
    description:
      "Decide whether money moves now or later through cash, customer invoices, or credit cards.",
    weeks: "Week 2",
    color: "border-green-200 hover:border-green-400",
    href: "/games/cash-flow-snap?week=2",
  },
  {
    id: "balance-entry-w2",
    title: "Balance the Entry",
    icon: "⚖️",
    description:
      "Month-end trial balance skills: sell/spend entries that keep debits equal to credits.",
    weeks: "Week 2",
    color: "border-amber-200 hover:border-amber-400",
    href: "/games/balance-entry?week=2",
  },
  {
    id: "debit-credit-w2",
    title: "Debit or Credit?",
    icon: "⚡",
    description:
      "Choose debit or credit for loans, prepaid costs, inventory, furniture, and a line of credit.",
    weeks: "Week 2",
    color: "border-blue-200 hover:border-blue-400",
    href: "/games/debit-credit?week=2",
  },
  {
    id: "account-sorter",
    title: "Account Sorter Challenge",
    icon: "🎯",
    description:
      "Full Week 2 challenge: score 80%+ sorting Building, Vehicle, LOC, Mortgage, and more.",
    weeks: "Week 2",
    color: "border-indigo-200 hover:border-indigo-400",
    href: "/challenges/challenge-sort-accounts",
  },
];

const WEEK3_GAMES: GameCard[] = [
  {
    id: "statement-sorter",
    title: "Statement Sorter",
    icon: "📋",
    description:
      "Sort each account into the Profit & Loss report or the Balance Sheet.",
    weeks: "Week 3",
    color: "border-violet-200 hover:border-violet-400",
    href: "/games/statement-sorter",
  },
  {
    id: "equation-hero",
    title: "Equation Hero",
    icon: "🧮",
    description:
      "Assets = Liabilities + Equity — prove the Balance Sheet with sample statement totals.",
    weeks: "Week 3",
    color: "border-teal-200 hover:border-teal-400",
    href: "/games/equation-hero",
  },
  {
    id: "report-reader",
    title: "Report Reader",
    icon: "🔍",
    description:
      "Read gross profit, net income, cash, and customer invoices, then choose a sensible business decision.",
    weeks: "Week 3",
    color: "border-indigo-200 hover:border-indigo-400",
    href: "/games/report-reader",
  },
  {
    id: "insight-detective",
    title: "Insight Detective",
    icon: "🕵️",
    description:
      "Full Reports Room challenge: read Bright Path’s June statements and decide like an owner.",
    weeks: "Week 3",
    color: "border-fuchsia-200 hover:border-fuchsia-400",
    href: "/challenges/challenge-insight-detective",
  },
  {
    id: "reports-room",
    title: "Reports Room",
    icon: "📊",
    description:
      "Read the Trial Balance, Profit & Loss, and Balance Sheet using Bright Path’s June numbers.",
    weeks: "Week 3",
    color: "border-sky-200 hover:border-sky-400",
    href: "/reports",
  },
];

const WEEK4_GAMES: GameCard[] = [
  {
    id: "year-end-prep",
    title: "Year-End Prep",
    icon: "🎯",
    description:
      "Drill Journals #1–#3: depreciation $14,500, home office $3,585, mileage $15,600 — then handoff.",
    weeks: "Week 4",
    color: "border-rose-200 hover:border-rose-400",
    href: "/games/year-end-prep",
  },
  {
    id: "year-end-boss",
    title: "Year-End Boss Fight",
    icon: "⚔️",
    description:
      "Calculate and post the three year-end journals, then unlock accountant-ready status.",
    weeks: "Week 4",
    color: "border-orange-200 hover:border-orange-400",
    href: "/challenges/challenge-year-end-boss",
  },
  {
    id: "year-end-calculators",
    title: "Year-End Calculators",
    icon: "🧮",
    description:
      "Calculate depreciation, the business-use percentage for a home office, and a tiered mileage claim.",
    weeks: "Week 4",
    color: "border-amber-200 hover:border-amber-400",
    href: "/tools#calculators",
  },
];

const WEEK_GROUPS = [
  { label: "Week 1 — Why bookkeeping matters, double-entry, and sales tax", games: WEEK1_GAMES },
  { label: "Week 2 — Trial Balance and account types", games: WEEK2_GAMES },
  {
    label: "Week 3 — From transactions to reports and business decisions",
    games: WEEK3_GAMES,
  },
  {
    label: "Week 4 — Year-end journals and the accountant handoff",
    games: WEEK4_GAMES,
  },
];

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/board" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to game board
        </Link>
      </nav>

      <VisualBanner
        variant="arcade"
        eyebrow="Practice games"
        title="Choose a skill to practise."
        description="All practice games are open for review. On the board, only your unlocked week’s key stars count toward progression."
      />
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/games/arcade"
          className="inline-flex flex-1 items-center gap-3 rounded-2xl border-2 border-ledger-800 bg-gradient-to-r from-ledger-900 to-ledger-800 px-5 py-4 font-semibold text-white shadow-lg transition hover:shadow-glow-ledger animate-fade-in-up"
        >
          <span className="text-2xl">🕹️</span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Play several games
            </span>
            Open the Side Arcade
          </span>
        </Link>
        <Link
          href="/games/arena"
          className="inline-flex flex-1 items-center gap-2 rounded-xl border-2 border-gold-400/50 bg-gradient-to-r from-gold-400/15 to-gold-500/10 px-5 py-3 font-semibold text-ledger-800 transition hover:border-gold-400 hover:shadow-glow-gold animate-fade-in-up"
        >
          <span className="text-xl">🏟️</span>
          Classroom quiz race against computer players
        </Link>
      </div>

      {WEEK_GROUPS.map((group) => (
        <section key={group.label} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ledger-400">
            {group.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.games.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className={`card-surface-interactive flex items-start gap-4 p-5 text-left transition-all hover:shadow-lg ${game.color}`}
              >
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-ledger-900">{game.title}</h3>
                  <p className="mt-1 text-sm text-ledger-600">{game.description}</p>
                  <p className="mt-2 text-xs font-medium text-ledger-400">{game.weeks}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
