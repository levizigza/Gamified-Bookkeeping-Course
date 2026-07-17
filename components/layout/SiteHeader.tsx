import Link from "next/link";
import { SiteHeaderNav } from "@/components/layout/SiteHeaderNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ledger-200/80 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-ledger-900 transition-colors hover:text-ledger-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ledger-600 to-ledger-700 text-sm font-bold text-white shadow-sm shadow-ledger-600/20">
            LQ
          </span>
          <span className="hidden sm:inline">Ledger Quest</span>
        </Link>

        <SiteHeaderNav />
      </div>
    </header>
  );
}
