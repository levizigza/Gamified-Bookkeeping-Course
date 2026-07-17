import type { ReactNode } from "react";

export type NavSymbolId = "dashboard" | "games" | "arcade" | "reports" | "tools" | "profile";

type SymbolConfig = {
  label: string;
  outline: string;
  icon: ReactNode;
};

export const NAV_SYMBOLS: Record<NavSymbolId, SymbolConfig> = {
  dashboard: {
    label: "Dashboard",
    outline: "rounded-2xl border-2 border-ledger-400/60 bg-gradient-to-br from-ledger-100 to-ledger-50",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  games: {
    label: "Games",
    outline: "rounded-full border-2 border-gold-500/50 bg-gradient-to-br from-gold-400/20 to-gold-500/10",
    icon: <span className="text-lg leading-none">🎮</span>,
  },
  arcade: {
    label: "Arcade",
    outline: "rounded-xl border-2 border-ledger-700/40 bg-gradient-to-br from-ledger-800/10 to-gold-400/15",
    icon: <span className="text-lg leading-none">🕹️</span>,
  },
  reports: {
    label: "Reports",
    outline: "rounded-lg border-2 border-ledger-500/40 bg-white shadow-sm",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
        <path d="M8 4V2h8v2" />
      </svg>
    ),
  },
  tools: {
    label: "Tools",
    outline: "rounded-xl border-2 border-ledger-300 bg-ledger-50 rotate-0",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2 2-3.1-3.1 2-2z" />
      </svg>
    ),
  },
  profile: {
    label: "Profile",
    outline: "rounded-full border-2 border-ledger-600/30 bg-gradient-to-b from-ledger-200 to-ledger-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
};

/** Dollar-bill shaped frame for money-related content */
export function DollarBillFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-ledger-500/30 bg-gradient-to-br from-ledger-100 via-ledger-50 to-gold-400/10 px-4 py-3 shadow-sm ${className}`}
    >
      <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-ledger-300/40">
        $
      </div>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-ledger-300/40">
        $
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
