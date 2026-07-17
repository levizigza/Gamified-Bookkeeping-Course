"use client";

import { useState, useCallback } from "react";
import { reportReaderQuestions, type ReportReaderQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "ready" | "playing" | "feedback" | "done";

export function ReportReader() {
  const [questions, setQuestions] = useState<ReportReaderQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctOption: string } | null>(null);

  const startGame = useCallback(() => {
    setQuestions(shuffle(reportReaderQuestions));
    setIdx(0);
    setScore(0);
    setLastAnswer(null);
    setPhase("playing");
  }, []);

  const answer = (optionIdx: number) => {
    const q = questions[idx];
    const correct = optionIdx === q.correctIndex;
    if (correct) setScore((s) => s + 1);
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
        <div className="text-5xl">🔍</div>
        <h3 className="text-2xl font-bold text-ledger-900">Report Reader</h3>
        <p className="max-w-md text-ledger-600">
          Read P&L shape (gross profit, net income) and Balance Sheet signals.
          Turn <strong>Insights</strong> into owner <strong>Decisions</strong> —
          just like the Week 3 curriculum diagram.
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
        <h3 className="text-2xl font-bold text-ledger-900">Analysis Complete!</h3>
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
        <button onClick={startGame} className="mt-4 rounded-xl bg-ledger-600 px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95">Play Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-ledger-600">Scenario {idx + 1}/{questions.length}</span>
        <span className="text-ledger-600">{score} correct</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div className="h-full rounded-full bg-ledger-500 transition-all duration-300" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {phase === "playing" && q && (
        <div className="animate-fade-in space-y-4 py-2">
          <div className="rounded-xl border border-ledger-200 bg-white p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ledger-400">{q.scenario}</p>
            <div className="flex flex-wrap gap-2">
              {q.statementData.split(" | ").map((item, i) => (
                <span key={i} className="rounded-lg bg-ledger-50 px-3 py-1.5 text-sm font-medium tabular-nums text-ledger-800">
                  {item}
                </span>
              ))}
            </div>
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
            {lastAnswer.correct ? "✓ Great analysis!" : `✗ ${lastAnswer.correctOption}`}
          </p>
          <p className={`mt-2 text-sm ${lastAnswer.correct ? "text-green-700" : "text-red-700"}`}>{lastAnswer.explanation}</p>
          <button onClick={nextQuestion} className="mt-4 rounded-lg bg-ledger-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
            {idx + 1 >= questions.length ? "See Results" : "Next Scenario →"}
          </button>
        </div>
      )}
    </div>
  );
}
