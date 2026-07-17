"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { DebitOrCredit } from "@/components/games/DebitOrCredit";
import { CategoryBlitz } from "@/components/games/CategoryBlitz";
import { BalanceTheEntry } from "@/components/games/BalanceTheEntry";
import { CashFlowSnap } from "@/components/games/CashFlowSnap";
import { StatementSorter } from "@/components/games/StatementSorter";
import { EquationHero } from "@/components/games/EquationHero";
import { ReportReader } from "@/components/games/ReportReader";
import { YearEndPrep } from "@/components/games/YearEndPrep";
import { ARCADE_GAMES, getArcadeGame, type ArcadeGame } from "@/lib/games/arcadeCatalog";
import { playSound } from "@/lib/audio/soundEngine";
import { Button } from "@/components/ui/Button";
import { ConceptVisual } from "@/components/visuals/ConceptVisual";

type GameProps = { week?: number };

const CORE_DRILL_IDS = new Set([
  "debit-credit",
  "category-blitz",
  "balance-entry",
  "cash-flow-snap",
]);

const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  "debit-credit": DebitOrCredit,
  "category-blitz": CategoryBlitz,
  "balance-entry": BalanceTheEntry,
  "cash-flow-snap": CashFlowSnap,
  "statement-sorter": StatementSorter as ComponentType<GameProps>,
  "equation-hero": EquationHero as ComponentType<GameProps>,
  "report-reader": ReportReader as ComponentType<GameProps>,
  "year-end-prep": YearEndPrep as ComponentType<GameProps>,
};

const STYLE_CHIP: Record<ArcadeGame["style"], string> = {
  neon: "border-purple-300 bg-purple-50 text-purple-700",
  "8bit": "border-blue-300 bg-blue-50 text-blue-700",
  paper: "border-amber-300 bg-amber-50 text-amber-800",
  "3d": "border-emerald-300 bg-emerald-50 text-emerald-800",
  cash: "border-green-300 bg-green-50 text-green-800",
  equation: "border-teal-300 bg-teal-50 text-teal-800",
  detective: "border-indigo-300 bg-indigo-50 text-indigo-800",
  boss: "border-rose-300 bg-rose-50 text-rose-800",
};

