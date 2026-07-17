import Link from "next/link";
import { DashboardProgress } from "@/components/dashboard/DashboardProgress";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { getMockGamificationProgress } from "@/lib/game/mockProgress";
import { fetchDailyQuote } from "@/lib/api/quotes";
import { VisualBanner } from "@/components/visuals/VisualBanner";

export const metadata = {
  title: "Dashboard — Ledger Quest",
};

export default async function DashboardPage() {
  const progress = getMockGamificationProgress();
  const quote = await fetchDailyQuote();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <VisualBanner
        variant="ledger"
        eyebrow="Your learning progress"
        title="See what you finished and what comes next."
        description="Continue the board, review your challenge scores, and choose extra practice when you need it."
      />
      <Link
        href="/board"
        className="mb-6 flex items-center justify-between gap-4 rounded-3xl border-2 border-gold-400/50 bg-gradient-to-r from-ledger-950 via-ledger-900 to-ledger-800 p-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-glow-gold"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-3xl text-ledger-950">
            🎲
          </span>
          <span>
            <strong className="block text-xl">Continue the board race</strong>
            <span className="mt-1 block text-sm text-ledger-300">
              Roll, complete your next mission, and unlock all four weeks.
            </span>
          </span>
        </span>
        <span className="hidden rounded-xl bg-white/10 px-4 py-2 font-bold text-gold-400 sm:block">
          Play →
        </span>
      </Link>
      <DailyQuote serverQuote={quote} />
      <DashboardProgress initialProgress={progress} />
    </div>
  );
}
