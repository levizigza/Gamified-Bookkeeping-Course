import Link from "next/link";
import { VisualBanner } from "@/components/visuals/VisualBanner";

const GAMES = [
  {
    id: "debit-credit",
    title: "Debit or Credit?",
    icon: "⚡",
    description: "Speed round — tap the correct side for each account. Build streaks!",
    weeks: "Week 1–4",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    id: "category-blitz",
    title: "Category Blitz",
    icon: "🗂️",
    description: "Sort accounts into Asset, Liability, Equity, Income, or Expense.",
    weeks: "Week 1–4",
    color: "border-purple-200 hover:border-purple-400",
  },
  {
    id: "balance-entry",
    title: "Balance the Entry",
    icon: "⚖️",
    description: "Fill in the missing amount to make debits equal credits.",
    weeks: "Week 1–4",
    color: "border-amber-200 hover:border-amber-400",
  },
  {
    id: "cash-flow-snap",
    title: "Cash Flow Snap",
    icon: "💰",
    description: "Does cash go up, down, or stay the same? Think fast!",
    weeks: "Week 1–4",
    color: "border-green-200 hover:border-green-400",
  },
  {
    id: "statement-sorter",
    title: "Statement Sorter",
    icon: "📋",
    description: "P&L or Balance Sheet? Sort each account to the right report.",
    weeks: "Week 3",
    color: "border-violet-200 hover:border-violet-400",
  },
  {
    id: "equation-hero",
    title: "Equation Hero",
    icon: "🧮",
    description: "Solve A = L + E — find the missing piece of the accounting equation.",
    weeks: "Week 3",
    color: "border-teal-200 hover:border-teal-400",
  },
  {
    id: "report-reader",
    title: "Report Reader",
    icon: "🔍",
    description: "Read financial statements and make smart business decisions.",
    weeks: "Week 3",
    color: "border-indigo-200 hover:border-indigo-400",
  },
  {
    id: "year-end-prep",
    title: "Year-End Prep",
    icon: "🎯",
    description: "Depreciation, home office, mileage, and accountant handoff.",
    weeks: "Week 4",
    color: "border-rose-200 hover:border-rose-400",
  },
];

const WEEK_GROUPS = [
  { label: "Weeks 1–4 — Core Drills", ids: ["debit-credit", "category-blitz", "balance-entry", "cash-flow-snap"] },
  { label: "Week 3 — Financial Statements", ids: ["statement-sorter", "equation-hero", "report-reader"] },
  { label: "Week 4 — Year-End Boss Fight", ids: ["year-end-prep"] },
];

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/dashboard" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to dashboard
        </Link>
      </nav>

      <VisualBanner
        variant="arcade"
        eyebrow="Practice Arcade"
        title="Accounting, but make it playable."
        description="Speed rounds, sorting challenges, report puzzles, and competitive Arena battles—each built around a real bookkeeping skill."
      />
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/games/arcade"
          className="inline-flex flex-1 items-center gap-3 rounded-2xl border-2 border-ledger-800 bg-gradient-to-r from-ledger-900 to-ledger-800 px-5 py-4 font-semibold text-white shadow-lg transition hover:shadow-glow-ledger animate-fade-in-up"
        >
          <span className="text-2xl">🕹️</span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Client showcase
            </span>
            Open Side Arcade — kinesthetic demos
          </span>
        </Link>
        <Link
          href="/games/arena"
          className="inline-flex flex-1 items-center gap-2 rounded-xl border-2 border-gold-400/50 bg-gradient-to-r from-gold-400/15 to-gold-500/10 px-5 py-3 font-semibold text-ledger-800 transition hover:border-gold-400 hover:shadow-glow-gold animate-fade-in-up"
        >
          <span className="text-xl">🏟️</span>
          Arena Mode — Kahoot vs AI bots
        </Link>
      </div>

      {WEEK_GROUPS.map((group) => (
        <section key={group.label} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ledger-400">
            {group.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.ids.map((id) => {
              const game = GAMES.find((g) => g.id === id)!;
              return (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className={`card-surface-interactive flex items-start gap-4 p-5 text-left transition-all hover:shadow-lg ${game.color}`}
                >
                  <span className="text-3xl">{game.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-ledger-900">{game.title}</h3>
                    <p className="mt-1 text-sm text-ledger-600">{game.description}</p>
                    <p className="mt-2 text-xs font-medium text-ledger-400">{game.weeks}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
