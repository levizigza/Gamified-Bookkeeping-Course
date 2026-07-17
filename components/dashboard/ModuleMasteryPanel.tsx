import type { ModuleProgress } from "@/lib/game/types";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type ModuleMasteryPanelProps = {
  modules: ModuleProgress[];
};

export function ModuleMasteryPanel({ modules }: ModuleMasteryPanelProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {modules.map((mod) => (
        <li key={mod.moduleId}>
          <Card padding="md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
                  Week {mod.week}
                </p>
                <p className="font-semibold text-ledger-900">{mod.title}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  mod.masteryPercent > 0
                    ? "bg-ledger-100 text-ledger-700"
                    : "bg-ledger-100 text-ledger-500"
                }`}
              >
                {mod.masteryPercent > 0 ? "In progress" : "Not started"}
              </span>
            </div>

            <div className="mt-3">
              <ProgressBar
                value={mod.masteryPercent}
                label={`${mod.masteryPercent}% mastery`}
                size="sm"
              />
            </div>

            <p className="mt-2 text-xs text-ledger-500">
              {mod.challengesCompleted}/{mod.challengesTotal} key challenges · +{mod.xpEarned} XP
            </p>

            <p className="mt-2 text-xs text-ledger-600">
              {mod.masteryPercent >= 80
                ? "Learning target reached."
                : "Aim for 80% or higher on the key challenges."}
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
