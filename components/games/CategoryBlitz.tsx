"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { categoryQuestions, type CategoryQuestion } from "@/lib/games/gameData";
import type { AccountType } from "@/lib/types/accounting";
import {
  getAccountSorterChallenge,
  SORT_CATEGORIES,
  SORT_CATEGORY_LABELS,
  type SortCategory,
} from "@/lib/data/week2Challenges";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BASIC_CATEGORIES: { type: AccountType; label: string; color: string }[] = [
  { type: "asset", label: "Asset", color: "border-blue-300 bg-blue-50 text-blue-800 hover:border-blue-500" },
  { type: "liability", label: "Liability", color: "border-orange-300 bg-orange-50 text-orange-800 hover:border-orange-500" },
  { type: "equity", label: "Equity", color: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500" },
  { type: "income", label: "Income", color: "border-green-300 bg-green-50 text-green-800 hover:border-green-500" },
  { type: "expense", label: "Expense", color: "border-red-300 bg-red-50 text-red-800 hover:border-red-500" },
];

const DETAIL_COLORS: Record<SortCategory, string> = {
  current_asset: "border-sky-300 bg-sky-50 text-sky-900 hover:border-sky-500",
  fixed_asset: "border-blue-300 bg-blue-50 text-blue-900 hover:border-blue-500",
  current_liability: "border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-500",
  long_term_liability: "border-orange-300 bg-orange-50 text-orange-900 hover:border-orange-500",
  revenue: "border-green-300 bg-green-50 text-green-900 hover:border-green-500",
  expense: "border-red-300 bg-red-50 text-red-900 hover:border-red-500",
  equity: "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-500",
};

type DetailQuestion = {
  accountName: string;
  hint: string;
  correctCategory: SortCategory;
  explanation: string;
};

type Phase = "ready" | "playing" | "feedback" | "done";

export function CategoryBlitz({ week }: { week?: number }) {
  const detailed = (week ?? 0) >= 2;
  const ROUND_SIZE = detailed ? 12 : 10;
  const TIME_LIMIT = detailed ? 120 : 90;

  const basicPool = useMemo(
    () => (week ? categoryQuestions.filter((q) => q.week <= week) : categoryQuestions),
    [week],
  );

  const detailPool = useMemo<DetailQuestion[]>(
    () =>
      getAccountSorterChallenge().items.map((item) => ({
        accountName: item.name,
        hint: SORT_CATEGORY_LABELS[item.correctCategory],
        correctCategory: item.correctCategory,
        explanation: item.correctFeedback,
      })),
    [],
  );

  const [basicQuestions, setBasicQuestions] = useState<CategoryQuestion[]>([]);
  const [detailQuestions, setDetailQuestions] = useState<DetailQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{
    correct: boolean;
    explanation: string;
    correctLabel: string;
  } | null>(null);

  const questionCount = detailed ? detailQuestions.length : basicQuestions.length;

  const startGame = useCallback(() => {
    if (detailed) {
      setDetailQuestions(shuffle(detailPool).slice(0, ROUND_SIZE));
      setBasicQuestions([]);
    } else {
      setBasicQuestions(shuffle(basicPool).slice(0, ROUND_SIZE));
      setDetailQuestions([]);
    }
    setIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(TIME_LIMIT);
    setLastAnswer(null);
    setPhase("playing");
  }, [basicPool, detailPool, detailed, ROUND_SIZE, TIME_LIMIT]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const recordAnswer = (correct: boolean, explanation: string, correctLabel: string) => {
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setLastAnswer({ correct, explanation, correctLabel });
    setPhase("feedback");
  };

  const answerBasic = (type: AccountType) => {
    const q = basicQuestions[idx];
    const correct = type === q.correctCategory;
    const correctLabel = BASIC_CATEGORIES.find((c) => c.type === q.correctCategory)?.label ?? "";
    recordAnswer(correct, q.explanation, correctLabel);
  };

  const answerDetail = (type: SortCategory) => {
    const q = detailQuestions[idx];
    const correct = type === q.correctCategory;
    recordAnswer(correct, q.explanation, SORT_CATEGORY_LABELS[q.correctCategory]);
  };

  const nextQuestion = () => {
    if (idx + 1 >= questionCount || timeLeft <= 0) {
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setLastAnswer(null);
      setPhase("playing");
    }
  };

  const basicQ = basicQuestions[idx];
  const detailQ = detailQuestions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">🗂️</div>
        <h3 className="text-2xl font-bold text-ledger-900">
          {detailed ? "Account Sorter Blitz" : "Account Category Blitz"}
        </h3>
        <p className="max-w-md text-ledger-600">
          {detailed
            ? "Week 2: sort into Current Asset, Fixed Asset, Current Liability, Long-Term Liability, Income, Expense, or Equity."
            : "See an account name and sort it into Asset, Liability, Equity, Income, or Expense."}{" "}
          {ROUND_SIZE} accounts, {TIME_LIMIT} seconds!
        </p>
        <button
          onClick={startGame}
          className="rounded-xl bg-ledger-600 px-8 py-3 text-lg font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = questionCount ? Math.round((score / questionCount) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center animate-scale-in">
        <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</div>
        <h3 className="text-2xl font-bold text-ledger-900">Blitz Complete!</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">
              {score}/{questionCount}
            </p>
            <p className="text-xs text-ledger-500">Correct</p>
          </div>
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{pct}%</p>
            <p className="text-xs text-ledger-500">Accuracy</p>
          </div>
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{bestStreak}🔥</p>
            <p className="text-xs text-ledger-500">Best streak</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-ledger-600">
          Q{idx + 1}/{questionCount}
        </span>
        <span
          className={`tabular-nums font-bold ${timeLeft <= 15 ? "text-red-600 animate-pulse" : "text-ledger-700"}`}
        >
          ⏱ {timeLeft}s
        </span>
        <span className="text-ledger-600">
          {score} pts {streak > 1 && <span className="text-amber-600">· {streak}🔥</span>}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div
          className="h-full rounded-full bg-ledger-500 transition-all duration-300"
          style={{ width: `${questionCount ? (idx / questionCount) * 100 : 0}%` }}
        />
      </div>

      {phase === "playing" && detailed && detailQ && (
        <div className="animate-fade-in space-y-5 py-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-ledger-900">{detailQ.accountName}</p>
            <p className="mt-1 text-sm text-ledger-500">Pick the Week 2 bucket</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {SORT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => answerDetail(cat)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all active:scale-95 ${DETAIL_COLORS[cat]}`}
              >
                {SORT_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "playing" && !detailed && basicQ && (
        <div className="animate-fade-in space-y-5 py-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-ledger-900">{basicQ.accountName}</p>
            <p className="mt-1 text-sm text-ledger-500">{basicQ.hint}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BASIC_CATEGORIES.map((cat) => (
              <button
                key={cat.type}
                onClick={() => answerBasic(cat.type)}
                className={`rounded-xl border-2 px-4 py-3 font-bold transition-all active:scale-95 ${cat.color}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div
          className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}
        >
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Correct!" : `✗ It's ${lastAnswer.correctLabel}`}
          </p>
          <p className={`mt-2 text-sm ${lastAnswer.correct ? "text-green-700" : "text-red-700"}`}>
            {lastAnswer.explanation}
          </p>
          <button
            onClick={nextQuestion}
            className="mt-4 rounded-lg bg-ledger-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
          >
            {idx + 1 >= questionCount ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
