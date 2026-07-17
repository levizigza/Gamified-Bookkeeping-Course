import Link from "next/link";
import type { Challenge } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type NextChallengeCardProps = {
  challenge: Challenge;
};

export function NextChallengeCard({ challenge }: NextChallengeCardProps) {
  return (
    <Card className="card-surface overflow-hidden border-ledger-300 bg-gradient-to-br from-ledger-50/80 via-white to-gold-400/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
            Up next
          </p>
          <CardTitle className="mt-1">{challenge.title}</CardTitle>
          <CardDescription className="mt-1">{challenge.description}</CardDescription>
          <p className="mt-3 inline-flex items-center rounded-full bg-gold-400/15 px-2.5 py-0.5 text-sm font-semibold text-gold-600">
            +{challenge.xpReward} XP
          </p>
        </div>
        <Link href={`/challenges/${challenge.id}`} className="shrink-0">
          <Button size="lg" className="w-full sm:w-auto">
            Start challenge
          </Button>
        </Link>
      </div>
    </Card>
  );
}
