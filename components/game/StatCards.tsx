import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { xpProgressInLevel } from "@/lib/game/xp";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  subtext?: string;
};

export function StatCard({ label, value, icon, subtext }: StatCardProps) {
  return (
    <Card className="card-surface flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ledger-600">{label}</span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-ledger-50 text-lg"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-ledger-900">{value}</p>
      {subtext && <p className="text-xs leading-relaxed text-ledger-500">{subtext}</p>}
    </Card>
  );
}

type XpCardProps = {
  xp: number;
  level: number;
  xpInLevel?: number;
  xpToNext?: number;
};

export function XpCard({ xp, level, xpInLevel, xpToNext }: XpCardProps) {
  const progress = xpProgressInLevel(xp);
  const current = xpInLevel ?? progress.current;
  const max = xpToNext ?? progress.max;
  const levelPercent = max > 0 ? Math.round((current / max) * 100) : 0;

  return (
    <Card className="card-surface overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ledger-600">Experience</p>
          <p className="text-2xl font-bold tabular-nums text-ledger-900">Level {level}</p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-xl"
          aria-hidden="true"
        >
          ⭐
        </span>
      </div>
      <ProgressBar value={levelPercent} showPercent={false} size="sm" />
      <p className="mt-2 text-xs text-ledger-500">
        <span className="font-medium text-ledger-700">{xp} XP</span> · {current} / {max} to level{" "}
        {level + 1}
      </p>
      <p className="mt-1 text-xs text-ledger-500">
        XP means experience points earned from learning activities.
      </p>
    </Card>
  );
}

type StreakCardProps = {
  days: number;
  answerStreak?: number;
};

export function StreakCard({ days, answerStreak }: StreakCardProps) {
  return (
    <StatCard
      label="Current streak"
      value={`${days} days`}
      icon="🔥"
      subtext={
        answerStreak && answerStreak >= 3
          ? `${answerStreak} correct in a row — streak bonus active`
          : days > 0
            ? "Keep opening the books daily"
            : "Start your streak today"
      }
    />
  );
}

type MasteryCardProps = {
  percent: number;
};

export function MasteryCard({ percent }: MasteryCardProps) {
  return (
    <Card className="card-surface">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ledger-600">Mastery</p>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-ledger-50 text-lg"
          aria-hidden="true"
        >
          🎯
        </span>
      </div>
      <p className="mb-2 text-2xl font-bold tabular-nums text-ledger-900">{percent}%</p>
      <ProgressBar value={percent} showPercent={false} size="sm" />
      <p className="mt-2 text-xs text-ledger-500">
        {percent >= 80 ? "You reached the 80% learning target." : "Aim for the 80% learning target."}
      </p>
    </Card>
  );
}
