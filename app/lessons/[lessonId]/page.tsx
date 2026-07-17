import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { LessonContentView } from "@/components/lessons/LessonContentView";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import {
  getChallengeById,
  getLessonById,
  getLessons,
  getWorldById,
} from "@/lib/data/mock-data";
import {
  getLessonContentById,
  hasLessonContent,
} from "@/lib/data/lessons";
import { Button } from "@/components/ui/Button";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export function generateStaticParams() {
  return getLessons().map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const content = getLessonContentById(lessonId);
  const lesson = getLessonById(lessonId);
  const title = content?.title ?? lesson?.title ?? "Lesson";
  return {
    title: `${title} — Ledger Quest`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  const content = getLessonContentById(lessonId);

  if (!lesson && !content) {
    notFound();
  }

  const world = getWorldById(lesson?.worldId ?? content?.worldId ?? "");
  const challenges = (lesson?.challengeIds ?? [])
    .map((id) => getChallengeById(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const title = content?.title ?? lesson?.title ?? "Lesson";
  const description =
    lesson?.description ?? content?.storyIntro ?? undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        backHref="/board"
        backLabel="Back to game board"
        eyebrow={
          world ? `${world.icon} ${world.name}${content ? ` · Week ${content.week}` : ""}` : undefined
        }
        title={title}
        description={description}
        badge={
          content || lesson ? (
            <span className="rounded-full bg-ledger-100 px-3 py-1 text-xs font-semibold text-ledger-700">
              ~{content?.durationMinutes ?? lesson?.durationMinutes ?? 10} min
            </span>
          ) : undefined
        }
        className="mb-8"
      />

      {content && (
        <aside
          aria-label="How this lesson fits the board"
          className="mb-8 rounded-2xl border border-ledger-200 bg-white p-4 shadow-sm"
        >
          <p className="font-semibold text-ledger-900">How this stop works</p>
          <ol className="mt-3 grid gap-2 text-sm text-ledger-700 sm:grid-cols-3">
            <li className="rounded-xl bg-ledger-50 px-3 py-2">
              <strong className="text-ledger-900">1. Read</strong>
              <span className="mt-1 block">Learn the idea in plain language.</span>
            </li>
            <li className="rounded-xl bg-ledger-50 px-3 py-2">
              <strong className="text-ledger-900">2. Practise</strong>
              <span className="mt-1 block">Use the challenge at the bottom.</span>
            </li>
            <li className="rounded-xl bg-gold-400/10 px-3 py-2">
              <strong className="text-ledger-900">3. Return</strong>
              <span className="mt-1 block">Go back to the board and collect your star.</span>
            </li>
          </ol>
        </aside>
      )}

      {content ? (
        <LessonContentView
          content={content}
          worldLabel={world?.name}
          worldIcon={world?.icon}
        />
      ) : (
        lesson && (
          <p className="text-base leading-relaxed text-ledger-700">{lesson.description}</p>
        )
      )}

      {challenges.length > 0 ? (
        <section aria-labelledby="challenges-heading" className="mt-12">
          <SectionHeader
            id="challenges-heading"
            title={
              hasLessonContent(lessonId)
                ? "All challenges in this lesson"
                : "Challenges"
            }
            description="Practice what you learned with instant feedback"
            className="mb-4"
          />
          <ul className="space-y-4">
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard challenge={challenge} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState
          icon="⚔️"
          title="No challenges yet"
          description="Challenges for this lesson are still being prepared."
          className="mt-12"
        />
      )}

      <div className="mt-10">
        <Link href="/board">
          <Button variant="outline">Return to game board</Button>
        </Link>
      </div>
    </div>
  );
}
