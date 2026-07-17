"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { AccountType } from "@/lib/types/accounting";
import type { ClassifyTransactionChallenge } from "@/lib/data/week1Challenges";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import {
  buildChallengeSummary,
  createEmptyClassification,
  FIELD_LABELS,
  gradeClassification,
  isClassificationComplete,
  xpForCorrectAnswer,
  type AttemptRecord,
  type ClassificationField,
  type GradeResult,
  type UserClassification,
} from "@/lib/game/scoring";
import { ProgressBar } from "@/components/game/ProgressBar";
import { XpReward } from "@/components/game/XpReward";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { classifyMistake } from "@/lib/game/remediation";
import { RemediationFeedback } from "@/components/game/RemediationFeedback";
import { ChallengeCompletePanel } from "@/components/game/ChallengeCompletePanel";
import { Alert } from "@/components/ui/Alert";

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "asset", label: "Asset" },
  { value: "liability", label: "Liability" },
  { value: "equity", label: "Equity" },
  { value: "income", label: "Income / Revenue" },
  { value: "expense", label: "Expense" },
];

const CASH_EFFECT_OPTIONS = [
  { value: "increase" as const, label: "Bank/Cash increases" },
  { value: "decrease" as const, label: "Bank/Cash decreases" },
  { value: "no_change" as const, label: "No change to Bank/Cash" },
];

type TransactionClassifierProps = {
  challenge: ClassifyTransactionChallenge;
};

type Phase = "question" | "feedback" | "summary";

