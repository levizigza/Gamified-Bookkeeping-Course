import { Suspense } from "react";
import Link from "next/link";
import { SideArcade } from "@/components/games/arcade/SideArcade";

export const metadata = {
  title: "Side Arcade — Ledger Quest",
  description: "Client showcase of kinesthetic bookkeeping games.",
};

export default function SideArcadePage() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-3 text-sm">
        <Link href="/games" className="text-ledger-600 hover:text-ledger-900">
          ← Games hub
        </Link>
        <Link href="/dashboard" className="text-ledger-500 hover:text-ledger-800">
          Dashboard
        </Link>
      </nav>

      <Suspense
        fallback={
          <div className="flex min-h-[480px] items-center justify-center rounded-3xl bg-ledger-950 text-ledger-200">
            Loading Side Arcade…
          </div>
        }
      >
        <SideArcade />
      </Suspense>
    </div>
  );
}
