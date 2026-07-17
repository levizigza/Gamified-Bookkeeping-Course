"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";

type GameProps = { week?: number };

const CORE_DRILL_IDS = new Set([
  "debit-credit",
  "category-blitz",
  "balance-entry",
  "cash-flow-snap",
]);

type GameWeekMountProps = {
  gameId: string;
  GameComponent: ComponentType<GameProps>;
  /** Fallback when URL has no ?week= (Week 1 default for core drills). */
  defaultWeek?: number;
};

export function GameWeekMount({ gameId, GameComponent, defaultWeek = 1 }: GameWeekMountProps) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("week");
  const fromUrl = raw ? Number.parseInt(raw, 10) : NaN;
  const week = Number.isFinite(fromUrl)
    ? fromUrl
    : CORE_DRILL_IDS.has(gameId)
      ? defaultWeek
      : undefined;

  return <GameComponent week={week} />;
}
