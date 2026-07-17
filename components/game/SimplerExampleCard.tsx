"use client";

import { useState } from "react";
import type { SimplerPracticeQuestion } from "@/lib/game/remediation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type SimplerExampleCardProps = {
  question: SimplerPracticeQuestion;
};

export function SimplerExampleCard({ question }: SimplerExampleCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card padding="md" className="border-ledger-300 bg-ledger-50/80">
      <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
        Simpler practice
      </p>
      <p className="mt-2 text-sm font-medium text-ledger-900">{question.prompt}</p>
      <p className="mt-2 text-xs text-ledger-500">{question.hint}</p>

      {!revealed ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setRevealed(true)}
        >
          Show model answer
        </Button>
      ) : (
        <div className="mt-4 rounded-lg bg-white px-4 py-3 text-sm text-ledger-800">
          <p className="font-semibold text-ledger-900">Model answer</p>
          <p className="mt-1 leading-relaxed">{question.answer}</p>
        </div>
      )}
    </Card>
  );
}
