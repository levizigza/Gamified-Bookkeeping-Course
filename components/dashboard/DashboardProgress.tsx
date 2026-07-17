"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getChallenges } from "@/lib/data/mock-data";
import type { UserProgress } from "@/lib/game/types";
import { buildUserProgress } from "@/lib/game/progress";
import { getRecommendedPractice } from "@/lib/game/remediation";
import type { RemediationWeakAreaId } from "@/lib/game/remediation";
import { MOCK_PROGRESS_INPUT } from "@/lib/game/mockProgress";
import { masteryLabel } from "@/lib/game/xp";
import { ModuleMasteryPanel } from "@/components/dashboard/ModuleMasteryPanel";
import { WeakAreasPanel } from "@/components/dashboard/WeakAreasPanel";
import { RecommendedPractice } from "@/components/dashboard/RecommendedPractice";
import { BadgeGrid } from "@/components/game/BadgeGrid";
import { NextChallengeCard } from "@/components/game/NextChallengeCard";
import { MasteryCard, StreakCard, XpCard } from "@/components/game/StatCards";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  getAccountSorterMastery,
  getInsightDetectiveBestScore,
  getYearEndBossEarnedBadgeIds,
  isInsightDetectiveBadgeEarned,
} from "@/lib/data/progress-storage";

type DashboardProgressProps = {
  initialProgress: UserProgress;
};

function getRecommendedChallenge(progress: UserProgress) {
  if (!progress.nextChallengeId) return undefined;
  return getChallenges().find((c) => c.id === progress.nextChallengeId);
}

function mergeLocalStorageIntoProgress(base: UserProgress): UserProgress {
  const sorterMastery = getAccountSorterMastery();
  const insightScore = getInsightDetectiveBestScore();
  const yearEndBadges = getYearEndBossEarnedBadgeIds();

  const extraAttempts = [...MOCK_PROGRESS_INPUT.attempts];

  if (sorterMastery > 0) {
    extraAttempts.push({
      id: "local-sorter",
      challengeId: "challenge-sort-accounts",
      moduleId: "account-sorter",
      attemptNumber: 1,
      correct: sorterMastery >= 80,
      firstTry: true,
      scorePercent: sorterMastery,
      xpEarned: Math.round((sorterMastery / 100) * 230),
      timestamp: new Date().toISOString(),
      weakTags: sorterMastery < 80 ? ["account_category_confusion"] : [],
    });
  }

  if (insightScore > 0) {
    extraAttempts.push({
      id: "local-insight",
      challengeId: "challenge-insight-detective",
      moduleId: "reports-room",
      attemptNumber: 1,
      correct: insightScore >= 80,
      firstTry: true,
      scorePercent: insightScore,
      xpEarned: Math.round((insightScore / 100) * 175),
      timestamp: new Date().toISOString(),
      weakTags: insightScore < 80 ? ["financial_statement_confusion"] : [],
    });
  }

  const earnedBadgeIds = [
    ...base.badges.filter((b) => b.earned).map((b) => b.id),
    ...(isInsightDetectiveBadgeEarned() ? ["insight-detective"] : []),
    ...yearEndBadges,
  ];

  const mergedAttempts = [
    ...base.attempts.filter(
      (a) =>
        !extraAttempts.some((e) => e.challengeId === a.challengeId && e.id.startsWith("local-")),
    ),
    ...extraAttempts.filter(
      (e) => !base.attempts.some((a) => a.challengeId === e.challengeId),
    ),
  ];

  return buildUserProgress({
    ...MOCK_PROGRESS_INPUT,
    attempts: mergedAttempts,
    streakDays: base.streakDays,
    bestAnswerStreak: base.bestAnswerStreak,
    earnedBadgeIds: [...new Set(earnedBadgeIds)],
    yearEndScenarioBadges: yearEndBadges,
    recentAchievements: base.recentAchievements,
    bonusXp: base.totalXp - mergedAttempts.reduce((s, a) => s + a.xpEarned, 0),
  });
}

export function DashboardProgress({ initialProgress }: DashboardProgressProps) {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    setProgress(mergeLocalStorageIntoProgress(initialProgress));
  }, [initialProgress]);

  const nextChallenge = getRecommendedChallenge(progress);
  const weakAreaIds = progress.attempts.flatMap((a) => a.weakTags) as RemediationWeakAreaId[];
  const recommendedPractice = getRecommendedPractice(weakAreaIds);

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow={progress.businessName}
        title="Dashboard"
        description={`${masteryLabel(progress.masteryPercent)} · ${progress.earnedBadgeCount} badges earned`}
        className="mb-8"
      />

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

      {nextChallenge && (
        <div className="mb-8">
          <NextChallengeCard challenge={nextChallenge} />
        </div>
      )}

      <section aria-labelledby="modules-heading" className="mb-8">
        <SectionHeader
          id="modules-heading"
          title="Key challenge scores"
          description="The board uses key stars to open each week. These percentages show how well you performed on its main challenges; 80% is the learning target."
          className="mb-4"
        />
        <ModuleMasteryPanel modules={progress.modules} />
      </section>

      {recommendedPractice && (
        <section aria-labelledby="recommended-practice-heading" className="mb-8">
          <h2 id="recommended-practice-heading" className="sr-only">
            Recommended practice
          </h2>
          <RecommendedPractice practice={recommendedPractice} />
        </section>
      )}

      {progress.weakAreas.length > 0 && (
        <section aria-labelledby="weak-areas-heading" className="mb-8">
          <SectionHeader id="weak-areas-heading" title="Focus areas" className="mb-4" />
          <WeakAreasPanel weakAreas={progress.weakAreas} />
        </section>
      )}

      <BadgeGrid
        badges={progress.badges}
        title="Badges"
        emptyMessage="Complete challenges to earn your first badge."
      />

      {progress.recentAchievements.length === 0 && (
        <EmptyState
          icon="📈"
          title="No recent activity"
          description="Complete a challenge to see your latest achievements here."
          action={
            nextChallenge ? (
              <Link href={`/challenges/${nextChallenge.id}`}>
                <Button>Start next challenge</Button>
              </Link>
            ) : undefined
          }
          className="mt-8"
        />
      )}

      {progress.recentAchievements.length > 0 && (
        <section aria-labelledby="activity-heading" className="mt-8">
          <SectionHeader id="activity-heading" title="Recent activity" className="mb-4" />
          <ul className="space-y-2">
            {progress.recentAchievements.slice(0, 5).map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-ledger-200 bg-white px-4 py-3 text-sm"
              >
                <p className="font-semibold text-ledger-900">{event.title}</p>
                <p className="text-ledger-600">{event.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/games/arcade"
          className="text-sm font-medium text-ledger-800 transition-colors hover:text-ledger-950"
        >
          Side Arcade showcase →
        </Link>
        <Link
          href="/profile"
          className="text-sm font-medium text-ledger-600 transition-colors hover:text-ledger-900"
        >
          View full profile →
        </Link>
        {progress.masteryPercent >= 80 && (
          <Link
            href="/certificate"
            className="text-sm font-medium text-ledger-600 transition-colors hover:text-ledger-900"
          >
            View certificate →
          </Link>
        )}
      </div>
    </div>
  );
}
