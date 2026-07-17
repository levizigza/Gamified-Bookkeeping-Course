"use client";

import { useState, useCallback } from "react";
import { equationQuestions, type EquationQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 }).format(n);
}

type Phase = "ready" | "playing" | "feedback" | "done";

export function EquationHero() {
  const [questions, setQuestions] = useState<EquationQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctValue: string } | null>(null);

  const startGame = useCallback(() => {
    setQuestions(shuffle(equationQuestions));
    setIdx(0);
    setScore(0);
    setInputValue("");
    setLastAnswer(null);
    setPhase("playing");
  }, []);

  const checkAnswer = () => {
    const q = questions[idx];
    const parsed = parseFloat(inputValue);
    if (!Number.isFinite(parsed)) return;
    const correct = Math.round(parsed) === q.correctValue;
    if (correct) setScore((s) => s + 1);
    setLastAnswer({ correct, explanation: q.explanation, correctValue: fmt(q.correctValue) });
    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length) setPhase("done");
    else { setIdx((i) => i + 1); setInputValue(""); setLastAnswer(null); setPhase("playing"); }
  };

  const q = questions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">🧮</div>
        <h3 className="text-2xl font-bold text-ledger-900">Equation Hero</h3>
        <p className="max-w-md text-ledger-600">
          The Balance Sheet must balance: <strong>Assets = Liabilities + Equity</strong>.
          Two values are given — solve for the missing one (including sample statement totals).
        </p>
        <div className="rounded-xl border border-ledger-200 bg-white px-6 py-3">
          <p className="text-lg font-bold text-ledger-900">Assets = Liabilities + Equity</p>
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
        <h3 className="text-2xl font-bold text-ledger-900">All Equations Done!</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{score}/{questions.length}</p>
            <p className="text-xs text-ledger-500">Solved</p>
          </div>
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{pct}%</p>
            <p className="text-xs text-ledger-500">Accuracy</p>
          </div>
        </div>
        <button onClick={startGame} className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">Play Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-ledger-600">Puzzle {idx + 1}/{questions.length}</span>
        <span className="text-ledger-600">{score} solved</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div className="h-full rounded-full bg-ledger-500 transition-all duration-300" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {phase === "playing" && q && (
        <div className="animate-fade-in space-y-4 py-2">
          <div className="rounded-xl border border-ledger-200 bg-white p-4">
            <p className="text-sm text-ledger-600">{q.scenario}</p>
          </div>

          <div className="flex items-center justify-center gap-3 text-center">
            <div className={`rounded-lg px-4 py-3 ${q.missingLabel === "Assets" ? "border-2 border-amber-300 bg-amber-50" : "border border-ledger-200 bg-white"}`}>
              <p className="text-xs font-semibold text-ledger-400">Assets</p>
              <p className="text-xl font-bold text-ledger-900">
                {q.missingLabel === "Assets" ? "?" : fmt(q.missingLabel === "Liabilities" ? q.givenValue1 === q.correctValue + (q.givenLabel2 === "Equity" ? q.givenValue2 : 0) ? q.givenValue1 : q.givenLabel1 === "Assets" ? q.givenValue1 : q.givenValue2 : q.givenLabel1 === "Assets" ? q.givenValue1 : q.givenValue2)}
              </p>
            </div>
            <span className="text-xl font-bold text-ledger-400">=</span>
            <div className={`rounded-lg px-4 py-3 ${q.missingLabel === "Liabilities" ? "border-2 border-amber-300 bg-amber-50" : "border border-ledger-200 bg-white"}`}>
              <p className="text-xs font-semibold text-ledger-400">Liabilities</p>
              <p className="text-xl font-bold text-ledger-900">
                {q.missingLabel === "Liabilities" ? "?" : fmt(q.givenLabel1 === "Liabilities" ? q.givenValue1 : q.givenLabel2 === "Liabilities" ? q.givenValue2 : 0)}
              </p>
            </div>
            <span className="text-xl font-bold text-ledger-400">+</span>
            <div className={`rounded-lg px-4 py-3 ${q.missingLabel === "Equity" ? "border-2 border-amber-300 bg-amber-50" : "border border-ledger-200 bg-white"}`}>
              <p className="text-xs font-semibold text-ledger-400">Equity</p>
              <p className="text-xl font-bold text-ledger-900">
                {q.missingLabel === "Equity" ? "?" : fmt(q.givenLabel1 === "Equity" ? q.givenValue1 : q.givenLabel2 === "Equity" ? q.givenValue2 : 0)}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="eq-input" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ledger-500">
                {q.missingLabel} ($)
              </label>
              <input
                id="eq-input"
                type="number"
                min="0"
                step="1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="0"
                className="w-full rounded-lg border-2 border-amber-300 bg-white px-4 py-3 text-lg font-bold text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-1 focus:ring-ledger-500"
                autoFocus
              />
            </div>
            <button onClick={checkAnswer} disabled={!inputValue} className="rounded-xl bg-ledger-600 px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50">
              Check
            </button>
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Equation balanced!" : `✗ The answer is ${lastAnswer.correctValue}`}
          </p>
          <p className={`mt-2 text-sm ${lastAnswer.correct ? "text-green-700" : "text-red-700"}`}>{lastAnswer.explanation}</p>
          <button onClick={nextQuestion} className="mt-4 rounded-lg bg-ledger-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
            {idx + 1 >= questions.length ? "See Results" : "Next Puzzle →"}
          </button>
        </div>
      )}
    </div>
  );
}
