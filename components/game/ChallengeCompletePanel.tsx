import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/Card";

type StatItem = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

type ChallengeCompletePanelProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stats: StatItem[];
  passed?: boolean;
  children?: ReactNode;
  actions: ReactNode;
};

export function ChallengeCompletePanel({
  eyebrow,
  title,
  subtitle,
  stats,
  passed = true,
  children,
  actions,
}: ChallengeCompletePanelProps) {
  return (
    <Card
      padding="lg"
      className={`animate-scale-in overflow-hidden ${
        passed
          ? "border-ledger-300 bg-gradient-to-br from-white via-ledger-50/50 to-white"
          : "border-amber-300 bg-gradient-to-br from-white via-amber-50/30 to-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl animate-success-ring ${
            passed ? "bg-ledger-600 text-white" : "bg-amber-500 text-white"
          }`}
          aria-hidden="true"
        >
          {passed ? "✓" : "↻"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ledger-500">
            {eyebrow}
          </p>
          <CardTitle className="mt-1 text-2xl sm:text-3xl">{title}</CardTitle>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-ledger-600">{subtitle}</p>
          )}
        </div>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-4 text-center ${
              stat.highlight
                ? "bg-gold-400/15 ring-1 ring-gold-500/20"
                : "bg-ledger-50 ring-1 ring-ledger-200/60"
            }`}
          >
            <dt className="text-xs font-medium text-ledger-500">{stat.label}</dt>
            <dd
              className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                stat.highlight ? "text-gold-600" : "text-ledger-900"
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {children && <div className="mt-6">{children}</div>}

      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
    </Card>
  );
}
