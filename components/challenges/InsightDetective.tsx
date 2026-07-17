"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { InsightDetectiveChallenge } from "@/lib/data/week3Challenges";
import {
  saveInsightDetectiveBestScore,
  saveInsightDetectiveBadgeEarned,
} from "@/lib/data/progress-storage";
import {
  buildInsightSessionResult,
  gradeNumericAnswer,
  gradeOptionAnswer,
  type InsightAttempt,
  type InsightSessionResult,
} from "@/lib/game/insightDetectiveScoring";
import { InsightDetectiveReportsPanel } from "@/components/challenges/InsightDetectiveReportsPanel";
import { ProgressBar } from "@/components/game/ProgressBar";
import { XpReward } from "@/components/game/XpReward";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { classifyMistake } from "@/lib/game/remediation";
import { RemediationFeedback } from "@/components/game/RemediationFeedback";
import { ChallengeCompletePanel } from "@/components/game/ChallengeCompletePanel";
import { Alert } from "@/components/ui/Alert";

type InsightDetectiveProps = {
  challenge: InsightDetectiveChallenge;
};

type Phase = "question" | "feedback" | "summary";

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Multiple choice",
  numeric: "Numeric answer",
  select_report: "Select the report",
  identify_account: "Identify the account",
  business_decision: "Business decision",
};

