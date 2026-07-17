"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CanvasIntroScene } from "@/components/intro/CanvasIntroScene";
import { VintageCalculatorIntro } from "@/components/intro/VintageCalculatorIntro";
import {
  playSound,
  resumeAudio,
  scheduleIntroSounds,
  startAmbientMusic,
  stopAmbientMusic,
  setAudioMuted,
} from "@/lib/audio/soundEngine";
import { clearCourseEntered } from "@/lib/data/introGate";

type OpeningAnimationProps = {
  onComplete: () => void;
};

type IntroStage = "filing" | "sale";
type SaleStatus = "ready" | "posting" | "complete";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [stage, setStage] = useState<IntroStage>(() =>
    prefersReducedMotion() ? "sale" : "filing",
  );
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? 5 : 0));
  const [saleStatus, setSaleStatus] = useState<SaleStatus>("ready");
  const [muted, setMuted] = useState(false);
  const [soundActivated, setSoundActivated] = useState(false);
  const [exiting, setExiting] = useState(false);
  const soundUnlocked = useRef(false);
  const exitingRef = useRef(false);
  const timers = useRef<number[]>([]);
  const cancelSoundsRef = useRef<(() => void) | null>(null);
  const stageRef = useRef<IntroStage>(stage);
  const saleStatusRef = useRef<SaleStatus>(saleStatus);
  stageRef.current = stage;
  saleStatusRef.current = saleStatus;

  const finish = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    cancelSoundsRef.current?.();
    cancelSoundsRef.current = null;
    stopAmbientMusic();
    timers.current.push(window.setTimeout(onComplete, 550));
  }, [onComplete]);

  const goToSale = useCallback(() => {
    if (stageRef.current === "sale") return;
    cancelSoundsRef.current?.();
    cancelSoundsRef.current = null;
    setPhase(5);
    stageRef.current = "sale";
    setStage("sale");
    saleStatusRef.current = "ready";
    setSaleStatus("ready");
    playSound("whoosh", 0.45);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (media.matches && stageRef.current === "filing") {
        goToSale();
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [goToSale]);

  useEffect(() => {
    if (stage !== "filing") return;

    const cancelSounds = scheduleIntroSounds((nextPhase) => {
      setPhase(nextPhase);
      if (nextPhase >= 5) {
        timers.current.push(
          window.setTimeout(() => {
            if (stageRef.current === "filing") goToSale();
          }, 700),
        );
      }
    });
    cancelSoundsRef.current = cancelSounds;

    return () => {
      cancelSounds();
      if (cancelSoundsRef.current === cancelSounds) {
        cancelSoundsRef.current = null;
      }
    };
  }, [goToSale, stage]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      cancelSoundsRef.current?.();
      stopAmbientMusic();
    };
  }, []);

  const activateSound = useCallback(() => {
    if (soundUnlocked.current && !muted) {
      resumeAudio();
      return;
    }
    resumeAudio();
    setAudioMuted(false);
    setMuted(false);
    setSoundActivated(true);
    soundUnlocked.current = true;
    startAmbientMusic();
    playSound("whoosh", 0.5);
  }, [muted]);

  const handleSaleEnter = useCallback(() => {
    if (stageRef.current !== "sale" || saleStatusRef.current !== "ready") return;
    saleStatusRef.current = "posting";
    activateSound();
    setSaleStatus("posting");
    playSound("navClick", 0.55);
    timers.current.push(
      window.setTimeout(() => {
        saleStatusRef.current = "complete";
        setSaleStatus("complete");
        playSound("chaChing", 0.85);
      }, 650),
      window.setTimeout(finish, 1450),
    );
  }, [activateSound, finish]);

  const handleSkip = useCallback(() => {
    if (stageRef.current === "filing") {
      activateSound();
      goToSale();
      return;
    }
    finish();
  }, [activateSound, finish, goToSale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (stageRef.current === "sale") handleSaleEnter();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSaleEnter, handleSkip]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) resumeAudio();
  };

  const skipLabel = stage === "filing" ? "Skip to sale" : "Skip intro";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-ledger-950 transition-opacity duration-500 motion-reduce:transition-none ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label={
        stage === "filing"
          ? "Ledger Quest opening animation"
          : "Ledger Quest first sale"
      }
      aria-modal="true"
      onPointerDown={activateSound}
    >
      {stage === "filing" ? (
        <>
          <CanvasIntroScene phase={phase} className="absolute inset-0 bg-ledger-950" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ledger-950/75 to-transparent" />
          <p className="sr-only" aria-live="polite">
            {phase < 2
              ? "Accountants preparing the ledger."
              : phase < 5
                ? "Filing documents into the cabinet."
                : "Filing complete. Preparing the first sale."}
          </p>
        </>
      ) : (
        <VintageCalculatorIntro status={saleStatus} onEnter={handleSaleEnter} />
      )}

      <div className="absolute right-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-2 sm:right-6 sm:top-6">
        {soundActivated ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              activateSound();
            }}
            className="animate-pulse rounded-xl border border-gold-400/50 bg-gold-400/15 px-3 py-2 text-sm font-semibold text-gold-400 backdrop-blur-sm transition hover:bg-gold-400/25 motion-reduce:animate-none sm:px-4"
          >
            🔊 Tap for music
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-4"
        >
          {skipLabel}
        </button>
      </div>
    </div>
  );
}

export function resetIntro(): void {
  clearCourseEntered();
  window.location.href = "/";
}
