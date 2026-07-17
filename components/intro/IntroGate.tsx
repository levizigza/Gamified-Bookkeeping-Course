"use client";

import { useState } from "react";
import { OpeningAnimation } from "@/components/intro/OpeningAnimation";
import { CourseMenuScreen } from "@/components/course/CourseMenuScreen";

type IntroGateProps = {
  children: React.ReactNode;
};

type GatePhase = "intro" | "menu" | "app";

export function IntroGate({ children }: IntroGateProps) {
  const [phase, setPhase] = useState<GatePhase>("intro");
  const blocking = phase !== "app";

  return (
    <>
      {phase === "intro" && <OpeningAnimation onComplete={() => setPhase("menu")} />}
      {phase === "menu" && <CourseMenuScreen onEnterCourse={() => setPhase("app")} />}
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
