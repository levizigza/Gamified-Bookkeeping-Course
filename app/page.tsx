import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConceptVisual, type ConceptVisualVariant } from "@/components/visuals/ConceptVisual";

const worlds = [
  {
    week: 1,
    title: "Daily Ledger",
    description: "Record real transactions with double-entry accuracy.",
    progress: 65,
    icon: "📒",
    visual: "ledger" as ConceptVisualVariant,
  },
  {
    week: 2,
    title: "Account Sorter",
    description: "Classify spending and build a trial balance that balances.",
    progress: 40,
    icon: "🗂️",
    visual: "sorter" as ConceptVisualVariant,
  },
  {
    week: 3,
    title: "Reports Room",
    description: "Turn your books into P&L and Balance Sheet insights.",
    progress: 0,
    icon: "📊",
    visual: "reports" as ConceptVisualVariant,
  },
  {
    week: 4,
    title: "Year-End Boss Fight",
    description: "Master depreciation, home office, and mileage before tax season.",
    progress: 0,
    icon: "⚔️",
    visual: "boss" as ConceptVisualVariant,
  },
];

const pillars = [
  {
    title: "Learn by doing",
    description: "Every lesson connects to Bright Path Consulting — a solo firm in Calgary, June 2024.",
  },
  {
    title: "Instant feedback",
    description: "Wrong answers trigger targeted remediation, not generic red X marks.",
  },
  {
    title: "Real outcomes",
    description: "Finish with statements you could hand to an accountant.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(245,200,66,0.12),transparent_45%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-8 top-8 h-40 w-40 opacity-20 sm:opacity-30"
          aria-hidden="true"
        >
          <svg viewBox="0 0 120 80" className="h-full w-full animate-receipt-print" fill="none">
            <rect x="20" y="10" width="80" height="60" rx="4" fill="#fffef5" stroke="#bbddce" strokeWidth="2" />
            <line x1="30" y1="25" x2="90" y2="25" stroke="#dceee6" strokeWidth="2" />
            <line x1="30" y1="35" x2="80" y2="35" stroke="#dceee6" strokeWidth="2" />
            <line x1="30" y1="45" x2="70" y2="45" stroke="#dceee6" strokeWidth="2" />
            <text x="30" y="60" fontSize="10" fill="#2d7057" fontFamily="sans-serif">Books Balanced ✓</text>
          </svg>
        </div>
        <div className="relative mx-auto max-w-4xl text-center animate-fade-in-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ledger-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-ledger-700 shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-ledger-500" aria-hidden="true" />
            Bookkeeping for business owners
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-ledger-950 sm:text-5xl lg:text-6xl">
            Your numbers, organized.
            <br />
            <span className="text-ledger-600">Your business, understood.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ledger-700 sm:text-xl">
            Ledger Quest is a business simulator disguised as a fintech learning app.
            No accounting background required — just curiosity and a willingness to practice.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">Start your journey</Button>
            </Link>
            <Link href="/lessons/lesson-why-bookkeeping">
              <Button variant="outline" size="lg">
                Preview first lesson
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card
              padding="lg"
              className="gradient-fintech border-ledger-800 text-white animate-fade-in-up"
            >
              <p className="text-sm font-medium text-ledger-300">Your simulated business</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Bright Path Consulting</h2>
              <p className="mt-4 leading-relaxed text-ledger-100">
                You are the owner of a solo consulting firm in Calgary. Your mission: keep the
                books for June 2024, understand your financial statements, and get tax-ready
                before handing everything to your accountant.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/10 px-2 py-3">
                  <dt className="text-xs text-ledger-300">Period</dt>
                  <dd className="mt-1 text-sm font-semibold">June 2024</dd>
                </div>
                <div className="rounded-xl bg-white/10 px-2 py-3">
                  <dt className="text-xs text-ledger-300">Location</dt>
                  <dd className="mt-1 text-sm font-semibold">Calgary, AB</dd>
                </div>
                <div className="rounded-xl bg-white/10 px-2 py-3">
                  <dt className="text-xs text-ledger-300">Tax</dt>
                  <dd className="mt-1 text-sm font-semibold">5% GST</dd>
                </div>
              </dl>
            </Card>

            <div className="grid gap-4 sm:grid-cols-1">
              {pillars.map((pillar) => (
                <Card key={pillar.title} className="card-surface-interactive animate-fade-in-up">
                  <h3 className="font-semibold text-ledger-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ledger-600">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ledger-900 sm:text-3xl">
              Four worlds. One complete skill.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ledger-600">
              Progress through a 4-week curriculum with mastery gates — unlock the next module at 80%.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {worlds.map((world) => (
              <li key={world.title}>
                <Card className="card-surface-interactive relative flex h-full flex-col overflow-hidden">
                  <div className="absolute -right-5 -top-5 h-28 w-36 opacity-30" aria-hidden="true">
                    <ConceptVisual variant={world.visual} className="h-full w-full" />
                  </div>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-ledger-100 text-xl"
                      aria-hidden="true"
                    >
                      {world.icon}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-ledger-500">Week {world.week}</p>
                      <h3 className="font-semibold text-ledger-900">{world.title}</h3>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-ledger-600">
                    {world.description}
                  </p>
                  {world.progress > 0 ? (
                    <div className="mt-4">
                      <ProgressBar value={world.progress} label="Preview progress" size="sm" />
                    </div>
                  ) : (
                    <p className="mt-4 text-xs font-medium text-ledger-400">Unlocks with mastery</p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-ledger-900">Ready to open the books?</h2>
          <p className="mt-3 text-ledger-600">
            Earn XP, build streaks, collect badges, and finish with a certificate of completion.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg">Go to dashboard</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
