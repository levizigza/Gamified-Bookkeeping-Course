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
    title: "Practice this skill in Daily Ledger",
    description:
      "Start with classifying real June transactions — the fastest way to see why clean books matter.",
    primary: { href: "/challenges/challenge-classify-transaction", label: "Classify a transaction" },
    secondary: { href: "/games/cash-flow-snap", label: "Cash Flow Snap game" },
  },
  "challenge-first-journal": {
    title: "Build your first journal entries",
    description: "Use Double-Entry Duel to practice debit and credit pairs with teaching feedback.",
    primary: { href: "/challenges/challenge-double-entry-duel", label: "Double-Entry Duel" },
    secondary: { href: "/games/debit-credit", label: "Debit or Credit? game" },
  },
  "challenge-june-meals": {
    title: "Practice June meal & expense coding",
    description: "Classify meals, entertainment, and everyday expenses the way Bright Path would.",
    primary: { href: "/challenges/challenge-classify-transaction", label: "Classify the Transaction" },
    secondary: { href: "/games/category-blitz", label: "Category Blitz" },
  },
  "challenge-june-equipment": {
    title: "Practice equipment & asset decisions",
    description: "Learn when a purchase is an asset vs an expense, then reinforce it in the arcade.",
    primary: { href: "/challenges/challenge-classify-transaction", label: "Classify the Transaction" },
    secondary: { href: "/games/cash-flow-snap", label: "Cash Flow Snap" },
  },
  "challenge-trial-balance": {
    title: "See a balanced trial balance",
    description:
      "Open Reports Room for Bright Path’s June trial balance, then practice making entries balance.",
    primary: { href: "/reports", label: "Open Reports Room" },
    secondary: { href: "/games/balance-entry", label: "Balance the Entry" },
  },
  "challenge-build-pl": {
    title: "Read the Profit & Loss",
    description: "June’s P&L is ready in Reports Room. Then sort which accounts belong on it.",
    primary: { href: "/reports", label: "View Profit & Loss" },
    secondary: { href: "/games/statement-sorter", label: "Statement Sorter" },
  },
  "challenge-build-bs": {
    title: "Read the Balance Sheet",
    description: "Review Bright Path’s Balance Sheet, then practice placing accounts correctly.",
    primary: { href: "/reports", label: "View Balance Sheet" },
    secondary: { href: "/games/equation-hero", label: "Equation Hero" },
  },
  "challenge-depreciation": {
    title: "Practice year-end adjusting entries",
    description: "Use the depreciation calculator, then warm up with Year-End Prep.",
    primary: { href: "/tools#calculators", label: "Year-end calculators" },
    secondary: { href: "/games/year-end-prep", label: "Year-End Prep game" },
  },
  "challenge-handoff": {
    title: "Prepare for accountant handoff",
    description: "Finish the Year-End Boss Fight — the full handoff checklist lives there.",
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
        icon="🚧"
        title="Challenge coming soon"
        description="This challenge is still being built. Try another lesson challenge or the Side Arcade."
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
