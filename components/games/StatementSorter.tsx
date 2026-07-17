"use client";

import { useState, useEffect, useCallback } from "react";
import { statementSortQuestions, type StatementSortQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "ready" | "playing" | "feedback" | "done";

const CHOICES = [
  { value: "pl" as const, label: "Profit & Loss", icon: "📊", color: "border-violet-300 bg-violet-50 text-violet-800 hover:border-violet-500" },
  { value: "bs" as const, label: "Balance Sheet", icon: "🏦", color: "border-teal-300 bg-teal-50 text-teal-800 hover:border-teal-500" },
];

export function StatementSorter() {
  const ROUND_SIZE = 12;
  const TIME_LIMIT = 90;

  const [questions, setQuestions] = useState<StatementSortQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctLabel: string; section: string } | null>(null);

  const startGame = useCallback(() => {
    setQuestions(shuffle(statementSortQuestions).slice(0, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(TIME_LIMIT);
    setLastAnswer(null);
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const answer = (choice: "pl" | "bs") => {
    const q = questions[idx];
    const correct = choice === q.correctStatement;
    const correctLabel = CHOICES.find((c) => c.value === q.correctStatement)?.label ?? "";
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => { const next = s + 1; setBestStreak((b) => Math.max(b, next)); return next; });
    } else {
      setStreak(0);
    }
    setLastAnswer({ correct, explanation: q.explanation, correctLabel, section: q.correctSection });
    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length || timeLeft <= 0) setPhase("done");
    else { setIdx((i) => i + 1); setLastAnswer(null); setPhase("playing"); }
  };

  const q = questions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">📋</div>
        <h3 className="text-2xl font-bold text-ledger-900">Statement Sorter</h3>
        <p className="max-w-md text-ledger-600">
          Week 3 flow: accounts from the Trial Balance land on the
          <strong> Profit &amp; Loss</strong> (period performance) or the
          <strong> Balance Sheet</strong> (position today). {ROUND_SIZE} accounts,{" "}
          {TIME_LIMIT} seconds!
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
        <button onClick={startGame} className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">Play Again</button>
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
          <div className="text-center">
            <p className="text-2xl font-bold text-ledger-900">{q.accountName}</p>
            <p className="mt-1 text-sm text-ledger-500">{q.hint}</p>
          </div>
          <p className="text-center text-sm font-semibold text-ledger-600">Which financial statement?</p>
          <div className="grid grid-cols-2 gap-4">
            {CHOICES.map((c) => (
              <button key={c.value} onClick={() => answer(c.value)} className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 font-bold transition-all active:scale-95 ${c.color}`}>
                <span className="text-3xl">{c.icon}</span>
                <span className="text-sm">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Correct!" : `✗ ${lastAnswer.correctLabel} → ${lastAnswer.section}`}
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
