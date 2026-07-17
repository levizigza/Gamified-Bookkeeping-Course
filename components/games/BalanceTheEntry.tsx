"use client";

import { useState, useCallback } from "react";
import { balanceQuestions, type BalanceQuestion } from "@/lib/games/gameData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDollars(cents: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

type Phase = "ready" | "playing" | "feedback" | "done";

export function BalanceTheEntry({ week }: { week?: number }) {
  const pool = week ? balanceQuestions.filter((q) => q.week <= week) : balanceQuestions;

  const [questions, setQuestions] = useState<BalanceQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [phase, setPhase] = useState<Phase>("ready");
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string; correctAmount: string } | null>(null);

  const startGame = useCallback(() => {
    setQuestions(shuffle(pool));
    setIdx(0);
    setScore(0);
    setInputValue("");
    setLastAnswer(null);
    setPhase("playing");
  }, [pool]);

  const checkAnswer = () => {
    const q = questions[idx];
    const parsed = parseFloat(inputValue);
    if (!Number.isFinite(parsed)) return;
    const userCents = Math.round(parsed * 100);
    const correct = userCents === q.correctAmountCents;
    if (correct) setScore((s) => s + 1);
    setLastAnswer({
      correct,
      explanation: q.explanation,
      correctAmount: formatDollars(q.correctAmountCents),
    });
    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (idx + 1 >= questions.length) {
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setInputValue("");
      setLastAnswer(null);
      setPhase("playing");
    }
  };

  const q = questions[idx];

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">⚖️</div>
        <h3 className="text-2xl font-bold text-ledger-900">Balance the Entry</h3>
        <p className="max-w-md text-ledger-600">
          Each journal entry has one missing amount. Figure out what it should be
          so that <strong>total debits = total credits</strong>. The golden rule!
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
        <h3 className="text-2xl font-bold text-ledger-900">All Entries Done!</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{score}/{questions.length}</p>
            <p className="text-xs text-ledger-500">Balanced</p>
          </div>
          <div className="rounded-xl border border-ledger-200 bg-white px-4 py-3">
            <p className="text-2xl font-bold text-ledger-900">{pct}%</p>
            <p className="text-xs text-ledger-500">Accuracy</p>
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
        <span className="text-ledger-600">Entry {idx + 1}/{questions.length}</span>
        <span className="text-ledger-600">{score} balanced</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-ledger-100">
        <div className="h-full rounded-full bg-ledger-500 transition-all duration-300" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {phase === "playing" && q && (
        <div className="animate-fade-in space-y-4 py-2">
          <div className="rounded-xl border border-ledger-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-ledger-500">{q.scenario}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ledger-200 text-xs uppercase tracking-wider text-ledger-400">
                  <th className="py-2 text-left">Account</th>
                  <th className="py-2 text-right">Debit</th>
                  <th className="py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody>
                {q.lines.map((line, li) => {
                  const isMissing = li === q.missingIndex;
                  return (
                    <tr key={li} className={`border-b border-ledger-100 ${isMissing ? "bg-amber-50" : ""}`}>
                      <td className="py-2 font-medium text-ledger-900">{line.accountName}</td>
                      <td className="py-2 text-right tabular-nums text-ledger-700">
                        {isMissing && q.missingSide === "debit" ? (
                          <span className="font-bold text-amber-600">?</span>
                        ) : line.debitCents ? formatDollars(line.debitCents) : "—"}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ledger-700">
                        {isMissing && q.missingSide === "credit" ? (
                          <span className="font-bold text-amber-600">?</span>
                        ) : line.creditCents ? formatDollars(line.creditCents) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="balance-input" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ledger-500">
                Missing {q.missingSide} amount ($)
              </label>
              <input
                id="balance-input"
                type="number"
                min="0"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="0.00"
                className="w-full rounded-lg border-2 border-amber-300 bg-white px-4 py-3 text-lg font-bold text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-1 focus:ring-ledger-500"
                autoFocus
              />
            </div>
            <button
              onClick={checkAnswer}
              disabled={!inputValue}
              className="rounded-xl bg-ledger-600 px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              Check
            </button>
          </div>
        </div>
      )}

      {phase === "feedback" && lastAnswer && (
        <div className={`animate-fade-in rounded-xl border-2 p-5 ${lastAnswer.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-lg font-bold ${lastAnswer.correct ? "text-green-800" : "text-red-800"}`}>
            {lastAnswer.correct ? "✓ Perfectly balanced!" : `✗ The answer was ${lastAnswer.correctAmount}`}
          </p>
          <p className={`mt-2 text-sm ${lastAnswer.correct ? "text-green-700" : "text-red-700"}`}>{lastAnswer.explanation}</p>
          <button onClick={nextQuestion} className="mt-4 rounded-lg bg-ledger-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
            {idx + 1 >= questions.length ? "See Results" : "Next Entry →"}
          </button>
        </div>
      )}
    </div>
  );
}
