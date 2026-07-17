import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CourseCertificateProps = {
  businessName: string;
  ownerName?: string;
  completionDate: string;
  masteryPercent: number;
  badgesEarned: number;
  totalBadges: number;
};

export function CourseCertificate({
  businessName,
  ownerName = "Business Owner",
  completionDate,
  masteryPercent,
  badgesEarned,
  totalBadges,
}: CourseCertificateProps) {
  const qualified = masteryPercent >= 80;

  return (
    <div className="animate-fade-in-up">
      <Card
        padding="lg"
        className="relative overflow-hidden border-2 border-ledger-300 bg-gradient-to-br from-white via-ledger-50/80 to-gold-400/5"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ledger-200/30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gold-400/10"
          aria-hidden="true"
        />

        <div className="relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ledger-500">
            Ledger Quest
          </p>
          <h1 className="mt-2 text-2xl font-bold text-ledger-900 sm:text-3xl">
            Certificate of Completion
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-ledger-400 to-transparent" />

          <p className="mt-6 text-sm text-ledger-600">This certifies that</p>
          <p className="mt-1 text-xl font-semibold text-ledger-900">{ownerName}</p>
          <p className="mt-4 text-sm leading-relaxed text-ledger-600">
            has successfully completed the bookkeeping curriculum for
          </p>
          <p className="mt-1 text-lg font-bold text-ledger-800">{businessName}</p>

          <dl className="mx-auto mt-8 grid max-w-md gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white/80 px-3 py-3 ring-1 ring-ledger-200/80">
              <dt className="text-xs text-ledger-500">Mastery</dt>
              <dd className="text-xl font-bold text-ledger-900">{masteryPercent}%</dd>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-3 ring-1 ring-ledger-200/80">
              <dt className="text-xs text-ledger-500">Badges</dt>
              <dd className="text-xl font-bold text-ledger-900">
                {badgesEarned}/{totalBadges}
              </dd>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-3 ring-1 ring-ledger-200/80">
              <dt className="text-xs text-ledger-500">Completed</dt>
              <dd className="text-sm font-semibold text-ledger-900">{completionDate}</dd>
            </div>
          </dl>

          {qualified ? (
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ledger-700">
              Demonstrated proficiency in double-entry bookkeeping, financial reporting,
              and year-end adjustments — ready for accountant handoff.
            </p>
          ) : (
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-amber-800">
              Keep practicing to reach 80% mastery and unlock your full certificate.
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard">
              <Button>{qualified ? "Continue practicing" : "Back to dashboard"}</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">View profile</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
