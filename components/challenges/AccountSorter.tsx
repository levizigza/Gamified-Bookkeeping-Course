"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type {
  AccountSorterChallenge,
  SortCategory,
  SortableAccount,
} from "@/lib/data/week2Challenges";
import {
  REPORTS_ROOM_MASTERY_THRESHOLD,
  SORT_CATEGORIES,
  SORT_CATEGORY_LABELS,
} from "@/lib/data/week2Challenges";
import {
  saveAccountSorterBestStreak,
  saveAccountSorterMastery,
} from "@/lib/data/progress-storage";
import {
  buildSortSessionResult,
  gradeSortAnswer,
  type SortAttempt,
  updateStreak,
} from "@/lib/game/accountSorterScoring";
import { ProgressBar } from "@/components/game/ProgressBar";
import { XpReward } from "@/components/game/XpReward";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ChallengeCompletePanel } from "@/components/game/ChallengeCompletePanel";
import { Alert } from "@/components/ui/Alert";
import { RemediationFeedback } from "@/components/game/RemediationFeedback";

type AccountSorterProps = {
  challenge: AccountSorterChallenge;
};

type Phase = "sort" | "feedback" | "summary";

export function AccountSorter({ challenge }: AccountSorterProps) {
  const items = challenge.items;
  const total = items.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("sort");
  const [attempts, setAttempts] = useState<SortAttempt[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [itemAttempts, setItemAttempts] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    message: string;
    xpEarned: number;
    streakBonus: number;
  } | null>(null);
  const [showXp, setShowXp] = useState(false);

  const currentItem = items[currentIndex];
  const sortedCount = attempts.filter((a) => a.firstTry).length;

  const handleCategorySelect = useCallback(
    (category: SortCategory) => {
      if (!currentItem || phase !== "sort") return;

      const correct = gradeSortAnswer(category, currentItem.correctCategory);
      const isFirstTry = itemAttempts === 0;

      if (isFirstTry) {
        setAttempts((prev) => [
          ...prev,
          {
            itemId: currentItem.id,
            selectedCategory: category,
            correct,
            firstTry: true,
          },
        ]);
      }

      const streakUpdate = updateStreak(correct, currentStreak, longestStreak);
      setCurrentStreak(streakUpdate.currentStreak);
      setLongestStreak(streakUpdate.longestStreak);

      let xpEarned = 0;
      let streakBonus = 0;

      if (correct) {
        xpEarned = currentItem.baseXp;
        if (
          streakUpdate.currentStreak >= challenge.streakStartsAt &&
          isFirstTry
        ) {
          streakBonus = challenge.streakBonusXp;
          xpEarned += streakBonus;
        }
        setShowXp(true);
      }

      setLastFeedback({
        correct,
        message: correct
          ? currentItem.correctFeedback
          : currentItem.incorrectFeedback,
        xpEarned,
        streakBonus,
      });
      setPhase("feedback");
      setItemAttempts((n) => n + 1);
    },
    [
      currentItem,
      phase,
      itemAttempts,
      currentStreak,
      longestStreak,
      challenge.streakBonusXp,
      challenge.streakStartsAt,
    ],
  );

  const handleContinue = () => {
    if (lastFeedback?.correct || itemAttempts > 1) {
      if (currentIndex + 1 >= total) {
        finishChallenge();
        return;
      }
      setCurrentIndex((i) => i + 1);
      setItemAttempts(0);
      setLastFeedback(null);
      setPhase("sort");
      return;
    }
    setLastFeedback(null);
    setPhase("sort");
  };

  const finishChallenge = () => {
    const result = buildSortSessionResult(
      attempts,
      challenge.items[0]?.baseXp ?? 10,
      challenge.streakStartsAt,
      challenge.streakBonusXp,
      longestStreak,
    );
    saveAccountSorterMastery(result.masteryPercent);
    saveAccountSorterBestStreak(longestStreak);
    setPhase("summary");
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAttempts([]);
    setCurrentStreak(0);
    setLongestStreak(0);
    setItemAttempts(0);
    setLastFeedback(null);
    setPhase("sort");
  };

  if (phase === "summary") {
    const result = buildSortSessionResult(
      attempts,
      challenge.items[0]?.baseXp ?? 10,
      challenge.streakStartsAt,
      challenge.streakBonusXp,
      longestStreak,
    );

    return (
      <ChallengeCompletePanel
        eyebrow="Module complete"
        title="Account Sorter — Results"
        passed={result.reportsRoomUnlocked}
        subtitle={`${result.correctCount} of ${result.totalCount} correct · Longest streak: ${result.longestStreak}${
          result.streakBonusXp > 0 ? ` · Streak bonus: +${result.streakBonusXp} XP` : ""
        }`}
        stats={[
          { label: "XP earned", value: `+${result.totalXp}`, highlight: true },
          { label: "Mastery (first try)", value: `${result.masteryPercent}%` },
          {
            label: "Unlock gate",
            value: result.reportsRoomUnlocked ? "Passed" : `${REPORTS_ROOM_MASTERY_THRESHOLD}%`,
          },
        ]}
        actions={
          <>
            {result.masteryPercent < REPORTS_ROOM_MASTERY_THRESHOLD && (
              <Button onClick={handleRetry} size="lg">
                Try again
              </Button>
            )}
            {result.reportsRoomUnlocked && (
              <Link href="/lessons/lesson-profit-loss">
                <Button size="lg">Start Week 3</Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </>
        }
      >
        {result.reportsRoomUnlocked ? (
          <Alert variant="success" title="Reports Room unlocked">
            You scored {result.masteryPercent}% — above the {REPORTS_ROOM_MASTERY_THRESHOLD}%
            mastery gate. Week 3 is now open on your dashboard.
          </Alert>
        ) : (
          <Alert variant="warning" title="Keep practicing">
            Score at least {REPORTS_ROOM_MASTERY_THRESHOLD}% on your first try to unlock the
            Reports Room. You scored {result.masteryPercent}%.
          </Alert>
        )}
      </ChallengeCompletePanel>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="space-y-6">
      <XpReward amount={lastFeedback?.xpEarned ?? 0} show={showXp} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProgressBar
          current={sortedCount}
          total={total}
          label="Accounts sorted"
        />
        {currentStreak > 0 && (
          <div
            className="flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-1 text-sm font-semibold text-gold-600"
            aria-live="polite"
          >
            <span aria-hidden="true">🔥</span>
            Streak: {currentStreak}
            {currentStreak >= challenge.streakStartsAt && (
              <span className="text-xs font-normal">(+{challenge.streakBonusXp} XP)</span>
            )}
          </div>
        )}
      </div>

      {phase === "sort" && (
        <>
          <Card className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
              Sort this account
            </p>
            <CardTitle className="mt-2 text-2xl sm:text-3xl">
              {currentItem.name}
            </CardTitle>
            <CardDescription className="mt-2">
              Tap the category where this account belongs
            </CardDescription>
          </Card>

          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            role="group"
            aria-label="Account categories"
          >
            {SORT_CATEGORIES.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                label={SORT_CATEGORY_LABELS[category]}
                onSelect={() => handleCategorySelect(category)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-ledger-500">
            Keyboard: focus a category button and press Enter
          </p>
        </>
      )}

      {phase === "feedback" && lastFeedback && (
        <FeedbackCard
          item={currentItem}
          feedback={lastFeedback}
          streak={currentStreak}
          onContinue={handleContinue}
          isLast={currentIndex + 1 >= total}
          canRetry={!lastFeedback.correct}
        />
      )}
    </div>
  );
}

type CategoryButtonProps = {
  category: SortCategory;
  label: string;
  onSelect: () => void;
};

function CategoryButton({ category, label, onSelect }: CategoryButtonProps) {
  const colorMap: Record<SortCategory, string> = {
    current_asset: "hover:border-blue-400 hover:bg-blue-50",
    fixed_asset: "hover:border-indigo-400 hover:bg-indigo-50",
    current_liability: "hover:border-orange-400 hover:bg-orange-50",
    long_term_liability: "hover:border-amber-400 hover:bg-amber-50",
    revenue: "hover:border-ledger-500 hover:bg-ledger-50",
    expense: "hover:border-red-300 hover:bg-red-50",
    equity: "hover:border-purple-400 hover:bg-purple-50",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border-2 border-ledger-200 bg-white px-3 py-4 text-sm font-medium text-ledger-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ledger-500 ${colorMap[category]}`}
    >
      {label}
    </button>
  );
}

type FeedbackCardProps = {
  item: SortableAccount;
  feedback: {
    correct: boolean;
    message: string;
    xpEarned: number;
    streakBonus: number;
  };
  streak: number;
  onContinue: () => void;
  isLast: boolean;
  canRetry: boolean;
};

function FeedbackCard({
  item,
  feedback,
  streak,
  onContinue,
  isLast,
  canRetry,
}: FeedbackCardProps) {
  if (!feedback.correct) {
    return (
      <RemediationFeedback
        weakAreaId="account_category_confusion"
        detail={`Correct category: ${SORT_CATEGORY_LABELS[item.correctCategory]}. ${feedback.message}`}
        onRetry={onContinue}
        continueLabel="Try again"
      />
    );
  }

  return (
    <Card
      className={
        feedback.correct
          ? "border-ledger-400 bg-ledger-50"
          : "border-amber-300 bg-amber-50/50"
      }
    >
      <p
        className={`text-lg font-bold ${feedback.correct ? "text-ledger-700" : "text-amber-800"}`}
        role="status"
      >
        {feedback.correct ? "Correct!" : "Not quite"}
        {feedback.correct && feedback.xpEarned > 0 && (
          <span className="ml-2 text-gold-600">+{feedback.xpEarned} XP</span>
        )}
      </p>

      {!feedback.correct && (
        <p className="mt-1 text-sm text-amber-700">
          Correct category:{" "}
          <strong>{SORT_CATEGORY_LABELS[item.correctCategory]}</strong>
        </p>
      )}

      {feedback.streakBonus > 0 && (
        <p className="mt-2 text-sm font-medium text-gold-600">
          Streak bonus! {streak} in a row — +{feedback.streakBonus} XP
        </p>
      )}

      <p className="mt-4 text-sm leading-relaxed text-ledger-700">
        {feedback.message}
      </p>

      <Button onClick={onContinue} className="mt-6" size="lg">
        {canRetry
          ? "Try Again"
          : isLast
            ? "See Results"
            : "Next Account"}
      </Button>
    </Card>
  );
}
