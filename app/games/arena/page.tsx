"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KahootArena } from "@/components/games/kahoot/KahootArena";
import {
  balanceToKahoot,
  categoryToKahoot,
  debitCreditToKahoot,
  GAME_PAIRS,
  statementsToKahoot,
  type KahootQuestion,
} from "@/lib/games/kahootEngine";
import {
  balanceQuestions,
  categoryQuestions,
  debitCreditQuestions,
  statementSortQuestions,
} from "@/lib/games/gameData";
import { DollarBillFrame } from "@/components/navigation/NavSymbols";

const STYLE_BADGES: Record<string, { label: string; className: string }> = {
  neon: { label: "Neon", className: "bg-purple-500/20 text-purple-300 border-purple-400/40" },
  "8bit": { label: "8-Bit", className: "bg-blue-500/20 text-blue-300 border-blue-400/40" },
  paper: { label: "Paper", className: "bg-amber-500/20 text-amber-300 border-amber-400/40" },
  "3d": { label: "3D", className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" },
};

function questionsForPair(pairId: string): { title: string; questions: KahootQuestion[] } | null {
  switch (pairId) {
    case "debit-credit-pair":
      return {
        title: "Debit or Credit — Arena Quiz",
        questions: debitCreditToKahoot(debitCreditQuestions),
      };
    case "category-pair":
      return {
        title: "Account Classification — Arena Quiz",
        questions: categoryToKahoot(categoryQuestions),
      };
    case "balance-pair":
      return {
        title: "Journal Balancing — Arena Quiz",
        questions: balanceToKahoot(balanceQuestions),
      };
    case "statements-pair":
      return {
        title: "Financial Statements — Arena Quiz",
        questions: statementsToKahoot(statementSortQuestions),
      };
    default:
      return null;
  }
}

export default function ArenaPage() {
  const [activePair, setActivePair] = useState<string | null>(null);
  const activeQuiz = useMemo(
    () => (activePair ? questionsForPair(activePair) : null),
    [activePair],
  );

  if (activeQuiz) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <KahootArena
          title={activeQuiz.title}
          questions={activeQuiz.questions}
          onExit={() => setActivePair(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/games" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to games
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <p className="text-sm font-medium text-gold-600">Arena Mode</p>
        <h1 className="mt-1 text-3xl font-bold text-ledger-900">Kahoot-Style Battles</h1>
        <p className="mx-auto mt-2 max-w-xl text-ledger-600">
          Compete against AI bookkeeper bots. Pair each hands-on practice game with its Arena quiz.
        </p>
      </header>

      <DollarBillFrame className="mb-8 text-center">
        <p className="text-sm font-semibold text-ledger-700">Learning pair rule</p>
        <p className="mt-1 text-sm text-ledger-600">
          Complete the <strong>practice game</strong> first, then pass the{" "}
          <strong>Arena quiz</strong> to lock in the skill.
        </p>
      </DollarBillFrame>

      <ul className="grid gap-5 sm:grid-cols-2">
        {GAME_PAIRS.map((pair) => {
          const style = STYLE_BADGES[pair.visualStyle];

          return (
            <li key={pair.id}>
              <article
                className={`card-surface-interactive overflow-hidden p-5 game-style-${pair.visualStyle}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-ledger-900">{pair.title}</h2>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style.className}`}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ledger-600">{pair.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <Link
                    href={`/games/${pair.kinestheticGameId}`}
                    className="rounded-xl border border-ledger-200 bg-ledger-50 px-3 py-3 font-medium text-ledger-700 transition hover:border-ledger-400 hover:bg-ledger-100"
                  >
                    <span className="block text-lg">Practice</span>
                    Kinesthetic
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActivePair(pair.id)}
                    className="rounded-xl border border-gold-400/50 bg-gold-400/10 px-3 py-3 font-medium text-ledger-800 transition hover:bg-gold-400/20"
                  >
                    <span className="block text-lg">Battle</span>
                    Arena Quiz
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
