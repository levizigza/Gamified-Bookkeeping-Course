import Link from "next/link";
import type { World } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { AccountingTypewriter } from "@/components/visuals/AccountingTypewriter";
import { ConceptVisual, type ConceptVisualVariant } from "@/components/visuals/ConceptVisual";

type WorldCardProps = {
  world: World;
  lockMessage?: string;
};

const WORLD_VISUALS: Record<string, { showTypewriter?: boolean; accentClass: string; variant: ConceptVisualVariant }> = {
  "daily-ledger": { showTypewriter: true, accentClass: "from-ledger-100/80 to-transparent", variant: "ledger" },
  "account-sorter": { accentClass: "from-purple-100/60 to-transparent", variant: "sorter" },
  "reports-room": { accentClass: "from-blue-100/60 to-transparent", variant: "reports" },
  "year-end-boss": { accentClass: "from-rose-100/60 to-transparent", variant: "boss" },
};

export function WorldCard({ world, lockMessage }: WorldCardProps) {
  const visual = WORLD_VISUALS[world.id] ?? {
    accentClass: "from-ledger-100/60 to-transparent",
    variant: "ledger" as const,
  };

  return (
    <Card
      className={`card-surface-interactive relative overflow-hidden ${
        world.unlocked ? "" : "opacity-80"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${visual.accentClass}`}
        aria-hidden="true"
      />

      {visual.showTypewriter && world.unlocked && (
        <div className="absolute right-3 top-3 h-16 w-24 opacity-70">
          <AccountingTypewriter active />
        </div>
      )}
      {!visual.showTypewriter && world.unlocked && (
        <div className="absolute -right-3 -top-2 h-24 w-32 opacity-55">
          <ConceptVisual variant={visual.variant} className="h-full w-full" />
        </div>
      )}

      {!world.unlocked && (
        <div className="absolute right-4 top-4 rounded-full bg-ledger-100 px-2.5 py-0.5 text-xs font-semibold text-ledger-600">
          Locked
        </div>
      )}
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            world.unlocked
              ? "bg-gradient-to-br from-ledger-100 to-ledger-50 ring-1 ring-ledger-200/60"
              : "bg-ledger-50 grayscale"
          }`}
          aria-hidden="true"
        >
          {world.unlocked ? world.icon : "🔒"}
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle>{world.name}</CardTitle>
          <CardDescription>{world.subtitle}</CardDescription>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-ledger-600">{world.description}</p>

      {world.unlocked && (
        <ProgressBar
          value={world.progressPercent}
          label="World progress"
          className="mb-4"
          size="sm"
        />
      )}

      {world.unlocked ? (
        <Link href="/board" className="block">
          <Button
            variant={world.progressPercent > 0 ? "primary" : "outline"}
            size="sm"
            className="w-full"
          >
            {world.progressPercent > 0 ? "Continue on the board" : "Open the board"}
          </Button>
        </Link>
      ) : (
        <p className="rounded-lg bg-ledger-50 px-3 py-2 text-center text-xs text-ledger-500">
          {lockMessage ?? "Collect the key stars on the board to unlock this week"}
        </p>
      )}
    </Card>
  );
}
