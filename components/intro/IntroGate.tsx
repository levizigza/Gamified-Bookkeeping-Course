"use client";

import { useState } from "react";
import { OpeningAnimation } from "@/components/intro/OpeningAnimation";

type IntroGateProps = {
  children: React.ReactNode;
};

export function IntroGate({ children }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && (
        <OpeningAnimation onComplete={() => setShowIntro(false)} />
      )}
      <div
        className={showIntro ? "overflow-hidden" : undefined}
        aria-hidden={showIntro || undefined}
        inert={showIntro || undefined}
      >
        {children}
      </div>
    </>
  );
}