export function SideArcade() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get("game") ?? ARCADE_GAMES.find((g) => g.featured)?.id ?? ARCADE_GAMES[0].id;
  const weekParam = searchParams.get("week");
  const weekFromUrl = weekParam ? Number.parseInt(weekParam, 10) : NaN;
  const activeWeek = Number.isFinite(weekFromUrl) ? weekFromUrl : 1;

  const [activeId, setActiveId] = useState(initialId);
  const [presentation, setPresentation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const active = useMemo(() => getArcadeGame(activeId) ?? ARCADE_GAMES[0], [activeId]);
  const GameComponent = GAME_COMPONENTS[active.id];

  const selectGame = useCallback(
    (id: string) => {
      playSound("chaChing");
      setActiveId(id);
      router.replace(`/games/arcade?game=${id}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const fromUrl = searchParams.get("game");
    if (fromUrl && fromUrl !== activeId && getArcadeGame(fromUrl)) {
      setActiveId(fromUrl);
    }
  }, [searchParams, activeId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = ARCADE_GAMES.findIndex((g) => g.id === activeId);
        const next =
          e.key === "ArrowDown"
            ? ARCADE_GAMES[(idx + 1) % ARCADE_GAMES.length]
            : ARCADE_GAMES[(idx - 1 + ARCADE_GAMES.length) % ARCADE_GAMES.length];
        selectGame(next.id);
      }
      if (e.key.toLowerCase() === "p") {
        setPresentation((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, selectGame]);

  return (
    <div
      className={`arcade-shell relative overflow-hidden rounded-3xl border border-ledger-800/40 bg-gradient-to-br from-ledger-950 via-ledger-900 to-ledger-800 text-white shadow-2xl ${
        presentation ? "min-h-[calc(100vh-2rem)]" : "min-h-[720px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-ledger-400/20 blur-3xl" />
        <div className="accounting-grid absolute inset-0 opacity-40" />
      </div>

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
            Client Showcase · Side Arcade
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">Kinesthetic Bookkeeping Games</h1>
          <p className="mt-1 max-w-xl text-sm text-ledger-200">
            Hands-on demos you can click through live—no quiz pressure, just muscle-memory learning.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={presentation ? "secondary" : "outline"}
            className={presentation ? "" : "border-white/30 bg-white/5 text-white hover:bg-white/10"}
            onClick={() => {
              playSound("navClick");
              setPresentation((v) => !v);
            }}
          >
            {presentation ? "Exit presentation" : "Presentation mode"}
          </Button>
          <button
            type="button"
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm lg:hidden"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? "Hide list" : "Show games"}
          </button>
          <Link
            href="/games/arena"
            className="rounded-xl border border-gold-400/40 bg-gold-400/10 px-3 py-2 text-sm font-medium text-gold-400 hover:bg-gold-400/20"
          >
            Arena quizzes →
          </Link>
        </div>
      </header>

      <div className="relative z-10 grid lg:grid-cols-[280px_1fr]">
        {/* Side rail */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } border-b border-white/10 lg:block lg:border-b-0 lg:border-r lg:border-white/10`}
        >
          <div className="max-h-[40vh] overflow-y-auto p-3 lg:max-h-[calc(100vh-12rem)]">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-ledger-400">
              Pick a cabinet · ↑↓ keys
            </p>
            <ul className="space-y-2">
              {ARCADE_GAMES.map((game) => {
                const selected = game.id === active.id;
                return (
                  <li key={game.id}>
                    <button
                      type="button"
                      onClick={() => selectGame(game.id)}
                      className={`group flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                        selected
                          ? "border-gold-400/60 bg-white/10 shadow-glow-gold"
                          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {game.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold leading-tight">{game.title}</span>
                          {game.featured && (
                            <span className="rounded-full bg-gold-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold-400">
                              Demo
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-ledger-300">{game.tagline}</span>
                        <span
                          className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${STYLE_CHIP[game.style]}`}
                        >
                          {game.style}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main stage */}
        <section className="flex min-h-[560px] flex-col p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">
                  {active.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">{active.title}</h2>
                  <p className="text-sm text-ledger-200">{active.description}</p>
                </div>
              </div>
              <dl className="mt-3 flex flex-wrap gap-3 text-xs">
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  <dt className="sr-only">Skill</dt>
                  <dd>
                    <span className="text-ledger-400">Skill · </span>
                    {active.skill}
                  </dd>
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  <dt className="sr-only">Curriculum</dt>
                  <dd>{active.weeks}</dd>
                </div>
                {CORE_DRILL_IDS.has(active.id) && (
                  <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-1 py-0.5">
                    <span className="px-2 text-ledger-400">Drill week</span>
                    {[1, 2].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          playSound("navClick");
                          router.replace(`/games/arcade?game=${active.id}&week=${w}`, { scroll: false });
                        }}
                        className={`rounded-full px-2.5 py-1 font-semibold transition ${
                          activeWeek === w
                            ? "bg-gold-400/20 text-gold-400"
                            : "text-ledger-300 hover:bg-white/10"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </dl>
            </div>
            <div className="hidden h-28 w-36 opacity-80 sm:block" aria-hidden="true">
              <ConceptVisual variant="arcade" className="h-full w-full" />
            </div>
          </div>

          <div className="arcade-cabinet relative flex-1 overflow-hidden rounded-2xl border border-white/15 bg-white text-ledger-950 shadow-inner">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-r from-ledger-900 to-ledger-800 px-4 py-2 text-xs text-ledger-100">
              <span className="font-mono uppercase tracking-wider">Cabinet //{active.id}</span>
              <span className="text-gold-400">● LIVE DEMO</span>
            </div>
            <div className="h-full overflow-y-auto p-4 pt-12 sm:p-6 sm:pt-14">
              {GameComponent ? (
                <GameComponent
                  key={`${active.id}-${activeWeek}`}
                  week={CORE_DRILL_IDS.has(active.id) ? activeWeek : undefined}
                />
              ) : (
                <p className="text-ledger-600">Game unavailable.</p>
              )}
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-ledger-400">
            Tip: Press <kbd className="rounded bg-white/10 px-1">P</kbd> for presentation mode ·{" "}
            <kbd className="rounded bg-white/10 px-1">↑</kbd>/<kbd className="rounded bg-white/10 px-1">↓</kbd> to
            switch cabinets
          </p>
        </section>
      </div>
    </div>
  );
}
