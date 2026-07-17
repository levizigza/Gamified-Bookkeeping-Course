"use client";

import { useState, useCallback } from "react";
import { yearEndQuestions, type YearEndQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  depreciation: { label: "Depreciation", icon: "📉" },
  home_office: { label: "Home Office", icon: "🏠" },
  mileage: { label: "Mileage", icon: "🚗" },
  handoff: { label: "Accountant Handoff", icon: "📦" },
};

type Phase = "ready" | "playing" | "feedback" | "done";

export function YearEndPrep() {
  const [questions, setQuestions] = useState<YearEndQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctOption: string } | null>(null);
  const [categoryScores, setCategoryScores] = useState<Record<string, { right: number; total: number }>>({});

  const startGame = useCallback(() => {
    setQuestions(shuffle(yearEndQuestions));
    setIdx(0);
    setScore(0);
    setLastAnswer(null);
    setCategoryScores({});
    setPhase("playing");
  }, []);

  const answer = (optionIdx: number) => {
    const q = questions[idx];
    const correct = optionIdx === q.correctIndex;
    if (correct) setScore((s) => s + 1);
    setCategoryScores((prev) => {
      const cat = prev[q.category] ?? { right: 0, total: 0 };
      return { ...prev, [q.category]: { right: cat.right + (correct ? 1 : 0), total: cat.total + 1 } };
    });
    setLastAnswer({ correct, explanation: q.explanation, correctOption: q.options[q.correctIndex] });
    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length) setPhase("done");
    else { setIdx((i) => i + 1); setLastAnswer(null); setPhase("playing"); }
  };

  const q = questions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">🎯</div>
        <h3 className="text-2xl font-bold text-ledger-900">Year-End Prep</h3>
        <p className="max-w-md text-ledger-600">
          Week 4 common journals before tax handoff:
          <strong> Journal #1 depreciation</strong> ($14,500),
          <strong> Journal #2 home office</strong> ($3,585),
          <strong> Journal #3 mileage</strong> ($15,600), then
          <strong> accountant handover</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.values(CATEGORY_LABELS).map((c) => (
            <span key={c.label} className="rounded-full border border-ledger-200 bg-white px-3 py-1 text-xs font-medium text-ledger-600">
              {c.icon} {c.label}
            </span>
          ))}
        </div>
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
        <h3 className="text-2xl font-bold text-ledger-900">Year-End Review Complete!</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{score}/{questions.length}</p>
            <p className="text-xs text-ledger-500">Correct</p>
          </div>
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{pct}%</p>
            <p className="text-xs text-ledger-500">Accuracy</p>
          </div>
        </div>
        <div className="mt-2 w-full max-w-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-ledger-400">By category</p>
          {Object.entries(categoryScores).map(([cat, s]) => {
            const meta = CATEGORY_LABELS[cat];
            return (
              <div key={cat} className="flex items-center justify-between rounded-lg border border-ledger-100 bg-white px-3 py-2 text-sm">
                <span>{meta?.icon} {meta?.label}</span>
                <span className="font-bold tabular-nums text-ledger-900">{s.right}/{s.total}</span>
              </div>
            );
          })}
        </div>
        <button onClick={startGame} className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">Play Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-ledger-600">Q{idx + 1}/{questions.length}</span>
        {q && (
          <span className="rounded-full border border-ledger-200 bg-white px-2 py-0.5 text-xs text-ledger-500">
            {CATEGORY_LABELS[q.category]?.icon} {CATEGORY_LABELS[q.category]?.label}
          </span>
        )}
        <span className="text-ledger-600">{score} correct</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div className="h-full rounded-full bg-ledger-500 transition-all duration-300" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {phase === "playing" && q && (
        <div className="animate-fade-in space-y-4 py-2">
          <div className="rounded-xl border border-ledger-200 bg-white p-4">
            <p className="text-sm text-ledger-600">{q.scenario}</p>
          </div>

          <p className="text-center text-base font-bold text-ledger-900">{q.question}</p>

          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => answer(oi)}
                className="w-full rounded-xl border-2 border-ledger-200 bg-white px-5 py-3 text-left text-sm font-medium text-ledger-800 transition-all hover:border-ledger-400 hover:bg-ledger-50 active:scale-[0.98]"
              >
                <span className="mr-2 font-bold text-ledger-400">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Correct!" : `✗ ${lastAnswer.correctOption}`}
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
