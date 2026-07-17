"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BOARD_SPACES, WEEK_BOARD_META, type BoardSpace } from "@/lib/game/boardData";
import {
  completeMission,
  createBoardGameState,
  getNextRequiredMission,
  getUnlockedWeek,
  getWeekProgress,
  moveActiveRunner,
  moveComputerRunner,
  openMission,
  type BoardGameState,
  type BoardRaceMode,
} from "@/lib/game/boardEngine";
import {
  loadBoardState,
  resetBoardState,
  saveBoardState,
} from "@/lib/data/boardProgress";
import { playSound } from "@/lib/audio/soundEngine";
import { BoardTutorial } from "@/components/board/BoardTutorial";

const WEEK_SPACES = ([1, 2, 3, 4] as const).map((week) => ({
  week,
  spaces: BOARD_SPACES.filter((space) => space.week === week),
}));

function RaceSetup({
  onStart,
  onClose,
  canClose,
}: {
  onStart: (mode: BoardRaceMode, names: string[]) => void;
  onClose: () => void;
  canClose: boolean;
}) {
  const [mode, setMode] = useState<BoardRaceMode>("computer");
  const [names, setNames] = useState(["Player 1", "Player 2"]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ledger-950/75 p-3 backdrop-blur-md sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="race-setup-title"
        className="w-full max-w-lg rounded-[2rem] border border-white/20 bg-white p-5 text-ledger-950 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ledger-500">
              Pick one
            </p>
            <h2 id="race-setup-title" className="mt-1 text-2xl font-black">
              How do you want to race?
            </h2>
          </div>
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ledger-200 px-3 py-1.5 text-sm font-bold"
              aria-label="Close race setup"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("computer")}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              mode === "computer"
                ? "border-ledger-600 bg-ledger-50 shadow-md"
                : "border-ledger-200 hover:border-ledger-300"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">🤖</span>
            <strong className="mt-2 block">Race computers</strong>
            <span className="mt-1 block text-sm text-ledger-600">
              You vs Byte, Penny, and Tally.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode("classroom")}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              mode === "classroom"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-ledger-200 hover:border-ledger-300"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">👥</span>
            <strong className="mt-2 block">Classroom race</strong>
            <span className="mt-1 block text-sm text-ledger-600">
              Pass-and-play on one screen.
            </span>
          </button>
        </div>

        {mode === "classroom" && (
          <div className="mt-5 rounded-2xl bg-purple-50 p-4">
            <p className="text-sm font-bold text-purple-950">Enter 2–4 player names</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <label key={index} className="text-xs font-semibold text-purple-900">
                  Player {index + 1}
                  <input
                    value={names[index] ?? ""}
                    onChange={(event) => {
                      const next = [...names];
                      next[index] = event.target.value;
                      setNames(next);
                    }}
                    placeholder={index < 2 ? `Player ${index + 1}` : "Optional"}
                    className="mt-1 w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-base text-ledger-950"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-purple-700">
              Everyone shares the course missions. Take turns rolling and help each other learn.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onStart(mode, names)}
          disabled={mode === "classroom" && names.filter((name) => name?.trim()).length < 2}
          className="mt-6 w-full rounded-2xl bg-ledger-700 px-5 py-4 text-lg font-black text-white shadow-lg transition hover:bg-ledger-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start the race →
        </button>
      </section>
    </div>
  );
}

