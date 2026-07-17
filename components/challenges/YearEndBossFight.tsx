"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { YearEndBossChallenge } from "@/lib/data/week4Challenges";
import {
  saveYearEndBossBadges,
  saveYearEndBossMastery,
  saveYearEndBossReadiness,
} from "@/lib/data/progress-storage";
import {
  createEmptyBuilderLine,
  parseDollarsToCents,
  type BuilderJournalLine,
} from "@/lib/game/journalScoring";
import {
  buildYearEndBossSessionResult,
  gradeYearEndBossSubmission,
  isScenarioBadgeEarned,
  type YearEndBossGradeResult,
  type YearEndBossSessionResult,
  type YearEndScenarioAttempt,
} from "@/lib/game/yearEndBossScoring";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { JournalEntryBuilder } from "@/components/challenges/JournalEntryBuilder";
import { ProgressBar } from "@/components/game/ProgressBar";
import { XpReward } from "@/components/game/XpReward";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { classifyMistake } from "@/lib/game/remediation";
import { RemediationFeedback } from "@/components/game/RemediationFeedback";
import { ChallengeCompletePanel } from "@/components/game/ChallengeCompletePanel";
import { Alert } from "@/components/ui/Alert";
import { markChallengeMissionComplete } from "@/lib/data/boardMissions";

type YearEndBossFightProps = {
  challenge: YearEndBossChallenge;
};

type Phase = "entry" | "feedback" | "summary";

const CHECKLIST_LABELS: Record<keyof YearEndBossSessionResult["checklist"], string> = {
  dailyTransactionsRecorded: "Daily transactions recorded",
  trialBalanceReviewed: "Trial balance reviewed",
  profitAndLossGenerated: "Profit & Loss generated",
  balanceSheetGenerated: "Balance Sheet generated",
  yearEndJournalsPrepared: "Year-end journals prepared",
  readyForAccountantHandover: "Ready for accountant handover",
};

