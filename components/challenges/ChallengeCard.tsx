import Link from "next/link";
import type { Challenge } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ChallengeCardProps = {
  challenge: Challenge;
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{challenge.title}</CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
          <p className="mt-2 text-sm text-gold-600 font-medium">
            +{challenge.xpReward} XP
            {challenge.completed && (
              <span className="ml-2 text-ledger-600">· Completed</span>
            )}
          </p>
        </div>
        <Link href={`/challenges/${challenge.id}`}>
          <Button variant={challenge.completed ? "outline" : "primary"} size="sm">
            {challenge.completed ? "Review" : "Start"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

type ChallengePlaceholderProps = {
  title: string;
  description: string;
};

export function ChallengePlaceholder({ title, description }: ChallengePlaceholderProps) {
  return (
    <Card className="border-dashed border-ledger-300 bg-ledger-50/50">
      <CardTitle>{title}</CardTitle>
      <CardDescription className="mt-2">{description}</CardDescription>
      <p className="mt-4 rounded-lg bg-white p-4 text-sm text-ledger-600">
        Interactive challenge UI coming soon. For now, explore the lesson content
        and review the feedback model in the technical plan.
      </p>
    </Card>
  );
}
