"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CourseCertificate } from "@/components/game/CourseCertificate";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { loadBoardState } from "@/lib/data/boardProgress";

type CertificateGateProps = {
  businessName: string;
  ownerName: string;
  completionDate: string;
  masteryPercent: number;
  badgesEarned: number;
  totalBadges: number;
};

export function CertificateGate(props: CertificateGateProps) {
  const [finished, setFinished] = useState<boolean | null>(null);

  useEffect(() => {
    const board = loadBoardState();
    setFinished(board.finishedRunnerIds.includes("player"));
  }, []);

  if (finished === null) {
    return (
      <p className="py-12 text-center text-sm text-ledger-600">
        Checking your board progress…
      </p>
    );
  }

  if (!finished) {
    return (
      <EmptyState
        icon="🏆"
        title="Your certificate unlocks at the finish"
        description="Complete the Week 4 key missions and move your piece to the trophy space. The certificate will appear here automatically."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/board">
              <Button>Return to the board</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">View challenge scores</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return <CourseCertificate {...props} />;
}
