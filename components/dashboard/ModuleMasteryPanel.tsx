import type { ModuleProgress } from "@/lib/game/types";
import { MODULE_UNLOCK_THRESHOLD } from "@/lib/game/constants";
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
          <Card padding="md" className={mod.unlocked ? "" : "opacity-80"}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
                  Week {mod.week}
                </p>
                <p className="font-semibold text-ledger-900">{mod.title}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  mod.unlocked
                    ? "bg-ledger-100 text-ledger-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {mod.unlocked ? "Unlocked" : "Locked"}
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

            {!mod.unlocked && mod.lockMessage && (
              <p className="mt-2 text-xs text-amber-800">{mod.lockMessage}</p>
            )}

            {mod.unlocked && mod.masteryPercent < MODULE_UNLOCK_THRESHOLD && mod.week < 4 && (
              <p className="mt-2 text-xs text-ledger-600">
                Reach {MODULE_UNLOCK_THRESHOLD}% to unlock the next week.
              </p>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
