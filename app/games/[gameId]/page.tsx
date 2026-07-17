import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DebitOrCredit } from "@/components/games/DebitOrCredit";
import { CategoryBlitz } from "@/components/games/CategoryBlitz";
import { BalanceTheEntry } from "@/components/games/BalanceTheEntry";
import { CashFlowSnap } from "@/components/games/CashFlowSnap";
import { StatementSorter } from "@/components/games/StatementSorter";
import { EquationHero } from "@/components/games/EquationHero";
import { ReportReader } from "@/components/games/ReportReader";
import { YearEndPrep } from "@/components/games/YearEndPrep";
import { GameWeekMount } from "@/components/games/GameWeekMount";
import { ARCADE_GAMES } from "@/lib/games/arcadeCatalog";

type GameProps = { week?: number };

const GAME_COMPONENTS: Record<string, React.ComponentType<GameProps>> = {
  "debit-credit": DebitOrCredit,
  "category-blitz": CategoryBlitz,
  "balance-entry": BalanceTheEntry,
  "cash-flow-snap": CashFlowSnap,
  "statement-sorter": StatementSorter as React.ComponentType<GameProps>,
  "equation-hero": EquationHero as React.ComponentType<GameProps>,
  "report-reader": ReportReader as React.ComponentType<GameProps>,
  "year-end-prep": YearEndPrep as React.ComponentType<GameProps>,
};

export function generateStaticParams() {
  return ARCADE_GAMES.map((game) => ({ gameId: game.id }));
}

type GamePageProps = {
  params: Promise<{ gameId: string }>;
};

export async function generateMetadata({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = ARCADE_GAMES.find((g) => g.id === gameId);
  return {
    title: game ? `${game.title} — Ledger Quest` : "Game — Ledger Quest",
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const meta = ARCADE_GAMES.find((g) => g.id === gameId);
  const GameComponent = GAME_COMPONENTS[gameId];

  if (!meta || !GameComponent) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-4">
            <Link href="/board" className="text-sm font-semibold text-ledger-700 hover:text-ledger-950">
              ← Back to board
            </Link>
        <Link href="/games" className="text-sm text-ledger-600 hover:text-ledger-900">
              All games
        </Link>
      </nav>

      <header className="mb-6 text-center">
        <span className="text-4xl">{meta.icon}</span>
        <h1 className="mt-2 text-2xl font-bold text-ledger-900">{meta.title}</h1>
        <p className="mt-1 text-sm text-ledger-500">{meta.description}</p>
      </header>

      <div className="card-surface p-6">
        <Suspense fallback={<p className="text-center text-ledger-500">Loading game…</p>}>
          <GameWeekMount gameId={gameId} GameComponent={GameComponent} defaultWeek={1} />
        </Suspense>
      </div>
    </div>
  );
}