export function InsightDetective({ challenge }: InsightDetectiveProps) {
  const questions = challenge.questions;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [attempts, setAttempts] = useState<InsightAttempt[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [numericInput, setNumericInput] = useState("");
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    message: string;
    xpEarned: number;
  } | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [summaryResult, setSummaryResult] = useState<InsightSessionResult | null>(null);
  const attemptsRef = useRef<InsightAttempt[]>([]);

  const currentQuestion = questions[currentIndex];

  const resetAnswerState = useCallback(() => {
    setSelectedOptionId("");
    setNumericInput("");
  }, []);

  const gradeCurrentAnswer = useCallback((): boolean => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === "numeric") {
      return gradeNumericAnswer(
        numericInput,
        currentQuestion.correctNumericCents ?? 0,
      );
    }

    return gradeOptionAnswer(
      selectedOptionId,
      currentQuestion.correctOptionId ?? "",
    );
  }, [currentQuestion, numericInput, selectedOptionId]);

  const canSubmit =
    currentQuestion?.type === "numeric"
      ? numericInput.trim().length > 0
      : selectedOptionId.length > 0;

  const handleSubmit = () => {
    if (!currentQuestion || !canSubmit) return;

    const correct = gradeCurrentAnswer();
    const isFirstTry = questionAttempts === 0;
    const nextAttempt = questionAttempts + 1;
    setQuestionAttempts(nextAttempt);

    let nextAttempts = attempts;
    if (correct) {
      const alreadyRecorded = attempts.some((a) => a.questionId === currentQuestion.id);
      if (!alreadyRecorded) {
        nextAttempts = [
          ...attempts,
          {
            questionId: currentQuestion.id,
            correct: true,
            firstTry: isFirstTry,
          },
        ];
        setAttempts(nextAttempts);
        attemptsRef.current = nextAttempts;
      }
    }

    let xpEarned = 0;
    if (correct) {
      xpEarned = isFirstTry ? currentQuestion.baseXp : Math.round(currentQuestion.baseXp / 2);
      setSessionXp((s) => s + xpEarned);
      setShowXp(true);
    }

    setLastFeedback({
      correct,
      message: correct
        ? currentQuestion.correctFeedback
        : currentQuestion.incorrectFeedback,
      xpEarned,
    });
    setPhase("feedback");
  };

  const completeChallenge = (finalAttempts: InsightAttempt[]) => {
    const result = buildInsightSessionResult(
      finalAttempts,
      questions[0]?.baseXp ?? 15,
    );
    setSummaryResult(result);
    saveInsightDetectiveBestScore(result.scorePercent);
    if (result.badgeEarned) {
      saveInsightDetectiveBadgeEarned();
    }
    setPhase("summary");
  };

  const handleContinue = () => {
    if (!lastFeedback?.correct) {
      setLastFeedback(null);
      setPhase("question");
      return;
    }

    if (currentIndex + 1 >= total) {
      completeChallenge(attemptsRef.current);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setQuestionAttempts(0);
    setLastFeedback(null);
    resetAnswerState();
    setPhase("question");
  };

  const handleRetryChallenge = () => {
    setCurrentIndex(0);
    setPhase("question");
    setAttempts([]);
    attemptsRef.current = [];
    setQuestionAttempts(0);
    setLastFeedback(null);
    resetAnswerState();
    setSessionXp(0);
    setSummaryResult(null);
  };

  useEffect(() => {
    if (currentQuestion) {
      resetAnswerState();
    }
  }, [currentIndex, currentQuestion, resetAnswerState]);

  if (phase === "summary" && summaryResult) {
    const result = summaryResult;

    return (
      <ChallengeCompletePanel
        eyebrow="Challenge complete"
        title="Insight Detective — Results"
        passed={result.badgeEarned}
        subtitle={`${result.firstTryCorrect} of ${result.totalCount} correct on the first try`}
        stats={[
          { label: "XP earned", value: `+${sessionXp}`, highlight: true },
          { label: "First-try score", value: `${result.scorePercent}%` },
          {
            label: "Badge",
            value: result.badgeEarned ? "Earned" : "Locked",
            highlight: result.badgeEarned,
          },
        ]}
        actions={
          <>
            <Button onClick={handleRetryChallenge}>Try again</Button>
            <Link href="/reports">
              <Button variant="outline">Open Reports Room</Button>
            </Link>
          </>
        }
      >
        {result.badgeEarned ? (
          <Alert variant="success" title={`Badge earned: ${challenge.badgeName}`}>
            You scored {result.scorePercent}% — at or above the {challenge.passThresholdPercent}%
            threshold. You read the reports like a business owner.
          </Alert>
        ) : (
          <Alert variant="warning" title="Badge not earned yet">
            Score {challenge.passThresholdPercent}% or higher on your first try to earn the{" "}
            {challenge.badgeName} badge. Review the reports and try again.
          </Alert>
        )}
      </ChallengeCompletePanel>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ledger-500">
            Question {currentIndex + 1} of {total}
          </p>
          <ProgressBar
            current={currentIndex}
            total={total}
            label="Challenge progress"
            className="mt-2"
          />
        </div>
        <p className="text-sm font-medium text-gold-600">Session XP: +{sessionXp}</p>
      </div>

      <InsightDetectiveReportsPanel suggestedReport={currentQuestion.suggestedReport} />

      <Card padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
          {TYPE_LABELS[currentQuestion.type] ?? currentQuestion.type}
        </p>
        <CardTitle className="mt-2 text-xl">{currentQuestion.prompt}</CardTitle>
        <CardDescription className="mt-2">{currentQuestion.hint}</CardDescription>

        {phase === "question" && (
          <div className="mt-6">
            {currentQuestion.type === "numeric" ? (
              <label className="block">
                <span className="sr-only">Your answer in dollars</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={numericInput}
                  onChange={(e) => setNumericInput(e.target.value)}
                  placeholder="e.g. 5758"
                  className="w-full max-w-xs rounded-xl border border-ledger-300 px-4 py-3 text-lg tabular-nums text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-200"
                />
              </label>
            ) : (
              <fieldset>
                <legend className="sr-only">Choose an answer</legend>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {currentQuestion.options?.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                          selectedOptionId === option.id
                            ? "border-ledger-600 bg-ledger-600 text-white"
                            : "border-ledger-200 bg-white text-ledger-800 hover:border-ledger-400 hover:bg-ledger-50"
                        }`}
                        aria-pressed={selectedOptionId === option.id}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            <div className="mt-6">
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                Check answer
              </Button>
            </div>
          </div>
        )}

        {phase === "feedback" && lastFeedback && !lastFeedback.correct && (
          <RemediationFeedback
            weakAreaId={classifyMistake({
              challengeId: challenge.id,
              questionType: currentQuestion.type,
            })}
            detail={lastFeedback.message}
            onRetry={handleContinue}
            continueLabel="Try again"
          />
        )}

        {phase === "feedback" && lastFeedback && lastFeedback.correct && (
          <div
            className="mt-6 rounded-xl border border-ledger-300 bg-ledger-50 p-4"
            role="status"
          >
            <p className="font-semibold text-ledger-800">Correct</p>
            <p className="mt-2 text-sm leading-relaxed text-ledger-700">
              {lastFeedback.message}
            </p>
            {lastFeedback.xpEarned > 0 && (
              <p className="mt-2 text-sm font-medium text-gold-600">
                +{lastFeedback.xpEarned} XP
                {questionAttempts > 1 && " (retry bonus halved)"}
              </p>
            )}
            <div className="mt-4">
              <Button onClick={handleContinue}>
                {currentIndex + 1 >= total ? "View results" : "Next question"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {showXp && lastFeedback?.xpEarned ? (
        <XpReward amount={lastFeedback.xpEarned} show={showXp} />
      ) : null}
    </div>
  );
}