function BoardTile({
  space,
  state,
  selected,
  onSelect,
}: {
  space: BoardSpace;
  state: BoardGameState;
  selected: boolean;
  onSelect: () => void;
}) {
  const weekMeta = WEEK_BOARD_META[space.week];
  const completed = space.missionId
    ? state.completedMissionIds.includes(space.missionId)
    : state.collectedRewardSpaces.includes(space.index);
  const opened = space.missionId ? state.openedMissionIds.includes(space.missionId) : false;
  const unlockedWeek = getUnlockedWeek(state.completedMissionIds);
  const locked = space.week > unlockedWeek;
  const runners = state.runners.filter((runner) => runner.position === space.index);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      aria-label={`${space.title}${locked ? ", locked" : completed ? ", complete" : ""}`}
      className={`board-tile relative min-h-28 min-w-28 flex-1 rounded-2xl border-2 p-2 text-left transition-all sm:min-h-32 sm:min-w-32 ${
        selected ? "scale-[1.03] shadow-xl ring-4 ring-white/80" : "hover:-translate-y-1 hover:shadow-lg"
      } ${locked ? "cursor-not-allowed grayscale" : ""}`}
      style={{
        borderColor: completed ? "#f5c842" : weekMeta.color,
        background: locked
          ? "#e5e7eb"
          : `linear-gradient(145deg, #ffffff 0%, ${weekMeta.softColor} 100%)`,
      }}
    >
      <span className="absolute right-2 top-2 text-xs font-black text-ledger-500">
        {locked ? "🔒" : completed ? "⭐" : opened ? "•" : space.index + 1}
      </span>
      <span className="text-2xl sm:text-3xl" aria-hidden="true">{space.icon}</span>
      <span className="mt-2 block pr-5 text-xs font-black leading-tight text-ledger-950 sm:text-sm">
        {space.shortLabel}
      </span>
      {space.requiredForUnlock && !completed && !locked && (
        <span className="mt-1 inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-ledger-600">
          Key star
        </span>
      )}
      <span className="absolute bottom-1.5 left-1.5 flex -space-x-1">
        {runners.map((runner) => (
          <span
            key={runner.id}
            title={runner.name}
            className="board-piece flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm shadow-md sm:h-8 sm:w-8"
            style={{ backgroundColor: runner.color }}
          >
            {runner.icon}
          </span>
        ))}
      </span>
    </button>
  );
}

