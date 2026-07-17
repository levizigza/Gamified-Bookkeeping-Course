"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DebitOrCredit } from "@/components/games/DebitOrCredit";
import { CategoryBlitz } from "@/components/games/CategoryBlitz";
import { BalanceTheEntry } from "@/components/games/BalanceTheEntry";
import { CashFlowSnap } from "@/components/games/CashFlowSnap";
import { StatementSorter } from "@/components/games/StatementSorter";
import { EquationHero } from "@/components/games/EquationHero";
import { ReportReader } from "@/components/games/ReportReader";
import { YearEndPrep } from "@/components/games/YearEndPrep";

const GAME_META: Record<string, { title: string; icon: string }> = {
  "debit-credit": { title: "Debit or Credit?", icon: "⚡" },
  "category-blitz": { title: "Category Blitz", icon: "🗂️" },
  "balance-entry": { title: "Balance the Entry", icon: "⚖️" },
  "cash-flow-snap": { title: "Cash Flow Snap", icon: "💰" },
  "statement-sorter": { title: "Statement Sorter", icon: "📋" },
  "equation-hero": { title: "Equation Hero", icon: "🧮" },
  "report-reader": { title: "Report Reader", icon: "🔍" },
  "year-end-prep": { title: "Year-End Prep", icon: "🎯" },
};

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  "debit-credit": DebitOrCredit,
  "category-blitz": CategoryBlitz,
  "balance-entry": BalanceTheEntry,
  "cash-flow-snap": CashFlowSnap,
  "statement-sorter": StatementSorter,
  "equation-hero": EquationHero,
  "report-reader": ReportReader,
  "year-end-prep": YearEndPrep,
};

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const meta = GAME_META[gameId];
  const GameComponent = GAME_COMPONENTS[gameId];

  if (!meta || !GameComponent) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/games" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to all games
        </Link>
      </nav>

      <header className="mb-6 text-center">
        <span className="text-4xl">{meta.icon}</span>
        <h1 className="mt-2 text-2xl font-bold text-ledger-900">{meta.title}</h1>
      </header>

      <div className="card-surface p-6">
        <GameComponent />
      </div>
    </div>
  );
}
