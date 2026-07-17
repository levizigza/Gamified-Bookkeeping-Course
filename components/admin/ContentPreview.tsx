import Link from "next/link";
import type {
  ChallengeContent,
  ContentWarning,
  CourseContentBundle,
  ContentValidationResult,
  LessonContent,
} from "@/lib/content/schemas";
import { WARNING_LABELS } from "@/lib/content/validation";
import { Card } from "@/components/ui/Card";

type ContentPreviewProps = {
  bundle: CourseContentBundle;
  validation: ContentValidationResult;
};

function WarningBadge({ warning }: { warning: ContentWarning }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
      {WARNING_LABELS[warning.code]}
    </span>
  );
}

function warningsFor(
  warnings: ContentWarning[],
  entityType: ContentWarning["entityType"],
  entityId: string,
): ContentWarning[] {
  return warnings.filter(
    (w) =>
      w.entityType === entityType &&
      (w.entityId === entityId || w.entityTitle.includes(entityId)),
  );
}

function scenarioWarnings(
  warnings: ContentWarning[],
  scenarioId: string,
): ContentWarning[] {
  return warnings.filter(
    (w) => w.entityType === "scenario" && w.entityId === scenarioId,
  );
}

function LessonCard({
  lesson,
  warnings,
}: {
  lesson: LessonContent;
  warnings: ContentWarning[];
}) {
  const lessonWarnings = warningsFor(warnings, "lesson", lesson.id);

  return (
    <details className="group rounded-xl border border-ledger-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ledger-500">
              Week {lesson.week} · {lesson.worldId}
            </p>
            <h3 className="text-lg font-semibold text-ledger-900">{lesson.title}</h3>
            <p className="mt-1 text-sm text-ledger-600">{lesson.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lessonWarnings.length > 0 ? (
              lessonWarnings.map((w) => <WarningBadge key={w.code + w.field} warning={w} />)
            ) : (
              <span className="text-xs font-medium text-ledger-500">Complete</span>
            )}
          </div>
        </div>
      </summary>
      <div className="border-t border-ledger-100 px-4 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-ledger-700">{lesson.storyIntro}</p>
        <h4 className="mt-4 text-sm font-semibold text-ledger-900">Learning objectives</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ledger-700">
          {lesson.learningObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
        <h4 className="mt-4 text-sm font-semibold text-ledger-900">Explanation</h4>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-ledger-700">
          {lesson.explanation.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <h4 className="mt-4 text-sm font-semibold text-ledger-900">Examples</h4>
        <ul className="mt-2 space-y-3">
          {lesson.examples.map((example) => (
            <li key={example.title} className="rounded-lg bg-ledger-50 p-3 text-sm">
              <p className="font-medium text-ledger-900">{example.title}</p>
              <p className="mt-1 text-ledger-700">{example.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ledger-500">
          Primary challenge: {lesson.primaryChallengeId} · {lesson.durationMinutes} min
        </p>
      </div>
    </details>
  );
}

function ChallengeCard({
  challenge,
  warnings,
}: {
  challenge: ChallengeContent;
  warnings: ContentWarning[];
}) {
  const challengeWarnings = warningsFor(warnings, "challenge", challenge.id);

  return (
    <details className="group rounded-xl border border-ledger-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ledger-500">
              {challenge.kind} · {challenge.moduleId}
            </p>
            <h3 className="text-lg font-semibold text-ledger-900">{challenge.title}</h3>
            <p className="mt-1 text-sm text-ledger-600">{challenge.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-ledger-100 px-2 py-0.5 text-xs font-medium text-ledger-700">
              {challenge.scenarios.length} scenario
              {challenge.scenarios.length === 1 ? "" : "s"}
            </span>
            {challengeWarnings.map((w) => (
              <WarningBadge key={w.code + w.message} warning={w} />
            ))}
          </div>
        </div>
      </summary>
      <div className="border-t border-ledger-100 px-4 py-4 sm:px-6">
        <p className="text-sm text-ledger-700">{challenge.description}</p>
        <p className="mt-2 text-xs text-ledger-500">
          Lesson: {challenge.lessonId}
          {challenge.passThresholdPercent
            ? ` · Pass: ${challenge.passThresholdPercent}%`
            : ""}
        </p>
        <ul className="mt-4 space-y-3">
          {challenge.scenarios.map((scenario) => {
            const itemWarnings = scenarioWarnings(warnings, scenario.id);
            return (
              <li
                key={scenario.id}
                className="rounded-lg border border-ledger-100 bg-ledger-50/80 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-ledger-900">{scenario.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {itemWarnings.map((w) => (
                      <WarningBadge key={w.code} warning={w} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-ledger-700">{scenario.narrative}</p>
                <p className="mt-2 text-xs text-ledger-500">
                  Type: {scenario.scenarioType} · ID: {scenario.id}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

export function ContentPreview({ bundle, validation }: ContentPreviewProps) {
  const { warnings, counts, isClean } = validation;
  const placeholderCount = bundle.challenges.filter(
    (c) => c.kind === "placeholder",
  ).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-ledger-500">Admin · Read-only preview</p>
        <h1 className="mt-1 text-3xl font-bold text-ledger-900">Course content</h1>
        <p className="mt-2 max-w-2xl text-ledger-600">{bundle.courseDescription}</p>
        <p className="mt-2 text-xs text-ledger-500">
          Schema v{bundle.version} · {bundle.courseId}
        </p>
      </header>

      <Card padding="lg" className={isClean ? "border-ledger-300" : "border-amber-300 bg-amber-50/30"}>
        <h2 className="text-lg font-semibold text-ledger-900">Content health</h2>
        {isClean ? (
          <p className="mt-2 text-sm text-ledger-700">
            All authored content passes validation checks.
          </p>
        ) : (
          <p className="mt-2 text-sm text-ledger-700">
            {warnings.length} issue{warnings.length === 1 ? "" : "s"} found — mostly
            catalog-only challenges awaiting scenarios.
          </p>
        )}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(
            Object.entries(counts) as [keyof typeof counts, number][]
          ).map(([code, count]) => (
            <div key={code} className="rounded-lg bg-white/80 px-3 py-2">
              <dt className="text-xs text-ledger-500">{WARNING_LABELS[code]}</dt>
              <dd className="text-xl font-bold tabular-nums text-ledger-900">{count}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card padding="md">
          <p className="text-xs font-medium uppercase text-ledger-500">Lessons</p>
          <p className="text-3xl font-bold text-ledger-900">{bundle.lessons.length}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs font-medium uppercase text-ledger-500">Challenges</p>
          <p className="text-3xl font-bold text-ledger-900">{bundle.challenges.length}</p>
          <p className="mt-1 text-xs text-amber-700">
            {placeholderCount} catalog-only (no scenarios yet)
          </p>
        </Card>
        <Card padding="md">
          <p className="text-xs font-medium uppercase text-ledger-500">Badges</p>
          <p className="text-3xl font-bold text-ledger-900">{bundle.badges.length}</p>
        </Card>
      </section>

      {!isClean && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-ledger-900">All warnings</h2>
          <ul className="space-y-2">
            {warnings.map((warning) => (
              <li
                key={`${warning.entityId}-${warning.code}-${warning.message}`}
                className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <WarningBadge warning={warning} />
                  <span className="font-medium text-ledger-900">{warning.entityTitle}</span>
                </div>
                <p className="mt-1 text-ledger-700">{warning.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-ledger-900">Lessons</h2>
        <div className="space-y-3">
          {bundle.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} warnings={warnings} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-ledger-900">Challenges</h2>
        <div className="space-y-3">
          {bundle.challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} warnings={warnings} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-ledger-900">Badges</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {bundle.badges.map((badge) => {
            const badgeWarnings = warningsFor(warnings, "badge", badge.id);
            return (
              <li key={badge.id}>
                <Card padding="md" className="h-full">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden>
                      {badge.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ledger-900">{badge.name}</p>
                      <p className="mt-1 text-sm text-ledger-600">{badge.description}</p>
                      <p className="mt-2 text-xs text-ledger-500">
                        <span className="font-medium text-ledger-700">Criteria: </span>
                        {badge.criteria}
                      </p>
                      {badgeWarnings.map((w) => (
                        <div key={w.code} className="mt-2">
                          <WarningBadge warning={w} />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="border-t border-ledger-200 pt-6 text-sm text-ledger-600">
        <p>
          Content lives in <code className="text-ledger-800">lib/data/</code> today. Schemas in{" "}
          <code className="text-ledger-800">lib/content/</code> are the contract for a future admin
          editor or Supabase CMS sync.
        </p>
        <Link href="/dashboard" className="mt-3 inline-block font-medium text-ledger-700 underline">
          ← Back to dashboard
        </Link>
      </footer>
    </div>
  );
}
