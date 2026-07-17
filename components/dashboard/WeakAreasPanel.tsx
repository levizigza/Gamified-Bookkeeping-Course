import Link from "next/link";
import type { WeakArea } from "@/lib/game/types";
import { Card } from "@/components/ui/Card";

type WeakAreasPanelProps = {
  weakAreas: WeakArea[];
};

export function WeakAreasPanel({ weakAreas }: WeakAreasPanelProps) {
  return (
    <ul className="space-y-3">
      {weakAreas.map((area) => (
        <li key={area.category}>
          <Card padding="sm" className="border-amber-200 bg-amber-50/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ledger-900">{area.label}</p>
                <p className="mt-1 text-sm text-ledger-700">{area.recommendation}</p>
                <p className="mt-2 text-sm text-ledger-600">
                  <span className="font-medium text-ledger-800">Tip: </span>
                  {area.tip}
                </p>
                <Link
                  href={`/lessons/${area.lessonId}`}
                  className="mt-2 inline-block text-sm font-medium text-ledger-700 underline hover:text-ledger-900"
                >
                  Review: {area.lessonTitle} →
                </Link>
              </div>
              <span className="shrink-0 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
                {area.missCount}×
              </span>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
