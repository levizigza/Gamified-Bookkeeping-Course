"use client";

import { resetIntro } from "@/components/intro/OpeningAnimation";
import { Button } from "@/components/ui/Button";

export function ReplayIntroButton() {
  const handleReplay = () => {
    resetIntro();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleReplay}>
      🎬 Replay opening animation
    </Button>
  );
}
