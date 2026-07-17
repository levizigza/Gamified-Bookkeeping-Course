import Link from "next/link";
import type { LessonContent } from "@/lib/data/lessons";
import { BossTip } from "@/components/lessons/BossTip";
import { ConsistencyRule } from "@/components/lessons/ConsistencyRule";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type LessonContentViewProps = {
  content: LessonContent;
  worldLabel?: string;
  worldIcon?: string;
};

export function LessonContentView({
  content,
  worldLabel,
  worldIcon,
}: LessonContentViewProps) {
  return (
    <article className="space-y-8">
      {/* Header */}
      <header>
        {worldLabel && (
          <p className="text-sm font-medium text-ledger-500">
            {worldIcon} {worldLabel} · Week {content.week}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-ledger-900 sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-ledger-500">
          ~{content.durationMinutes} min read
        </p>
      </header>

      {/* Story intro */}
      <section aria-labelledby="story-heading" className="animate-fade-in-up">
        <Card className="card-surface border-ledger-200 bg-gradient-to-br from-white to-ledger-50/80">
          <h2 id="story-heading" className="text-sm font-semibold uppercase tracking-wide text-ledger-500">
            Your story
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ledger-800">
            {content.storyIntro}
          </p>
        </Card>
      </section>

      {/* Learning objectives */}
      <section aria-labelledby="objectives-heading">
        <h2 id="objectives-heading" className="text-xl font-bold text-ledger-900">
          What you will learn
        </h2>
        <ul className="mt-4 space-y-2">
          {content.learningObjectives.map((objective) => (
            <li
              key={objective}
              className="flex gap-3 text-sm leading-relaxed text-ledger-700"
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ledger-600 text-xs text-white"
                aria-hidden="true"
              >
                ✓
              </span>
              {objective}
            </li>
          ))}
        </ul>
      </section>

      {/* Explanation */}
      <section aria-labelledby="explanation-heading">
        <h2 id="explanation-heading" className="text-xl font-bold text-ledger-900">
          The basics
        </h2>
        <div className="mt-4 space-y-4">
          {content.explanation.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-ledger-700">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Consistency rule */}
      {content.consistencyRule && (
        <ConsistencyRule rule={content.consistencyRule} />
      )}

      {/* Examples */}
      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading" className="text-xl font-bold text-ledger-900">
          Real examples
        </h2>
        <p className="mt-2 text-sm text-ledger-600">
          From Bright Path Consulting&apos;s June 2024 books
        </p>
        <ul className="mt-4 space-y-3">
          {content.examples.map((example) => (
            <li key={example.title}>
              <Card padding="sm" className="hover:border-ledger-300 transition-colors">
                <h3 className="font-semibold text-ledger-900">{example.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ledger-600">
                  {example.description}
                </p>
                {example.accountHint && (
                  <p className="mt-2 text-xs font-medium text-ledger-500">
                    Account: {example.accountHint}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Boss tip */}
      <BossTip tip={content.bossTip} />

      {content.calculatorHref && (
        <section
          aria-labelledby="calculator-cta-heading"
          className="rounded-2xl border border-ledger-200 bg-ledger-50 p-6 sm:p-8"
        >
          <h2 id="calculator-cta-heading" className="text-lg font-bold text-ledger-900">
            Try the calculators
          </h2>
          <p className="mt-2 text-sm text-ledger-600">
            Work through depreciation, home office, and mileage amounts with
            suggested journal entries. Educational simulation only — not tax advice.
          </p>
          <Link href={content.calculatorHref} className="mt-4 inline-block">
            <Button variant="outline">
              {content.calculatorLabel ?? "Open Calculators"}
            </Button>
          </Link>
        </section>
      )}

      {/* CTA */}
      <section
        aria-labelledby="challenge-cta-heading"
        className="overflow-hidden rounded-2xl border border-ledger-300 bg-gradient-to-br from-ledger-800 via-ledger-900 to-ledger-950 p-6 text-center shadow-lg sm:p-8"
      >
        <h2 id="challenge-cta-heading" className="text-lg font-bold text-white">
          Ready to practice?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ledger-200">
          Apply what you learned in an interactive challenge with instant feedback.
        </p>
        <Link href={`/challenges/${content.primaryChallengeId}`} className="mt-6 inline-block">
          <Button size="lg" variant="secondary">
            Start Challenge
          </Button>
        </Link>
      </section>
    </article>
  );
}