export function YearEndBossFight({ challenge }: YearEndBossFightProps) {
  const scenarios = challenge.scenarios;
  const total = scenarios.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("entry");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [lines, setLines] = useState<BuilderJournalLine[]>([
    createEmptyBuilderLine(),
    createEmptyBuilderLine(),
  ]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [grade, setGrade] = useState<YearEndBossGradeResult | null>(null);
  const attemptsRef = useRef<YearEndScenarioAttempt[]>([]);
  const [sessionResult, setSessionResult] = useState<YearEndBossSessionResult | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [lastXp, setLastXp] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  const scenario = scenarios[currentIndex];

  const resetEntryState = useCallback(() => {
    setCalculatedAmount("");
    setLines([createEmptyBuilderLine(), createEmptyBuilderLine()]);
    setAttemptCount(0);
    setGrade(null);
  }, []);

  const canSubmit =
    phase === "entry" &&
    parseDollarsToCents(calculatedAmount) > 0 &&
    lines.filter((l) => l.accountId && l.amountCents > 0).length >= 2;

  const handleSubmit = () => {
    if (!scenario || !canSubmit) return;

    const userAmountCents = parseDollarsToCents(calculatedAmount);
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);

    const result = gradeYearEndBossSubmission(userAmountCents, lines, scenario);
    setGrade(result);
    setLastXp(result.xpBreakdown.total);
    setShowXp(true);
    setSessionXp((s) => s + result.xpBreakdown.total);
    setPhase("feedback");

    if (nextAttempt === 1) {
      const attemptRecord: YearEndScenarioAttempt = {
        scenarioId: scenario.id,
        kind: scenario.kind,
        firstTry: true,
        amountCorrect: result.amountCorrect,
        scorePercent: result.scorePercent,
        xpEarned: result.xpBreakdown.total,
        perfect: result.isPerfect,
        badgeEarned: isScenarioBadgeEarned(result.scorePercent),
        badgeId: scenario.badgeId,
      };
      const nextAttempts = [...attemptsRef.current, attemptRecord];
      attemptsRef.current = nextAttempts;
    }
  };

  const completeChallenge = (finalAttempts: YearEndScenarioAttempt[]) => {
    const result = buildYearEndBossSessionResult(finalAttempts);
    setSessionResult(result);
    saveYearEndBossMastery(result.masteryPercent);
    saveYearEndBossReadiness(result.readinessScore);
    saveYearEndBossBadges(result.badgesEarned);
    setPhase("summary");
  };

  const handleContinue = () => {
    if (!grade) return;

    const passed = grade.scorePercent >= challenge.passThresholdPercent;

    if (!passed) {
      setGrade(null);
      setPhase("entry");
      return;
    }

    if (currentIndex + 1 >= total) {
      completeChallenge(attemptsRef.current);
      return;
    }

    setCurrentIndex((i) => i + 1);
    resetEntryState();
    setPhase("entry");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setPhase("entry");
    resetEntryState();
    attemptsRef.current = [];
    setSessionResult(null);
    setSessionXp(0);
  };

  if (phase === "summary" && sessionResult) {
    const passed = sessionResult.masteryPercent >= challenge.passThresholdPercent;

    return (
      <ChallengeCompletePanel
        eyebrow="Final boss complete"
        title="Bookkeeping readiness"
        passed={passed}
        stats={[
          { label: "XP earned", value: `+${sessionXp}`, highlight: true },
          { label: "First-try mastery", value: `${sessionResult.masteryPercent}%` },
          { label: "Readiness score", value: `${sessionResult.readinessScore}%` },
        ]}
        actions={
          <>
            <Link
              href="/board"
              onClick={() => markChallengeMissionComplete("challenge-year-end-boss")}
            >
              <Button size="lg">Return to board & collect star</Button>
            </Link>
            {passed && (
              <Link href="/certificate">
                <Button variant="outline">View certificate</Button>
              </Link>
            )}
            <Link href="/tools#calculators">
              <Button variant="outline">Review calculators</Button>
            </Link>
            <Button onClick={handleRestart} variant="ghost">
              Fight again
            </Button>
          </>
        }
      >
        {sessionResult.badgesEarned.length > 0 && (
          <Alert variant="success" title="Badges earned">
            <ul className="mt-1 space-y-1">
              {sessionResult.badgesEarned.map((badgeId) => {
                const scenarioBadge = scenarios.find((s) => s.badgeId === badgeId);
                const label =
                  badgeId === "accountant-ready"
                    ? "Accountant Ready"
                    : scenarioBadge?.badgeName ?? badgeId;
                return <li key={badgeId}>🏅 {label}</li>;
              })}
            </ul>
          </Alert>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-ledger-900">Handoff checklist</h3>
          <ul className="mt-3 space-y-2">
            {(Object.keys(sessionResult.checklist) as Array<
              keyof YearEndBossSessionResult["checklist"]
            >).map((key) => {
              const done = sessionResult.checklist[key];
              return (
                <li
                  key={key}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    done ? "bg-ledger-50 text-ledger-800" : "bg-amber-50 text-amber-900"
                  }`}
                >
                  <span aria-hidden="true">{done ? "✓" : "○"}</span>
                  {CHECKLIST_LABELS[key]}
                </li>
              );
            })}
          </ul>
        </div>

        {!passed && (
          <Alert variant="warning" className="mt-4">
            Score {challenge.passThresholdPercent}% or higher on your first try across all three
            entries to earn Accountant Ready and mark handoff complete.
          </Alert>
        )}
      </ChallengeCompletePanel>
    );
  }

  if (!scenario) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ledger-500">
          Adjusting entry {currentIndex + 1} of {total}
        </p>
        <ProgressBar current={currentIndex} total={total} className="mt-2" />
        <p className="mt-2 text-sm font-medium text-gold-600">Session XP: +{sessionXp}</p>
      </div>

      <Card padding="lg" className="border-ledger-300 bg-gradient-to-br from-white to-ledger-50">
        <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
          Scenario
        </p>
        <CardTitle className="mt-1 text-xl">{scenario.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed text-ledger-700">
          {scenario.narrative}
        </CardDescription>
        <p className="mt-3 rounded-lg bg-ledger-100 px-3 py-2 text-xs text-ledger-600">
          {scenario.inputsSummary}
        </p>
      </Card>

      {phase === "entry" && (
        <>
          <Card padding="lg">
            <CardTitle className="text-lg">Step 1 — Calculate the amount</CardTitle>
            <p className="mt-2 text-sm text-ledger-600">{scenario.calculationPrompt}</p>
            <p className="mt-1 text-xs text-ledger-500">{scenario.calculationHint}</p>
            <label htmlFor="calculated-amount" className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ledger-700">
                Your calculated amount (CAD)
              </span>
              <input
                id="calculated-amount"
                type="text"
                inputMode="decimal"
                value={calculatedAmount}
                onChange={(e) => setCalculatedAmount(e.target.value)}
                placeholder="0.00"
                className="w-full max-w-xs rounded-xl border border-ledger-300 px-4 py-3 text-lg tabular-nums focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-200"
              />
            </label>
            <p className="mt-2 text-xs text-ledger-500">
              Need help? Try the{" "}
              <Link href="/calculators" className="font-medium text-ledger-700 underline">
                year-end calculators
              </Link>{" "}
              — then return here to post the entry.
            </p>
          </Card>

          <Card padding="lg">
            <CardTitle className="text-lg">Step 2 — Build the journal entry</CardTitle>
            <p className="mt-2 text-sm text-ledger-600">
              Post the adjusting entry using the amount you calculated. Debits must equal credits.
            </p>
            <div className="mt-4">
              <JournalEntryBuilder lines={lines} onChange={setLines} />
            </div>
            <div className="mt-6">
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                Submit entry
              </Button>
            </div>
          </Card>
        </>
      )}

      {phase === "feedback" && grade && grade.scorePercent < challenge.passThresholdPercent && (
        <RemediationFeedback
          weakAreaId={classifyMistake({
            challengeId: challenge.id,
            amountCorrect: grade.amountCorrect ? undefined : false,
            balanced: grade.balanced,
            accountsScore: grade.xpBreakdown.accounts,
            accountsMax: 20,
            directionScore: grade.xpBreakdown.direction,
            directionMax: 20,
            balancedScore: grade.xpBreakdown.balanced,
            balancedMax: 15,
          })}
          detail={grade.whatToImprove[0]}
          onRetry={handleContinue}
          continueLabel="Try again"
        />
      )}

      {phase === "feedback" && grade && grade.scorePercent >= challenge.passThresholdPercent && (
        <Card padding="lg">
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              grade.scorePercent >= challenge.passThresholdPercent
                ? "text-ledger-600"
                : "text-amber-700"
            }`}
          >
            {grade.scorePercent >= challenge.passThresholdPercent ? "Entry accepted" : "Try again"}
          </p>
          <CardTitle className="mt-1 text-xl">{grade.headline}</CardTitle>
          <p className="mt-2 text-sm text-ledger-600">{grade.ownerExplanation}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-ledger-50 p-4">
              <p className="text-xs font-semibold text-ledger-500">Your score</p>
              <p className="text-2xl font-bold text-ledger-900">{grade.scorePercent}%</p>
              <p className="mt-1 text-xs text-ledger-600">
                +{grade.xpBreakdown.total} XP (max {grade.xpBreakdown.max})
              </p>
            </div>
            <div className="rounded-xl bg-ledger-50 p-4 text-sm">
              <p className="text-xs font-semibold text-ledger-500">Breakdown</p>
              <ul className="mt-2 space-y-1 text-ledger-700">
                <li>Calculated amount: {grade.xpBreakdown.calculatedAmount}/25</li>
                <li>Balanced: {grade.xpBreakdown.balanced}/15</li>
                <li>Accounts: {grade.xpBreakdown.accounts}/20</li>
                <li>Direction: {grade.xpBreakdown.direction}/20</li>
                <li>Line amounts: {grade.xpBreakdown.lineAmounts}/20</li>
              </ul>
            </div>
          </div>

          {isScenarioBadgeEarned(grade.scorePercent) && attemptCount === 1 && (
            <div className="mt-4 rounded-xl border border-ledger-300 bg-ledger-50 px-4 py-3 text-sm">
              🏅 Badge earned: <strong>{scenario.badgeName}</strong>
            </div>
          )}

          {grade.whatYouDidWell.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-ledger-800">What you did well</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ledger-700">
                {grade.whatYouDidWell.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {grade.whatToImprove.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-ledger-800">What to improve</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ledger-700">
                {grade.whatToImprove.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <details className="mt-4 rounded-xl border border-ledger-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-ledger-800">
              Show correct entry
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ledger-700">
              {grade.correctEntrySummary}
            </p>
            <p className="mt-2 text-sm font-medium text-ledger-900">
              Correct amount: {formatCentsForMessage(scenario.correctAmountCents)}
            </p>
          </details>

          <div className="mt-6">
            <Button onClick={handleContinue}>
              {grade.scorePercent >= challenge.passThresholdPercent
                ? currentIndex + 1 >= total
                  ? "View readiness report"
                  : "Next adjusting entry"
                : "Try again"}
            </Button>
          </div>
        </Card>
      )}

      <XpReward amount={lastXp} show={showXp} />
    </div>
  );
}