export function TransactionClassifier({ challenge }: TransactionClassifierProps) {
  const transactions = challenge.transactions;
  const total = transactions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [answers, setAnswers] = useState<UserClassification>(createEmptyClassification);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [attemptRecords, setAttemptRecords] = useState<AttemptRecord[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState(0);
  const [firstTryWrongFields, setFirstTryWrongFields] = useState<ClassificationField[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [lastXp, setLastXp] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  const currentTransaction = transactions[currentIndex];
  const completedCount = attemptRecords.length;

  const filteredAccounts = useMemo(() => {
    if (!answers.accountType) return [];
    return chartOfAccounts.filter(
      (a) => a.active && a.accountType === answers.accountType,
    );
  }, [answers.accountType]);

  const updateAnswer = useCallback(
    <K extends keyof UserClassification>(key: K, value: UserClassification[K]) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "accountType") {
          next.accountId = "";
        }
        return next;
      });
    },
    [],
  );

  const handleSubmit = () => {
    if (!currentTransaction || !isClassificationComplete(answers)) return;

    const nextAttempt = questionAttempts + 1;
    setQuestionAttempts(nextAttempt);

    const result = gradeClassification(answers, currentTransaction.answer);
    setGradeResult(result);

    if (nextAttempt === 1 && !result.correct) {
      setFirstTryWrongFields(result.wrongFields);
    }

    if (result.correct) {
      const xp = xpForCorrectAnswer(currentTransaction.xpReward);
      setLastXp(xp);
      setShowXp(true);
      setSessionXp((s) => s + xp);

      setAttemptRecords((prev) => [
        ...prev,
        {
          transactionId: currentTransaction.id,
          firstTryCorrect: nextAttempt === 1,
          attempts: nextAttempt,
          xpEarned: xp,
          wrongFieldsOnFirstTry: nextAttempt === 1 ? [] : firstTryWrongFields,
        },
      ]);
    }

    setPhase("feedback");
  };

  const handleRetry = () => {
    setAnswers(createEmptyClassification());
    setGradeResult(null);
    setPhase("question");
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setPhase("summary");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setAnswers(createEmptyClassification());
    setGradeResult(null);
    setQuestionAttempts(0);
    setFirstTryWrongFields([]);
    setPhase("question");
  };

  const summary = useMemo(
    () => buildChallengeSummary(attemptRecords),
    [attemptRecords],
  );

  if (phase === "summary") {
    return (
      <ChallengeSummaryView
        summary={summary}
        sessionXp={sessionXp}
        nextLessonId={challenge.nextLessonId}
        onRetry={() => {
          setCurrentIndex(0);
          setAttemptRecords([]);
          setSessionXp(0);
          setQuestionAttempts(0);
          setFirstTryWrongFields([]);
          setAnswers(createEmptyClassification());
          setGradeResult(null);
          setPhase("question");
        }}
      />
    );
  }

  if (!currentTransaction) return null;

  const canSubmit = isClassificationComplete(answers);
  const isCorrect = gradeResult?.correct ?? false;

  return (
    <div className="space-y-6">
      <XpReward amount={lastXp} show={showXp} />

      <ProgressBar
        current={completedCount}
        total={total}
        label="Transactions classified"
      />

      {/* Transaction card */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
          {currentTransaction.date} · {sampleBusiness.businessName}
        </p>
        <CardTitle className="mt-1">{currentTransaction.description}</CardTitle>
        {currentTransaction.vendor && (
          <p className="mt-1 text-sm text-ledger-500">{currentTransaction.vendor}</p>
        )}
        <CardDescription className="mt-3 text-base leading-relaxed">
          {currentTransaction.narrative}
        </CardDescription>
        {currentTransaction.amountCents > 0 && (
          <p className="mt-4 text-2xl font-bold tabular-nums text-ledger-900">
            {formatCentsForMessage(currentTransaction.amountCents)}
          </p>
        )}
        {currentTransaction.amountCents === 0 && (
          <p className="mt-4 text-sm font-medium text-ledger-600">
            No dollar amount — classify the entry type
          </p>
        )}
      </Card>

      {phase === "question" && (
        <fieldset className="space-y-5" disabled={false}>
          <legend className="sr-only">Classify this transaction</legend>

          {/* Account category */}
          <div>
            <label
              htmlFor="account-type"
              className="mb-2 block text-sm font-semibold text-ledger-800"
            >
              1. Account category
            </label>
            <select
              id="account-type"
              value={answers.accountType}
              onChange={(e) =>
                updateAnswer("accountType", e.target.value as AccountType | "")
              }
              className="w-full rounded-xl border border-ledger-300 bg-white px-4 py-2.5 text-sm text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-500/20"
            >
              <option value="">Select a category…</option>
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Specific account */}
          <div>
            <label
              htmlFor="account-id"
              className="mb-2 block text-sm font-semibold text-ledger-800"
            >
              2. Specific account
            </label>
            <select
              id="account-id"
              value={answers.accountId}
              onChange={(e) => updateAnswer("accountId", e.target.value)}
              disabled={!answers.accountType}
              className="w-full rounded-xl border border-ledger-300 bg-white px-4 py-2.5 text-sm text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-500/20 disabled:cursor-not-allowed disabled:bg-ledger-50 disabled:text-ledger-400"
            >
              <option value="">
                {answers.accountType
                  ? "Select an account…"
                  : "Choose a category first"}
              </option>
              {filteredAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} — {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cash effect */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-ledger-800">
              3. Bank/Cash effect
            </span>
            <div className="space-y-2" role="radiogroup" aria-label="Bank or cash effect">
              {CASH_EFFECT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    answers.cashEffect === opt.value
                      ? "border-ledger-600 bg-ledger-50"
                      : "border-ledger-200 hover:border-ledger-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cash-effect"
                    value={opt.value}
                    checked={answers.cashEffect === opt.value}
                    onChange={() => updateAnswer("cashEffect", opt.value)}
                    className="h-4 w-4 accent-ledger-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Sales tax */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-ledger-800">
              4. Does GST apply?
            </span>
            <div className="flex gap-3" role="radiogroup" aria-label="Sales tax applies">
              {[
                { value: true, label: "Yes — GST applies" },
                { value: false, label: "No — GST does not apply" },
              ].map((opt) => (
                <label
                  key={String(opt.value)}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    answers.salesTaxApplies === opt.value
                      ? "border-ledger-600 bg-ledger-50"
                      : "border-ledger-200 hover:border-ledger-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="sales-tax"
                    checked={answers.salesTaxApplies === opt.value}
                    onChange={() => updateAnswer("salesTaxApplies", opt.value)}
                    className="h-4 w-4 accent-ledger-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full sm:w-auto"
            size="lg"
          >
            Check Answer
          </Button>
        </fieldset>
      )}

      {phase === "feedback" && gradeResult && (
        <FeedbackPanel
          challengeId={challenge.id}
          correct={isCorrect}
          gradeResult={gradeResult}
          transaction={currentTransaction}
          onRetry={handleRetry}
          onNext={handleNext}
          isLast={currentIndex + 1 >= total}
        />
      )}
    </div>
  );
}

type FeedbackPanelProps = {
  challengeId: string;
  correct: boolean;
  gradeResult: GradeResult;
  transaction: ClassifyTransactionChallenge["transactions"][number];
  onRetry: () => void;
  onNext: () => void;
  isLast: boolean;
};

function FeedbackPanel({
  challengeId,
  correct,
  gradeResult,
  transaction,
  onRetry,
  onNext,
  isLast,
}: FeedbackPanelProps) {
  const { answer } = transaction;

  if (!correct) {
    const weakAreaId = classifyMistake({
      challengeId,
      wrongFields: gradeResult.wrongFields,
    });
    const detail =
      gradeResult.wrongFields.length > 0
        ? gradeResult.wrongFields
            .map((field) => FIELD_LABELS[field as ClassificationField])
            .join(", ") + " need review on this transaction."
        : undefined;

    return (
      <RemediationFeedback
        weakAreaId={weakAreaId}
        detail={detail}
        onRetry={onRetry}
      />
    );
  }

  return (
    <Card className="border-ledger-400 bg-ledger-50">
      <p className="text-lg font-bold text-ledger-700" role="status">
        Correct!
      </p>
      <div className="mt-4 space-y-3 text-sm text-ledger-700">
        <div>
          <p className="font-semibold text-ledger-800">Why this is right</p>
          <p className="mt-1 leading-relaxed">{answer.explanation}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-3">
          <p className="font-semibold text-ledger-800">Consistency principle</p>
          <p className="mt-1 leading-relaxed">{answer.consistencyPrinciple}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-3">
          <p className="font-semibold text-ledger-800">Double-entry effect</p>
          <p className="mt-1 leading-relaxed font-mono text-xs sm:text-sm">
            {answer.doubleEntryEffect}
          </p>
        </div>
      </div>
      <Button onClick={onNext} className="mt-6 w-full sm:w-auto" size="lg">
        {isLast ? "See Summary" : "Next Transaction"}
      </Button>
    </Card>
  );
}

type ChallengeSummaryViewProps = {
  summary: ReturnType<typeof buildChallengeSummary>;
  sessionXp: number;
  nextLessonId: string;
  onRetry: () => void;
};

function ChallengeSummaryView({
  summary,
  sessionXp,
  nextLessonId,
  onRetry,
}: ChallengeSummaryViewProps) {
  const passed = summary.recommendation !== "retry";

  return (
    <ChallengeCompletePanel
      eyebrow="Challenge complete"
      title="Transaction Classifier — Results"
      passed={passed}
      stats={[
        { label: "XP earned", value: `+${sessionXp}`, highlight: true },
        { label: "First-try accuracy", value: `${summary.accuracyPercent}%` },
        {
          label: "Correct first try",
          value: `${summary.correctOnFirstTry}/${summary.totalQuestions}`,
        },
      ]}
      actions={
        <>
          {summary.recommendation === "retry" ? (
            <Button onClick={onRetry} size="lg">
              Retry challenge
            </Button>
          ) : (
            <Link href={`/lessons/${nextLessonId}`}>
              <Button size="lg">Next lesson</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </>
      }
    >
      {summary.weakAreas.length > 0 && (
        <Alert variant="warning" title="Areas to review">
          <ul className="mt-1 space-y-1">
            {summary.weakAreas.map((area) => (
              <li key={area}>• {area}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Alert variant="info" title="Recommendation" className="mt-4">
        {summary.recommendationMessage}
      </Alert>
    </ChallengeCompletePanel>
  );
}
