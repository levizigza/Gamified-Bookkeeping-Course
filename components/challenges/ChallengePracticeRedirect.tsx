import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type PracticeLink = {
  href: string;
  label: string;
};

/** Stub challenges redirect learners to live practice covering the same skill. */
const PRACTICE_BY_CHALLENGE: Record<
  string,
  { title: string; description: string; primary: PracticeLink; secondary?: PracticeLink }
> = {
  "challenge-why-books": {
    title: "Practice why bookkeeping matters",
    description:
      "Use Cash Flow Snap to see how organized records help you understand cash, make business decisions, and prepare information for taxes, banks, or partners.",
    primary: { href: "/games/cash-flow-snap", label: "Start Cash Flow Snap" },
    secondary: { href: "/lessons/lesson-why-bookkeeping", label: "Review the Week 1 lesson" },
  },
  "challenge-first-journal": {
    title: "Build your first journal entries",
    description: "Practice double-entry and sales-tax splits (taxi, Home Depot–style buys) in Double-Entry Duel.",
    primary: { href: "/challenges/challenge-double-entry-duel", label: "Double-Entry Duel" },
    secondary: { href: "/games/debit-credit", label: "Debit or Credit? game" },
  },
  "challenge-june-meals": {
    title: "Practice everyday meal & expense coding",
    description:
      "Classify meals, entertainment, vehicle, office, supplies, and travel — Consistency: same account every time.",
    primary: { href: "/challenges/challenge-classify-transaction", label: "Classify the Transaction" },
    secondary: { href: "/games/category-blitz", label: "Category Blitz" },
  },
  "challenge-june-equipment": {
    title: "Practice equipment & everyday purchases",
    description: "Equipment lasts years (asset). Materials and taxis need GST splits. Keep categories consistent.",
    primary: { href: "/challenges/challenge-classify-transaction", label: "Classify the Transaction" },
    secondary: { href: "/games/balance-entry", label: "Balance the Entry" },
  },
  "challenge-trial-balance": {
    title: "See a balanced trial balance",
    description:
      "Daily transactions compile into a month-end Trial Balance (assets, liabilities, income, expenses). View Bright Path’s, then practice balancing entries.",
    primary: { href: "/reports", label: "Open Reports Room" },
    secondary: { href: "/games/balance-entry?week=2", label: "Balance the Entry (Week 2)" },
  },
  "challenge-build-pl": {
    title: "Read the Profit & Loss",
    description:
      "See Bright Path’s P&L (revenue → direct costs → gross profit → expenses → net income), then sort which accounts belong on it.",
    primary: { href: "/reports", label: "View Profit & Loss" },
    secondary: { href: "/games/statement-sorter", label: "Statement Sorter" },
  },
  "challenge-build-bs": {
    title: "Read the Balance Sheet",
    description:
      "Confirm Assets = Liabilities + Equity, then practice the equation and Insights → Decisions.",
    primary: { href: "/reports", label: "View Balance Sheet" },
    secondary: { href: "/games/equation-hero", label: "Equation Hero" },
  },
  "challenge-depreciation": {
    title: "Practice year-end Journals #1–#3",
    description:
      "Use the calculators for depreciation ($14,500), home office ($3,585), and mileage ($15,600), then warm up with Year-End Prep.",
    primary: { href: "/tools#calculators", label: "Year-end calculators" },
    secondary: { href: "/games/year-end-prep", label: "Year-End Prep game" },
  },
  "challenge-handoff": {
    title: "Prepare for accountant handoff",
    description:
      "Finish the Year-End Boss Fight — Journals #1–#3 posted, then the tax-prep handoff checklist.",
    primary: { href: "/challenges/challenge-year-end-boss", label: "Year-End Boss Fight" },
    secondary: { href: "/tools#calculators", label: "Year-end tools" },
  },
};

type ChallengePracticeRedirectProps = {
  challengeId: string;
  lessonHref?: string;
  lessonTitle?: string;
};

export function ChallengePracticeRedirect({
  challengeId,
  lessonHref,
  lessonTitle,
}: ChallengePracticeRedirectProps) {
  const practice = PRACTICE_BY_CHALLENGE[challengeId];

  if (!practice) {
    return (
      <EmptyState
        icon="🧭"
        title="Choose another practice activity"
        description="This activity does not have an interactive version yet. Return to the lesson or choose a complete game from the arcade."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            {lessonHref && (
              <Link href={lessonHref}>
                <Button variant="outline">Back to {lessonTitle ?? "lesson"}</Button>
              </Link>
            )}
            <Link href="/games/arcade">
              <Button>Open Side Arcade</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <EmptyState
      icon="🎯"
      title={practice.title}
      description={practice.description}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={practice.primary.href}>
            <Button>{practice.primary.label}</Button>
          </Link>
          {practice.secondary && (
            <Link href={practice.secondary.href}>
              <Button variant="outline">{practice.secondary.label}</Button>
            </Link>
          )}
          {lessonHref && (
            <Link href={lessonHref}>
              <Button variant="ghost">Back to lesson</Button>
            </Link>
          )}
        </div>
      }
    />
  );
}
