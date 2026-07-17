"use client";

import { useState } from "react";
import Link from "next/link";
import type { RemediationWeakAreaId } from "@/lib/game/remediation";
import { getRemediationContent } from "@/lib/game/remediation";
import { SimplerExampleCard } from "@/components/game/SimplerExampleCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type RemediationFeedbackProps = {
  weakAreaId: RemediationWeakAreaId;
  /** Challenge-specific feedback shown above remediation content. */
  detail?: string;
  onRetry: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  showContinue?: boolean;
};

export function RemediationFeedback({
  weakAreaId,
  detail,
  onRetry,
  onContinue,
  continueLabel = "Try again",
  showContinue = false,
}: RemediationFeedbackProps) {
  const [showSimpler, setShowSimpler] = useState(false);
  const content = getRemediationContent(weakAreaId);

  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <p className="text-lg font-bold text-amber-900" role="status">
        Not quite — and that is okay
      </p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
        {content.encouragement}
      </p>

      {detail && (
        <p className="mt-3 text-sm text-ledger-700">{detail}</p>
      )}

      <div className="mt-4 rounded-xl bg-white/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
          What to focus on
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ledger-800">
          {content.explanation}
        </p>
        <p className="mt-3 text-sm text-ledger-600">
          <span className="font-semibold text-ledger-800">Tip: </span>
          {content.tip}
        </p>
        <Link
          href={`/lessons/${content.lessonId}`}
          className="mt-3 inline-block text-sm font-medium text-ledger-700 underline hover:text-ledger-900"
        >
          Review: {content.lessonTitle} →
        </Link>
      </div>

      {!showSimpler ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setShowSimpler(true)}
        >
          Try a simpler example
        </Button>
      ) : (
        <div className="mt-4">
          <SimplerExampleCard question={content.simplerQuestion} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onRetry} size="lg">
          {continueLabel}
        </Button>
        {showContinue && onContinue && (
          <Button onClick={onContinue} variant="ghost" size="lg">
            Skip for now
          </Button>
        )}
      </div>
    </Card>
  );
}
