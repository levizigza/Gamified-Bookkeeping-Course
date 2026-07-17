"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CanvasIntroScene } from "@/components/intro/CanvasIntroScene";
import {
  playSound,
  resumeAudio,
  scheduleIntroSounds,
  startAmbientMusic,
  stopAmbientMusic,
  setAudioMuted,
} from "@/lib/audio/soundEngine";
import { Button } from "@/components/ui/Button";

type OpeningAnimationProps = {
  onComplete: () => void;
};

export function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [muted, setMuted] = useState(false);
  const [soundActivated, setSoundActivated] = useState(false);
  const [exiting, setExiting] = useState(false);
  const soundUnlocked = useRef(false);
  const readyToEnter = phase >= 5;

  const finish = useCallback(() => {
    setExiting(true);
    stopAmbientMusic();
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    const cancelSounds = scheduleIntroSounds((p) => {
      setPhase(p);
    });

    return () => {
      cancelSounds();
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

  const handleEnter = useCallback(() => {
    if (!readyToEnter) return;
    playSound("successChime", 0.7);
    finish();
  }, [finish, readyToEnter]);

  const handleSkipToEntry = useCallback(() => {
    playSound("whoosh", 0.5);
    setPhase(5);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && readyToEnter) handleEnter();
      if (e.key === "Escape" && !readyToEnter) handleSkipToEntry();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleEnter, handleSkipToEntry, readyToEnter]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) resumeAudio();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-ledger-950 transition-opacity duration-500 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Ledger Quest opening animation"
      aria-modal="true"
      onPointerDown={activateSound}
    >
      <CanvasIntroScene phase={phase} className="absolute inset-0 bg-ledger-950" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ledger-950/75 to-transparent" />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
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
            className="animate-pulse rounded-xl border border-gold-400/50 bg-gold-400/15 px-4 py-2 text-sm font-semibold text-gold-400 backdrop-blur-sm transition hover:bg-gold-400/25"
          >
            🔊 Tap for music
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkipToEntry();
          }}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Skip to entry
        </button>
      </div>

      {readyToEnter && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ledger-950/35 px-6 backdrop-blur-[2px] animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-gold-400/45 bg-ledger-950/85 px-7 py-8 text-center shadow-[0_0_70px_rgba(61,140,109,0.35)] backdrop-blur-xl sm:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gold-400">
              Filing complete
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Your books are ready.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-ledger-300 sm:text-base">
              Your numbers, organized. Your business, understood.
            </p>
            <Button
              size="lg"
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="mt-7 min-w-[230px] shadow-glow-gold animate-pulse"
            >
              Press Enter to enter
            </Button>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ledger-500">
              Enter key required
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function resetIntro(): void {
  window.location.reload();
}
