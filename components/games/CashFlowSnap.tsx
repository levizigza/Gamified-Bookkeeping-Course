"use client";

import { useState, useEffect, useCallback } from "react";
import { cashFlowQuestions, type CashFlowQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Answer = "up" | "down" | "no_change";
type Phase = "ready" | "playing" | "feedback" | "done";

const CHOICES: { value: Answer; label: string; icon: string; color: string }[] = [
  { value: "up", label: "Cash Goes UP", icon: "📈", color: "border-green-300 bg-green-50 text-green-800 hover:border-green-500" },
  { value: "down", label: "Cash Goes DOWN", icon: "📉", color: "border-red-300 bg-red-50 text-red-800 hover:border-red-500" },
  { value: "no_change", label: "No Change", icon: "➡️", color: "border-gray-300 bg-gray-50 text-gray-800 hover:border-gray-500" },
];

export function CashFlowSnap({ week }: { week?: number }) {
  const pool = week ? cashFlowQuestions.filter((q) => q.week <= week) : cashFlowQuestions;
  const ROUND_SIZE = 10;
  const TIME_LIMIT = 75;

  const [questions, setQuestions] = useState<CashFlowQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctLabel: string } | null>(null);

  const startGame = useCallback(() => {
    setQuestions(shuffle(pool).slice(0, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(TIME_LIMIT);
    setLastAnswer(null);
    setPhase("playing");
  }, [pool]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const answer = (choice: Answer) => {
    const q = questions[idx];
    const correct = choice === q.correctAnswer;
    const correctLabel = CHOICES.find((c) => c.value === q.correctAnswer)?.label ?? "";
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => { const next = s + 1; setBestStreak((b) => Math.max(b, next)); return next; });
    } else {
      setStreak(0);
    }
    setLastAnswer({ correct, explanation: q.explanation, correctLabel });
    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length || timeLeft <= 0) {
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setLastAnswer(null);
      setPhase("playing");
    }
  };

  const q = questions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">💰</div>
        <h3 className="text-2xl font-bold text-ledger-900">Cash Flow Snap</h3>
        <p className="max-w-md text-ledger-600">
          Read each business event and decide: does <strong>cash go up</strong>,
          <strong> go down</strong>, or <strong>stay the same</strong>?
          Not every transaction moves the bank account!
        </p>
        <button onClick={startGame} className="rounded-xl bg-ledger-600 px-8 py-3 text-lg font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">
          Start Game
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center animate-scale-in">
        <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</div>
        <h3 className="text-2xl font-bold text-ledger-900">Round Complete!</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{score}/{questions.length}</p>
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
        <button onClick={startGame} className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-ledger-600">Q{idx + 1}/{questions.length}</span>
        <span className={`tabular-nums font-bold ${timeLeft <= 15 ? "text-red-600 animate-pulse" : "text-ledger-700"}`}>⏱ {timeLeft}s</span>
        <span className="text-ledger-600">{score} pts {streak > 1 && <span className="text-amber-600">· {streak}🔥</span>}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div className="h-full rounded-full bg-ledger-500 transition-all duration-300" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {phase === "playing" && q && (
        <div className="animate-fade-in space-y-5 py-4">
          <div className="rounded-xl border border-ledger-200 bg-white p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ledger-400">Business event</p>
            <p className="text-base font-medium text-ledger-900">{q.event}</p>
          </div>

          <p className="text-center text-sm font-semibold text-ledger-600">
            What happens to your Bank/Cash balance?
          </p>

          <div className="grid grid-cols-3 gap-3">
            {CHOICES.map((c) => (
              <button
                key={c.value}
                onClick={() => answer(c.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 font-bold transition-all active:scale-95 ${c.color}`}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs sm:text-sm">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Correct!" : `✗ ${lastAnswer.correctLabel}`}
          </p>
          <p className={`mt-2 text-sm ${lastAnswer.correct ? "text-green-700" : "text-red-700"}`}>{lastAnswer.explanation}</p>
          <button onClick={nextQuestion} className="mt-4 rounded-lg bg-ledger-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
            {idx + 1 >= questions.length ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
