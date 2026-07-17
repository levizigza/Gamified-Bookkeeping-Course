"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type KahootPlayer,
  type KahootQuestion,
  calcKahootPoints,
  simulateBotAnswer,
  shuffle,
  BOT_PERSONAS,
} from "@/lib/games/kahootEngine";
import { playSound } from "@/lib/audio/soundEngine";
import { Button } from "@/components/ui/Button";

const KAHOOT_COLORS = [
  "bg-red-500 hover:bg-red-600 border-red-700",
  "bg-blue-500 hover:bg-blue-600 border-blue-700",
  "bg-amber-400 hover:bg-amber-500 border-amber-600 text-ledger-950",
  "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
];

const KAHOOT_SHAPES = ["◆", "▲", "●", "■"];

type Phase = "lobby" | "countdown" | "question" | "reveal" | "leaderboard" | "done";

type KahootArenaProps = {
  questions: KahootQuestion[];
  title: string;
  onExit?: () => void;
};

export function KahootArena({ questions, title, onExit }: KahootArenaProps) {
  const [roundQuestions] = useState(() => shuffle(questions).slice(0, 8));
  const [bot] = useState(() => BOT_PERSONAS[Math.floor(Math.random() * BOT_PERSONAS.length)]);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [players, setPlayers] = useState<KahootPlayer[]>(() => [
    { id: "you", name: "You", score: 0, isBot: false, avatar: "⭐" },
    { id: bot.id, name: bot.name, score: 0, isBot: true, avatar: bot.avatar },
  ]);
  const botAnswered = useRef(false);

  const currentQ = roundQuestions[qIndex];

  const startRound = useCallback(() => {
    setPhase("countdown");
    setCountdown(3);
    setQIndex(0);
    setPlayers((p) => p.map((pl) => ({ ...pl, score: 0 })));
    setStreak(0);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("question");
      setTimeLeft(currentQ?.timeLimitSec ?? 15);
      botAnswered.current = false;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown, currentQ]);

  useEffect(() => {
    if (phase !== "question" || !currentQ) return;

    if (timeLeft <= 0) {
      setPhase("reveal");
      return;
    }

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, currentQ]);

  useEffect(() => {
    if (phase !== "question" || !currentQ || botAnswered.current) return;

    const { correct, responseTimeMs } = simulateBotAnswer(bot.skill, currentQ);
    const timer = setTimeout(() => {
      botAnswered.current = true;
      const botTimeLeft = Math.max(0, currentQ.timeLimitSec - responseTimeMs / 1000);
      const pts = calcKahootPoints(correct, botTimeLeft, currentQ.timeLimitSec, 0);
      setPlayers((p) =>
        p.map((pl) =>
          pl.isBot
            ? { ...pl, score: pl.score + pts, lastAnswerCorrect: correct }
            : pl,
        ),
      );
    }, responseTimeMs);

    return () => clearTimeout(timer);
  }, [phase, currentQ, bot.skill, qIndex]);

  const answer = (optionId: string) => {
    if (phase !== "question" || selected || !currentQ) return;
    setSelected(optionId);
    const opt = currentQ.options.find((o) => o.id === optionId);
    const correct = opt?.correct ?? false;
    const pts = calcKahootPoints(correct, timeLeft, currentQ.timeLimitSec, streak);

    if (correct) {
      setStreak((s) => s + 1);
      playSound("chaChing");
    } else {
      setStreak(0);
      playSound("ledgerClick");
    }

    setPlayers((p) =>
      p.map((pl) =>
        !pl.isBot
          ? { ...pl, score: pl.score + pts, lastAnswerCorrect: correct }
          : pl,
      ),
    );

    setTimeout(() => setPhase("reveal"), 400);
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= roundQuestions.length) {
      setPhase("done");
      playSound("successChime");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(roundQuestions[qIndex + 1]?.timeLimitSec ?? 15);
      botAnswered.current = false;
      setPhase("question");
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const youWon = sortedPlayers[0]?.id === "you";

  if (phase === "lobby") {
    return (
      <div className="kahoot-arena min-h-[480px] rounded-2xl bg-gradient-to-br from-ledger-900 via-ledger-950 to-ledger-900 p-6 text-white">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gold-400">Arena Mode</p>
          <h2 className="mt-2 text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-ledger-300">Kahoot-style quiz — compete against an AI bookkeeper!</p>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          {players.map((p) => (
            <div key={p.id} className="text-center animate-scale-in">
              <span className="text-4xl">{p.avatar}</span>
              <p className="mt-2 font-semibold">{p.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" onClick={startRound} className="min-w-[180px]">
            Start Battle
          </Button>
          {onExit && (
            <Button variant="secondary" size="lg" onClick={onExit}>
              Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="kahoot-arena flex min-h-[480px] items-center justify-center rounded-2xl bg-ledger-950">
        <span className="animate-scale-in text-8xl font-bold text-gold-400">
          {countdown || "GO!"}
        </span>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="kahoot-arena min-h-[480px] rounded-2xl bg-gradient-to-br from-ledger-900 to-ledger-950 p-8 text-white">
        <div className="text-center">
          <span className="text-5xl">{youWon ? "🏆" : "📊"}</span>
          <h2 className="mt-4 text-3xl font-bold">
            {youWon ? "You win!" : `${bot.name} wins!`}
          </h2>
          <p className="mt-2 text-ledger-300">
            {youWon
              ? "Great job — you outscored the bot on accounting knowledge."
              : "Keep practicing — review the explanations and try again."}
          </p>
        </div>

        <ol className="mx-auto mt-8 max-w-sm space-y-3">
          {sortedPlayers.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                i === 0 ? "bg-gold-500/20 ring-1 ring-gold-400" : "bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{p.avatar}</span>
                <span className="font-medium">{p.name}</span>
              </span>
              <span className="font-bold text-gold-400">{p.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={startRound}>Play Again</Button>
          {onExit && <Button variant="secondary" size="lg" onClick={onExit}>Back</Button>}
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const timerPercent = (timeLeft / currentQ.timeLimitSec) * 100;

  return (
    <div className="kahoot-arena min-h-[520px] rounded-2xl bg-gradient-to-b from-ledger-800 to-ledger-950 p-4 sm:p-6">
      {/* Timer bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-ledger-900">
        <div
          className="h-full rounded-full bg-gold-400 transition-all duration-1000 ease-linear"
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-ledger-300">
        <span>Q{qIndex + 1}/{roundQuestions.length}</span>
        <span className="font-mono text-lg font-bold text-white">{timeLeft}s</span>
        {streak > 1 && <span className="text-gold-400">🔥 {streak} streak</span>}
      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl bg-white p-5 text-center shadow-lg animate-fade-in-up">
        <p className="text-lg font-semibold text-ledger-900 sm:text-xl">{currentQ.prompt}</p>
        {currentQ.subPrompt && (
          <p className="mt-2 text-ledger-600">{currentQ.subPrompt}</p>
        )}
      </div>

      {/* Answer grid — Kahoot diamond layout */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {currentQ.options.map((opt, i) => {
          const isSelected = selected === opt.id;
          const showResult = phase === "reveal";
          const isCorrect = opt.correct;
          let extra = "";
          if (showResult && isCorrect) extra = "ring-4 ring-gold-400 scale-105";
          else if (showResult && isSelected && !isCorrect) extra = "opacity-50";
          else if (isSelected) extra = "scale-95";

          return (
            <button
              key={opt.id}
              type="button"
              disabled={phase !== "question" || !!selected}
              onClick={() => answer(opt.id)}
              className={`flex min-h-[80px] items-center justify-center gap-3 rounded-2xl border-b-4 px-4 py-4 text-lg font-bold text-white transition-all ${KAHOOT_COLORS[i]} ${extra}`}
            >
              <span className="text-2xl opacity-80">{KAHOOT_SHAPES[i]}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {phase === "reveal" && (
        <div className="mt-6 animate-fade-in-up">
          <div className="rounded-xl bg-white/10 p-4 text-white">
            <p className="text-sm font-medium text-gold-400">Explanation</p>
            <p className="mt-1 text-sm leading-relaxed">{currentQ.explanation}</p>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            {sortedPlayers.map((p) => (
              <div key={p.id} className="text-center text-white">
                <span className="text-2xl">{p.avatar}</span>
                <p className="text-xs">{p.score}</p>
                {p.lastAnswerCorrect !== undefined && (
                  <span>{p.lastAnswerCorrect ? "✓" : "✗"}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <Button size="lg" onClick={nextQuestion}>
              {qIndex + 1 >= roundQuestions.length ? "See Results" : "Next Question"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
