"use client";

import { useEffect, useState } from "react";
import { OpeningAnimation } from "@/components/intro/OpeningAnimation";
import { CourseMenuScreen } from "@/components/course/CourseMenuScreen";
import { clearCourseEntered, markCourseEntered } from "@/lib/data/introGate";

type IntroGateProps = {
  children: React.ReactNode;
};

type GatePhase = "intro" | "menu" | "app";

export function IntroGate({ children }: IntroGateProps) {
  // Always open with the intro on a fresh page load — never skip permanently.
  const [phase, setPhase] = useState<GatePhase | null>(null);
  const blocking = phase !== "app";

  useEffect(() => {
    // Drop any legacy "already entered" flags from older builds.
    clearCourseEntered();
    setPhase("intro");
  }, []);

  const enterCourse = () => {
    markCourseEntered();
    setPhase("app");
  };

  if (phase === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ledger-950 text-sm text-ledger-300">
        Opening Ledger Quest…
      </div>
    );
  }

  return (
    <>
      {phase === "intro" && (
        <OpeningAnimation onComplete={() => setPhase("menu")} />
      )}
      {phase === "menu" && <CourseMenuScreen onEnterCourse={enterCourse} />}
      <div
        className={blocking ? "overflow-hidden" : undefined}
        aria-hidden={blocking || undefined}
        inert={blocking || undefined}
      >
        {children}
      </div>
    </>
  );
}
