import Link from "next/link";
import { BadgeGrid } from "@/components/game/BadgeGrid";
import { MasteryCard, StreakCard, XpCard } from "@/components/game/StatCards";
import { ModuleMasteryPanel } from "@/components/dashboard/ModuleMasteryPanel";
import { WeakAreasPanel } from "@/components/dashboard/WeakAreasPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Alert } from "@/components/ui/Alert";
import { getWorlds } from "@/lib/data/mock-data";
import { getMockGamificationProgress } from "@/lib/game/mockProgress";
import { masteryLabel } from "@/lib/game/xp";
import { ReplayIntroButton } from "@/components/intro/ReplayIntroButton";
import { ConceptVisual } from "@/components/visuals/ConceptVisual";

export const metadata = {
  title: "Profile — Ledger Quest",
};

export default function ProfilePage() {
  const progress = getMockGamificationProgress();
  const worlds = getWorlds();
  const overallProgress = Math.round(
    progress.modules.reduce((sum, m) => sum + m.masteryPercent, 0) / progress.modules.length,
  );
  const courseComplete = overallProgress >= 80;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Your profile"
        description={`Track your progress learning bookkeeping for ${progress.businessName}.`}
        backHref="/dashboard"
        backLabel="Back to dashboard"
        className="mb-8"
      />

      <Card className="relative mb-8 overflow-hidden border-ledger-700 bg-gradient-to-br from-ledger-600 to-ledger-800 text-white">
        <div className="absolute -right-6 -top-10 h-44 w-52 opacity-35" aria-hidden="true">
          <ConceptVisual variant="profile" className="h-full w-full" />
        </div>
        <p className="relative text-sm text-ledger-200">Business owner</p>
        <h2 className="relative text-2xl font-bold">{progress.businessName}</h2>
        <p className="relative mt-2 text-ledger-100">
          Mastery level: {masteryLabel(progress.masteryPercent)} ({progress.masteryPercent}%)
        </p>
      </Card>

      {courseComplete && (
        <Alert variant="success" title="Course milestone reached" className="mb-8">
          <p>
            You have reached 80% overall mastery.{" "}
            <Link href="/certificate" className="font-semibold underline underline-offset-2">
              View your certificate
            </Link>
          </p>
        </Alert>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <XpCard
          xp={progress.totalXp}
          level={progress.level}
          xpInLevel={progress.xpInCurrentLevel}
          xpToNext={progress.xpToNextLevel}
        />
        <StreakCard days={progress.streakDays} answerStreak={progress.bestAnswerStreak} />
        <MasteryCard percent={progress.masteryPercent} />
      </div>

      <Card className="card-surface mb-8">
        <SectionHeader title="Course progress" description="Across all four worlds" />
        <ProgressBar value={overallProgress} label="Overall completion" />
        <ul className="mt-6 space-y-3">
          {worlds.map((world) => {
            const mod = progress.modules.find((m) => m.moduleId === world.id);
            return (
              <li key={world.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-ledger-700">
                  {world.icon} {world.name}
                </span>
                <span className="tabular-nums font-medium text-ledger-600">
                  {mod?.unlocked ? `${mod.masteryPercent}%` : "Locked"}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="mb-8">
        <SectionHeader title="Module mastery" className="mb-4" />
        <ModuleMasteryPanel modules={progress.modules} />
      </div>

      {progress.weakAreas.length > 0 && (
        <div className="mb-8">
          <SectionHeader title="Focus areas" className="mb-4" />
          <WeakAreasPanel weakAreas={progress.weakAreas} />
        </div>
      )}

      <div className="mb-8">
        <BadgeGrid badges={progress.badges} title="Your badges" />
      </div>

      <div className="flex flex-wrap gap-3">
        {courseComplete && (
          <Link href="/certificate">
            <Button>View certificate</Button>
          </Link>
        )}
        <ReplayIntroButton />
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
