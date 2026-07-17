import type { Badge } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type BadgeGridProps = {
  badges: Badge[];
  title?: string;
  emptyMessage?: string;
};

export function BadgeGrid({
  badges,
  title = "Badges",
  emptyMessage = "No badges earned yet.",
}: BadgeGridProps) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const earnedPercent = badges.length > 0 ? Math.round((earned.length / badges.length) * 100) : 0;

  if (badges.length === 0) {
    return (
      <EmptyState
        icon="🏅"
        title="No badges yet"
        description={emptyMessage}
      />
    );
  }

  return (
    <Card className="card-surface">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {earned.length} of {badges.length} earned
          </CardDescription>
        </div>
        <div className="w-full min-w-[8rem] max-w-[10rem] sm:w-auto">
          <ProgressBar value={earnedPercent} label="Collection" size="sm" />
        </div>
      </div>

      {earned.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ledger-500">
            Earned
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {earned.map((badge) => (
              <li key={badge.id}>
                <BadgeItem badge={badge} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {locked.length > 0 && (
        <div className={earned.length > 0 ? "mt-6" : "mt-6"}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ledger-500">
            Locked
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {locked.map((badge) => (
              <li key={badge.id}>
                <BadgeItem badge={badge} locked />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

type BadgeItemProps = {
  badge: Badge;
  locked?: boolean;
};

function BadgeItem({ badge, locked = false }: BadgeItemProps) {
  return (
    <div
      className={`group flex flex-col items-center rounded-xl border p-3 text-center transition-all ${
        locked
          ? "border-ledger-100 bg-ledger-50/80 opacity-70"
          : "border-gold-500/25 bg-gradient-to-b from-gold-400/10 to-white shadow-sm hover:border-gold-500/40 hover:shadow-md"
      }`}
      title={badge.description}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${
          locked ? "bg-ledger-100 grayscale" : "bg-white ring-1 ring-gold-500/20"
        }`}
        aria-hidden="true"
      >
        {locked ? "🔒" : badge.icon}
      </span>
      <span className="mt-2 text-xs font-semibold leading-tight text-ledger-800">
        {badge.name}
      </span>
      {!locked && (
        <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-ledger-500">
          {badge.description}
        </span>
      )}
    </div>
  );
}
