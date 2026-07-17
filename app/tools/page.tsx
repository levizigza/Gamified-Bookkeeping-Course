import Link from "next/link";
import { fetchExchangeRates } from "@/lib/api/currency";
import { fetchCanadianHolidays } from "@/lib/api/holidays";
import { CurrencyConverter } from "@/components/tools/CurrencyConverter";
import { BusinessCalendar } from "@/components/tools/BusinessCalendar";
import { YearEndCalculators } from "@/components/calculators/YearEndCalculators";
import { VisualBanner } from "@/components/visuals/VisualBanner";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Business Tools — Ledger Quest",
  description:
    "Year-end calculators, currency converter, and Canadian business calendar for Bright Path Consulting.",
};

export default async function ToolsPage() {
  const year = new Date().getFullYear();
  const [rates, holidays] = await Promise.all([
    fetchExchangeRates(),
    fetchCanadianHolidays(year),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/dashboard" className="text-sm text-ledger-600 hover:text-ledger-900">
          ← Back to dashboard
        </Link>
      </nav>

      <VisualBanner
        variant="tools"
        eyebrow="Bright Path Consulting"
        title="Business Tools"
        description="Practice the year-end numbers owners actually need — then convert currencies and plan around Canadian business dates."
      />

      <section id="calculators" className="mb-12 scroll-mt-24">
        <SectionHeader
          title="Year-end calculators"
          description="Depreciation, home office, and mileage — with suggested journal entries for Bright Path Consulting."
          className="mb-6"
        />
        <YearEndCalculators />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/games/year-end-prep">
            <Button variant="outline" size="sm">
              Practice in Year-End Prep game
            </Button>
          </Link>
          <Link href="/challenges/challenge-year-end-boss">
            <Button variant="ghost" size="sm">
              Year-End Boss Fight
            </Button>
          </Link>
        </div>
      </section>

      <section id="daily-tools" className="space-y-8">
        <SectionHeader
          title="Owner utilities"
          description="Helpful for real-world bookkeeping habits — educational, not tax advice."
          className="mb-2"
        />
        <CurrencyConverter rates={rates} />
        <BusinessCalendar holidays={holidays} />
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/reports">
          <Button variant="outline">View June reports</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
