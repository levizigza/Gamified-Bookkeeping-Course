import type { ReactNode } from "react";
import Link from "next/link";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  badge?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`animate-fade-in-up ${className}`}>
      {backHref && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-ledger-600 transition-colors hover:text-ledger-900"
          >
            <span aria-hidden="true">←</span>
            {backLabel}
          </Link>
        </nav>
      )}
      {eyebrow && (
        <p className="text-sm font-medium text-ledger-500">{eyebrow}</p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-ledger-900 sm:text-4xl">
          {title}
        </h1>
        {badge}
      </div>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ledger-600 text-balance">
          {description}
        </p>
      )}
    </header>
  );
}

export function SectionHeader({
  title,
  description,
  className = "",
  id,
}: {
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 id={id} className="text-xl font-bold text-ledger-900">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-ledger-600">{description}</p>
      )}
    </div>
  );
}
