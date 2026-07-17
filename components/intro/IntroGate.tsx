"use client";

import { useEffect, useState } from "react";
import { OpeningAnimation } from "@/components/intro/OpeningAnimation";
import { CourseMenuScreen } from "@/components/course/CourseMenuScreen";
import { hasEnteredCourse, markCourseEntered } from "@/lib/data/introGate";

type IntroGateProps = {
  children: React.ReactNode;
};

type GatePhase = "intro" | "menu" | "app";

export function IntroGate({ children }: IntroGateProps) {
  // Default to the app so a stalled client never traps learners on a blank splash.
  const [phase, setPhase] = useState<GatePhase>("app");
  const [checked, setChecked] = useState(false);
  const blocking = checked && phase !== "app";

  useEffect(() => {
    setPhase(hasEnteredCourse() ? "app" : "intro");
    setChecked(true);
  }, []);

  const enterCourse = () => {
    markCourseEntered();
    setPhase("app");
  };

  return (
    <>
      {checked && phase === "intro" && (
        <OpeningAnimation onComplete={() => setPhase("menu")} />
      )}
      {checked && phase === "menu" && <CourseMenuScreen onEnterCourse={enterCourse} />}
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
