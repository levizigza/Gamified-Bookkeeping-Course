"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DoubleEntryDuelChallenge } from "@/lib/data/week1JournalChallenges";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import {
  createEmptyBuilderLine,
  gradeJournalEntry,
  type BuilderJournalLine,
  type JournalGradeResult,
} from "@/lib/game/journalScoring";
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

type DoubleEntryDuelProps = {
  challenge: DoubleEntryDuelChallenge;
};

type Phase = "build" | "feedback" | "summary";

type ScenarioResult = {
  scenarioId: string;
  xp: number;
  perfect: boolean;
  grade: JournalGradeResult;
};

function formatCents(cents: number): string {
  return formatCentsForMessage(cents);
}

export function DoubleEntryDuel({ challenge }: DoubleEntryDuelProps) {
  const scenarios = challenge.scenarios;
  const total = scenarios.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("build");
  const [lines, setLines] = useState<BuilderJournalLine[]>([
    createEmptyBuilderLine(),
    createEmptyBuilderLine(),
  ]);
  const [grade, setGrade] = useState<JournalGradeResult | null>(null);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [lastXp, setLastXp] = useState(0);

  const scenario = scenarios[currentIndex];
  const completedCount = results.length;

  const canSubmit = useMemo(() => {
    const filled = lines.filter((l) => l.accountId && l.amountCents > 0);
    return filled.length >= 2 && phase === "build";
  }, [lines, phase]);

  const handleSubmit = () => {
    if (!scenario || !canSubmit) return;
    const result = gradeJournalEntry(lines, scenario);
    setGrade(result);
    setLastXp(result.xpBreakdown.total);
    setShowXp(true);
    setResults((prev) => [
      ...prev,
      {
        scenarioId: scenario.id,
        xp: result.xpBreakdown.total,
        perfect: result.isPerfect,
        grade: result,
      },
    ]);
    setPhase("feedback");
  };

  const handleRetry = () => {
    setLines([createEmptyBuilderLine(), createEmptyBuilderLine()]);
    setGrade(null);
    setPhase("build");
    setResults((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setPhase("summary");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setLines([createEmptyBuilderLine(), createEmptyBuilderLine()]);
    setGrade(null);
    setPhase("build");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults([]);
    setLines([createEmptyBuilderLine(), createEmptyBuilderLine()]);
    setGrade(null);
    setPhase("build");
  };

  if (phase === "summary") {
    const totalXp = results.reduce((s, r) => s + r.xp, 0);
    const maxXp = scenarios.reduce((s, sc) => s + sc.maxXp, 0);
    const perfectCount = results.filter((r) => r.perfect).length;
    const accuracy = Math.round((totalXp / maxXp) * 100);

    const weakAreas = new Map<string, number>();
    for (const r of results) {
      if (r.grade.xpBreakdown.balanced < 10) {
        weakAreas.set("Balancing entries", (weakAreas.get("Balancing entries") ?? 0) + 1);
      }
      if (r.grade.xpBreakdown.accounts < 12) {
        weakAreas.set("Account selection", (weakAreas.get("Account selection") ?? 0) + 1);
      }
      if (r.grade.xpBreakdown.direction < 12) {
        weakAreas.set("Debit/credit direction", (weakAreas.get("Debit/credit direction") ?? 0) + 1);
      }
      if (r.grade.xpBreakdown.salesTax < 8) {
        weakAreas.set("GST handling", (weakAreas.get("GST handling") ?? 0) + 1);
      }
    }

    const recommendRetry = accuracy < 70;

    return (
      <ChallengeCompletePanel
        eyebrow="Duel complete"
        title="Double-Entry Duel — Results"
        passed={!recommendRetry}
        stats={[
          { label: "XP earned", value: `+${totalXp}`, highlight: true },
          { label: "Score", value: `${accuracy}%` },
          { label: "Perfect entries", value: `${perfectCount}/${total}` },
        ]}
        actions={
          <>
            {recommendRetry ? (
              <Button onClick={handleRestart} size="lg">
                Retry duel
              </Button>
            ) : (
              <Link href={`/lessons/${challenge.nextLessonId}`}>
                <Button size="lg">Next lesson</Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </>
        }
      >
        {weakAreas.size > 0 && (
          <Alert variant="warning" title="Areas to review">
            <ul className="mt-1 space-y-1">
              {[...weakAreas.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([area, count]) => (
                  <li key={area}>
                    • {area} ({count} scenario{count > 1 ? "s" : ""})
                  </li>
                ))}
            </ul>
          </Alert>
        )}
        <Alert variant="info" className="mt-4">
          {recommendRetry
            ? "Practice the duel again to sharpen balancing and GST splits before the June Ledger Sprint."
            : "Excellent duel! Head to the June Ledger Sprint to record full-month transactions."}
        </Alert>
      </ChallengeCompletePanel>
    );
  }

  if (!scenario) return null;

  return (
    <div className="space-y-6">
      <XpReward amount={lastXp} show={showXp} />

      <ProgressBar
        current={completedCount}
        total={total}
        label="Scenarios completed"
      />

      {/* Scenario card */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
          {scenario.date} · {sampleBusiness.businessName}
        </p>
        <CardTitle className="mt-1">{scenario.title}</CardTitle>
        <CardDescription className="mt-3 text-base leading-relaxed">
          {scenario.narrative}
        </CardDescription>
        {scenario.displayAmountCents !== undefined && scenario.displayAmountCents > 0 && (
          <p className="mt-4 text-2xl font-bold tabular-nums text-ledger-900">
            {formatCents(scenario.displayAmountCents)}
          </p>
        )}
        {scenario.salesTaxApplies && (
          <span className="mt-3 inline-block rounded-full bg-ledger-100 px-2.5 py-0.5 text-xs font-medium text-ledger-700">
            GST applies to this scenario
          </span>
        )}
      </Card>

      {phase === "build" && (
        <>
          <JournalEntryBuilder lines={lines} onChange={setLines} />

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="lg"
            className="w-full sm:w-auto"
          >
            Submit Entry
          </Button>
          {!canSubmit && (
            <p className="text-xs text-ledger-500">
              Add at least two lines with an account and amount to submit.
            </p>
          )}
        </>
      )}

      {phase === "feedback" && grade && (
        <JournalFeedbackPanel
          challengeId={challenge.id}
          grade={grade}
          consistencyTip={scenario.consistencyTip}
          onRetry={handleRetry}
          onNext={handleNext}
          isLast={currentIndex + 1 >= total}
        />
      )}
    </div>
  );
}

type JournalFeedbackPanelProps = {
  challengeId: string;
  grade: JournalGradeResult;
  consistencyTip: string;
  onRetry: () => void;
  onNext: () => void;
  isLast: boolean;
};

function JournalFeedbackPanel({
  challengeId,
  grade,
  consistencyTip,
  onRetry,
  onNext,
  isLast,
}: JournalFeedbackPanelProps) {
  const { xpBreakdown } = grade;

  const weakAreaId = classifyMistake({
    challengeId,
    balanced: grade.balanced,
    balancedScore: xpBreakdown.balanced,
    balancedMax: 10,
    accountsScore: xpBreakdown.accounts,
    accountsMax: 15,
    directionScore: xpBreakdown.direction,
    directionMax: 15,
    salesTaxScore: xpBreakdown.salesTax,
    salesTaxMax: 10,
  });

  return (
    <div className="space-y-4">
      <Card
        className={
          grade.isPerfect
            ? "border-ledger-400 bg-ledger-50"
            : "border-amber-300 bg-amber-50/40"
        }
      >
        <p className="text-lg font-bold text-ledger-900" role="status">
          {grade.headline}
        </p>
        <p className="mt-2 text-2xl font-bold text-gold-600">
          +{xpBreakdown.total} XP
          <span className="ml-2 text-sm font-normal text-ledger-500">
            of {xpBreakdown.max}
          </span>
        </p>

        {/* XP breakdown */}
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <XpBreakdownItem label="Balanced" earned={xpBreakdown.balanced} max={10} />
          <XpBreakdownItem label="Accounts" earned={xpBreakdown.accounts} max={15} />
          <XpBreakdownItem label="Direction" earned={xpBreakdown.direction} max={15} />
          <XpBreakdownItem label="GST" earned={xpBreakdown.salesTax} max={10} />
        </dl>
      </Card>

      <Card className="border-gold-500/30 bg-gold-400/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
          Explain this like I&apos;m a new business owner
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ledger-800">
          {grade.ownerExplanation}
        </p>
      </Card>

      {grade.whatYouDidWell.length > 0 && (
        <Card padding="sm">
          <p className="text-sm font-semibold text-ledger-800">What you did well</p>
          <ul className="mt-2 space-y-1">
            {grade.whatYouDidWell.map((item) => (
              <li key={item} className="text-sm text-ledger-600">
                ✓ {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {grade.whatToImprove.length > 0 && (
        <Card padding="sm" className="border-amber-200 bg-amber-50/30">
          <p className="text-sm font-semibold text-ledger-800">What to improve</p>
          <ul className="mt-2 space-y-1">
            {grade.whatToImprove.map((item) => (
              <li key={item} className="text-sm text-ledger-600">
                → {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card padding="sm" className="bg-ledger-50">
        <p className="text-sm font-semibold text-ledger-800">Correct entry</p>
        <p className="mt-2 text-sm leading-relaxed text-ledger-700">
          {grade.correctEntrySummary}
        </p>
      </Card>

      <Card padding="sm" className="border-l-4 border-ledger-600">
        <p className="text-xs font-semibold uppercase text-ledger-600">Consistency tip</p>
        <p className="mt-1 text-sm text-ledger-700">{consistencyTip}</p>
      </Card>

      {!grade.isPerfect && (
        <RemediationFeedback
          weakAreaId={weakAreaId}
          onRetry={onRetry}
          continueLabel="Try again"
        />
      )}

      <div className="flex flex-wrap gap-3">
        {grade.isPerfect && (
          <Button onClick={onNext} size="lg">
            {isLast ? "See Results" : "Next Scenario"}
          </Button>
        )}
        {!grade.isPerfect && (
          <Button onClick={onNext} variant="ghost" size="lg">
            {isLast ? "See Results" : "Next Scenario"}
          </Button>
        )}
      </div>
    </div>
  );
}

function XpBreakdownItem({
  label,
  earned,
  max,
}: {
  label: string;
  earned: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
  return (
    <div className="rounded-lg bg-white/80 p-2 text-center">
      <dt className="text-xs text-ledger-500">{label}</dt>
      <dd className="font-semibold tabular-nums text-ledger-900">
        {earned}/{max}
      </dd>
      <div className="mx-auto mt-1 h-1 w-full max-w-[4rem] overflow-hidden rounded-full bg-ledger-100">
        <div
          className="h-full bg-ledger-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