export function LedgerQuestBoard() {
  const [state, setState] = useState<BoardGameState>(() => createBoardGameState());
  const [ready, setReady] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [message, setMessage] = useState("Tap Roll to start moving.");

  useEffect(() => {
    const loaded = loadBoardState();
    setState(loaded);
    setSelectedIndex(loaded.runners[0]?.position ?? 0);
    setShowHowTo(loaded.tutorialVersion < 2);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveBoardState(state);
  }, [ready, state]);

  const activeRunner = state.runners[state.activeRunnerIndex] ?? state.runners[0];
  const selectedSpace = BOARD_SPACES[selectedIndex] ?? BOARD_SPACES[0];
  const currentSpace = BOARD_SPACES[activeRunner?.position ?? 0];
  const nextMission = getNextRequiredMission(state);
  const currentMissionBlocked =
    Boolean(currentSpace?.requiredForUnlock && currentSpace.missionId) &&
    !state.completedMissionIds.includes(currentSpace.missionId!);
  const unlockedWeek = getUnlockedWeek(state.completedMissionIds);

  const standings = useMemo(
    () => [...state.runners].sort((a, b) => b.position - a.position),
    [state.runners],
  );

  const updateState = (next: BoardGameState) => {
    setState(next);
    saveBoardState(next);
  };

  const handleRoll = () => {
    if (rolling || state.finishedRunnerIds.includes(activeRunner.id) || currentMissionBlocked) return;
    const rolled = Math.floor(Math.random() * 3) + 1;
    setRolling(true);
    setLastRoll(rolled);
    playSound("navClick", 0.7);
    setMessage(`${activeRunner.name} rolled ${rolled}…`);

    window.setTimeout(() => {
      const result = moveActiveRunner(state, rolled);
      let next = result.state;
      setSelectedIndex(result.to);

      if (result.stoppedByMissionId) {
        setMessage("Mission stop! Finish this activity to keep racing.");
        playSound("chaChing", 0.55);
      } else if (result.rewardXp > 0) {
        setMessage(`Nice! +${result.rewardXp} XP collected.`);
        playSound("chaChing", 0.7);
      } else {
        setMessage(`${activeRunner.name} moved ${rolled} spaces.`);
      }

      if (state.mode === "computer") {
        next.runners.forEach((runner, index) => {
          if (!runner.isHuman) {
            next = moveComputerRunner(next, index, Math.floor(Math.random() * 3) + 1);
          }
        });
        next = { ...next, activeRunnerIndex: 0 };
      }

      updateState(next);
      setRolling(false);
    }, 650);
  };

  const handleOpenMission = (space: BoardSpace) => {
    if (!space.missionId) return;
    const next = openMission(state, space.missionId);
    updateState(next);
    setMessage("Mission opened. Finish it, then come back here to collect your star.");
  };

  const handleCompleteMission = (space: BoardSpace) => {
    if (!space.missionId) return;
    const result = completeMission(state, space.missionId);
    updateState(result.state);
    playSound("chaChing", 0.85);
    setMessage(
      result.unlockedWeek
        ? `Week ${result.unlockedWeek} unlocked! The next world is now open.`
        : "Star collected! You can roll again.",
    );
  };

  const handleNewRace = (mode: BoardRaceMode, names: string[]) => {
    const next = resetBoardState(mode, names);
    setState(next);
    setSelectedIndex(0);
    setLastRoll(null);
    setMessage("New race ready. Tap Roll!");
    setShowSetup(false);
    setShowHowTo(true);
  };

  if (!ready) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-ledger-600">Setting up the board…</div>;
  }

  return (
    <div className="board-felt min-h-screen pb-16">
      {showSetup && (
        <RaceSetup
          onStart={handleNewRace}
          onClose={() => setShowSetup(false)}
          canClose={state.rollCount > 0}
        />
      )}
      {showHowTo && (
        <BoardTutorial
          onDone={() => {
            const next = { ...state, hasSeenHowTo: true, tutorialVersion: 2 };
            updateState(next);
            setShowHowTo(false);
          }}
        />
      )}

      <header
        className="mx-auto max-w-7xl px-4 pb-8 pt-8 text-white sm:px-6 sm:pt-12"
        aria-hidden={showHowTo || showSetup || undefined}
        inert={showHowTo || showSetup || undefined}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-400">
              Your four-week bookkeeping course
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
              Ledger Quest Board
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ledger-200 sm:text-base">
              Move through one week at a time. Complete the gold-star missions to learn the skills and unlock the next week.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15"
            >
              ? How to play
            </button>
            <button
              type="button"
              onClick={() => setShowSetup(true)}
              className="rounded-xl border border-gold-400/40 bg-gold-400/15 px-4 py-2 text-sm font-bold text-gold-400 hover:bg-gold-400/20"
            >
              New race
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([1, 2, 3, 4] as const).map((week) => {
            const progress = getWeekProgress(week, state.completedMissionIds);
            const meta = WEEK_BOARD_META[week];
            const locked = week > unlockedWeek;
            return (
              <div
                key={week}
                className={`rounded-2xl border p-3 ${locked ? "border-white/10 bg-white/5 opacity-55" : "border-white/20 bg-white/10"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black">{meta.icon} Week {week}</span>
                  <span className="text-xs font-bold text-gold-400">
                    {locked ? "🔒" : `${progress.completed}/${progress.total} ⭐`}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
                  <div
                    className="h-full rounded-full bg-gold-400 transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </header>

      <main
        className="mx-auto max-w-7xl px-3 sm:px-6"
        aria-hidden={showHowTo || showSetup || undefined}
        inert={showHowTo || showSetup || undefined}
      >
        <section
          aria-label="Board symbols"
          className="mb-4 grid gap-2 rounded-2xl border border-white/20 bg-ledger-950/80 p-3 text-sm text-white backdrop-blur sm:grid-cols-3 sm:p-4"
        >
          <p className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🎲</span>
            <span><strong>Roll:</strong> move your piece.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">⭐</span>
            <span><strong>Key star:</strong> required activity.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🔓</span>
            <span><strong>Unlock:</strong> collect 3 key stars.</span>
          </p>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/95 p-3 shadow-[0_25px_80px_rgba(14,34,27,0.35)] sm:p-5">
          <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-ledger-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3" aria-live="polite">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400 text-2xl text-ledger-950 ${rolling ? "animate-board-dice" : ""}`}
              >
                {lastRoll ?? "🎲"}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ledger-400">Right now</p>
                <p className="font-bold">{message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {currentMissionBlocked ? (
                <button
                  type="button"
                  onClick={() => setSelectedIndex(currentSpace.index)}
                  className="min-h-12 flex-1 rounded-xl bg-gold-400 px-5 py-3 font-black text-ledger-950 sm:flex-none"
                >
                  Do mission first ⭐
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRoll}
                  disabled={rolling || state.finishedRunnerIds.includes(activeRunner.id)}
                  className="min-h-12 flex-1 rounded-xl bg-gold-400 px-7 py-3 text-lg font-black text-ledger-950 shadow-glow-gold transition hover:scale-[1.02] disabled:opacity-50 sm:flex-none"
                >
                  {rolling ? "Rolling…" : `🎲 Roll for ${activeRunner.name}`}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {WEEK_SPACES.map(({ week, spaces }, rowIndex) => {
              const meta = WEEK_BOARD_META[week];
              const orderedSpaces = rowIndex % 2 === 0 ? spaces : [...spaces].reverse();
              return (
                <section
                  key={week}
                  aria-labelledby={`board-week-${week}`}
                  className={`rounded-3xl border-2 p-3 ${week > unlockedWeek ? "opacity-60" : ""}`}
                  style={{ borderColor: meta.color, backgroundColor: meta.softColor }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 id={`board-week-${week}`} className="text-sm font-black" style={{ color: meta.color }}>
                      {meta.icon} WEEK {week} · {meta.title}
                    </h2>
                    <span className="text-xs font-semibold text-ledger-600">
                      {rowIndex % 2 === 0 ? "Swipe or move →" : "← Swipe or move"}
                    </span>
                  </div>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex min-w-[720px] gap-2">
                      {orderedSpaces.map((space) => (
                        <BoardTile
                          key={space.index}
                          space={space}
                          state={state}
                          selected={selectedIndex === space.index}
                          onSelect={() => {
                            setSelectedIndex(space.index);
                            playSound("navClick", 0.35);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-[2rem] border border-ledger-200 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-start gap-4">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
                style={{ backgroundColor: WEEK_BOARD_META[selectedSpace.week].softColor }}
                aria-hidden="true"
              >
                {selectedSpace.icon}
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-ledger-500">
                  Space {selectedSpace.index + 1} · Week {selectedSpace.week}
                </p>
                <h2 className="mt-1 text-2xl font-black text-ledger-950">{selectedSpace.title}</h2>
                <p className="mt-2 leading-relaxed text-ledger-600">{selectedSpace.instruction}</p>
              </div>
            </div>

            {selectedSpace.week > unlockedWeek ? (
              <div className="mt-5 rounded-2xl border border-ledger-200 bg-ledger-50 p-4">
                <p className="font-black text-ledger-900">🔒 This week is locked</p>
                <p className="mt-1 text-sm text-ledger-600">
                  Collect all 3 key stars in Week {unlockedWeek} first. The board will open the next row for you.
                </p>
              </div>
            ) : selectedSpace.missionId ? (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-ledger-200 bg-ledger-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-ledger-900">
                    {state.completedMissionIds.includes(selectedSpace.missionId)
                      ? "⭐ Mission complete"
                      : state.openedMissionIds.includes(selectedSpace.missionId)
                        ? "Welcome back! Did you finish?"
                        : "Your next step is simple:"}
                  </p>
                  <p className="mt-1 text-sm text-ledger-600">
                    {state.completedMissionIds.includes(selectedSpace.missionId)
                      ? "This star is safely in your collection."
                      : state.openedMissionIds.includes(selectedSpace.missionId)
                        ? "Tap the gold button to collect your star."
                        : "Open the activity and finish it. Then use “Back to board” and collect your star."}
                  </p>
                </div>
                {!state.completedMissionIds.includes(selectedSpace.missionId) && (
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    {selectedSpace.href && (
                      <Link
                        href={selectedSpace.href}
                        onClick={() => handleOpenMission(selectedSpace)}
                        className="rounded-xl border-2 border-ledger-600 bg-white px-4 py-3 text-center font-black text-ledger-700"
                      >
                        {selectedSpace.kind === "lesson"
                          ? "Start lesson →"
                          : selectedSpace.kind === "challenge"
                            ? "Start challenge →"
                            : "Start game →"}
                      </Link>
                    )}
                    {state.openedMissionIds.includes(selectedSpace.missionId) && (
                      <button
                        type="button"
                        onClick={() => handleCompleteMission(selectedSpace)}
                        className="rounded-xl bg-gold-400 px-4 py-3 font-black text-ledger-950 shadow-glow-gold"
                      >
                        I finished — collect ⭐
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : selectedSpace.href ? (
              <Link
                href={selectedSpace.href}
                className="mt-5 inline-flex rounded-xl bg-ledger-700 px-5 py-3 font-black text-white"
              >
                Open this stop →
              </Link>
            ) : null}

            {nextMission && (
              <button
                type="button"
                onClick={() => setSelectedIndex(nextMission.index)}
                className="mt-4 text-sm font-bold text-ledger-700 underline decoration-ledger-300 underline-offset-4"
              >
                Show my next key star: {nextMission.title} →
              </button>
            )}
          </section>

          <aside className="rounded-[2rem] bg-ledger-950 p-5 text-white shadow-xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-ledger-400">Race</p>
                <h2 className="mt-1 text-xl font-black">Standings</h2>
              </div>
              <div className="rounded-xl bg-gold-400/15 px-3 py-2 text-right">
                <p className="text-[10px] font-bold uppercase text-gold-400">Rewards</p>
                <p className="font-black text-gold-400">{state.totalXp} XP</p>
              </div>
            </div>
            <ol className="mt-5 space-y-2">
              {standings.map((runner, index) => (
                <li
                  key={runner.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="w-5 text-center text-sm font-black text-gold-400">{index + 1}</span>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/70"
                    style={{ backgroundColor: runner.color }}
                    aria-hidden="true"
                  >
                    {runner.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate">{runner.name}</strong>
                    <span className="text-xs text-ledger-400">
                      {state.finishedRunnerIds.includes(runner.id)
                        ? "Finished the course!"
                        : `Space ${runner.position + 1} · Week ${BOARD_SPACES[runner.position].week}`}
                    </span>
                  </span>
                  {state.finishedRunnerIds.includes(runner.id) && (
                    <span title="Finished" aria-label="Finished">🏆</span>
                  )}
                  {runner.id === activeRunner.id && state.mode === "classroom" && (
                    <span className="rounded-full bg-gold-400/20 px-2 py-1 text-[10px] font-black text-gold-400">
                      TURN
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {state.winnerId && (
              <div className="mt-4 rounded-2xl border border-gold-400/30 bg-gold-400/10 p-3 text-sm">
                <strong className="text-gold-400">
                  🏆 {state.runners.find((runner) => runner.id === state.winnerId)?.name} crossed first!
                </strong>
                <p className="mt-1 text-ledger-300">
                  The race stays open until every learner reaches accountant-ready books.
                </p>
              </div>
            )}
            <p className="mt-4 text-xs leading-relaxed text-ledger-400">
              {state.mode === "computer"
                ? "Computer racers are friendly pace-setters. They can never lock you out of learning or your trophy."
                : "Pass the device after each roll. The class shares mission stars and unlocks."}
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
