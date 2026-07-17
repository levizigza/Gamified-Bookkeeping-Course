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
        eyebrow="Bright Path command centre"
        title="Turn today’s transactions into tomorrow’s confidence."
        description="Your ledger, streak, mastery, and next challenge—all organized in one living financial workspace."
      />
      <DailyQuote serverQuote={quote} />
      <DashboardProgress initialProgress={progress} />
    </div>
  );
}
