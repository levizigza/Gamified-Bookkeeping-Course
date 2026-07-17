"use client";

import { useState } from "react";

type BoardTutorialProps = {
  onDone: () => void;
};

const TUTORIAL_STEPS = [
  {
    eyebrow: "First: know the goal",
    title: "This board is your course map",
    body:
      "Your piece starts in Week 1. You will roll along the path, but learning—not luck—opens each new week.",
    button: "Show me how to move",
  },
  {
    eyebrow: "Step 1 of 3",
    title: "Roll to move your piece",
    body:
      "A roll moves your piece one to three spaces. If you reach a gold-star mission, your piece stops there.",
    button: "Try a practice roll",
  },
  {
    eyebrow: "Step 2 of 3",
    title: "Complete the activity",
    body:
      "Open the lesson, game, or challenge shown on that space. When you finish, return to the board.",
    button: "Next: see what happens after a mission",
  },
  {
    eyebrow: "Step 3 of 3",
    title: "Collect the star",
    body:
      "After you finish a real activity, return here and collect the star. Collect three key stars in a week to unlock the next week.",
    button: "Next: collect your star",
  },
  {
    eyebrow: "You are ready",
    title: "Roll. Learn. Collect. Unlock.",
    body:
      "Start with Week 1: learn what bookkeeping is, practise double-entry, and complete the Week 1 gate.",
    button: "Start Week 1",
  },
] as const;

export function BoardTutorial({ onDone }: BoardTutorialProps) {
  const [step, setStep] = useState(0);
  const current = TUTORIAL_STEPS[step];
  const tokenPosition = step >= 2 ? 1 : 0;
  const missionOpened = step >= 3;
  const starCollected = step >= 4;

  const advance = () => {
    if (step === TUTORIAL_STEPS.length - 1) {
      onDone();
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-ledger-950/90 p-3 backdrop-blur-md sm:flex sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="board-tutorial-title"
        className="mx-auto my-3 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl sm:my-0"
      >
        <div className="bg-gradient-to-br from-ledger-950 via-ledger-900 to-ledger-800 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gold-400">
                Week 1 board tour
              </p>
              <p className="mt-1 text-sm text-ledger-300">
                Practice here—nothing will be saved.
              </p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold">
              {step + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ledger-300">
              Mini practice board
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              <TutorialSpace
                icon="🚩"
                label="Start"
                active={tokenPosition === 0}
                token={tokenPosition === 0}
              />
              <PathArrow active={step >= 2} />
              <TutorialSpace
                icon={starCollected ? "⭐" : "💡"}
                label={starCollected ? "Star earned" : "Key mission"}
                active={tokenPosition === 1}
                token={tokenPosition === 1}
                highlighted={step >= 2}
              />
              <PathArrow active={starCollected} />
              <TutorialSpace
                icon={starCollected ? "🔓" : "🔒"}
                label="Next week"
                active={false}
                highlighted={starCollected}
              />
            </div>

            {missionOpened && !starCollected && (
              <div className="mt-4 animate-scale-in rounded-2xl border border-gold-400/40 bg-ledger-950/80 p-3">
                <p className="font-bold text-gold-400">Sample mission opened</p>
                <p className="mt-1 text-sm text-ledger-200">
                  Learn why every transaction has two sides. Then return to collect the star.
                </p>
              </div>
            )}
            {starCollected && (
              <div className="mt-4 animate-success-ring rounded-2xl border border-gold-400/50 bg-gold-400/15 p-3 text-center">
                <p className="font-black text-gold-400">⭐ Practice star collected!</p>
                <p className="mt-1 text-sm text-ledger-200">
                  In the real board, three key stars unlock the next week.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ledger-500">
            {current.eyebrow}
          </p>
          <h2
            id="board-tutorial-title"
            className="mt-2 text-balance text-2xl font-black leading-tight text-ledger-950 sm:text-3xl"
          >
            {current.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ledger-700">
            {current.body}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              className="rounded-xl px-4 py-3 text-sm font-bold text-ledger-600 hover:bg-ledger-50 disabled:invisible"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={advance}
              autoFocus
              className="min-h-12 rounded-xl bg-ledger-700 px-6 py-3 font-black text-white shadow-lg transition hover:bg-ledger-800"
            >
              {current.button} →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TutorialSpace({
  icon,
  label,
  active,
  token = false,
  highlighted = false,
}: {
  icon: string;
  label: string;
  active: boolean;
  token?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 px-2 text-center transition-all duration-500 ${
        highlighted
          ? "border-gold-400 bg-gold-400/15"
          : "border-white/20 bg-white/10"
      } ${active ? "ring-4 ring-white/20" : ""}`}
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="mt-1 text-[11px] font-black leading-tight text-white sm:text-xs">
        {label}
      </span>
      {token && (
        <span
          className="board-piece absolute -bottom-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gold-400 text-sm shadow-lg"
          aria-label="Your piece is here"
        >
          🧑‍💼
        </span>
      )}
    </div>
  );
}

function PathArrow({ active }: { active: boolean }) {
  return (
    <span
      className={`text-xl font-black transition-colors duration-500 ${
        active ? "text-gold-400" : "text-ledger-600"
      }`}
      aria-hidden="true"
    >
      →
    </span>
  );
}
