import Link from "next/link";
import type { RecommendedPractice as RecommendedPracticeType } from "@/lib/game/remediation";
import { SimplerExampleCard } from "@/components/game/SimplerExampleCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type RecommendedPracticeProps = {
  practice: RecommendedPracticeType | null;
};

export function RecommendedPractice({ practice }: RecommendedPracticeProps) {
  if (!practice) return null;

  const { weakArea, encouragement } = practice;

  return (
    <Card padding="lg" className="border-ledger-300 bg-gradient-to-br from-ledger-50 to-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
        Recommended practice
      </p>
      <CardTitle className="mt-1 text-xl">{weakArea.label}</CardTitle>
      <CardDescription className="mt-2 text-sm leading-relaxed text-ledger-700">
        {encouragement}
      </CardDescription>

      <SimplerExampleCard question={weakArea.simplerQuestion} />

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/lessons/${weakArea.lessonId}`}>
          <Button>Review {weakArea.lessonTitle}</Button>
        </Link>
      </div>
    </Card>
  );
}
