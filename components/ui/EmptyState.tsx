import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon = "📋",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Card
      padding="lg"
      className={`border-dashed border-ledger-300 bg-ledger-50/50 text-center ${className}`}
    >
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ledger-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ledger-600">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  );
}
