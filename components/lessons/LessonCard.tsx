import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

type LessonCardProps = {
  lesson: Lesson;
};

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link href={`/lessons/${lesson.id}`} className="block group">
      <Card className="transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ledger-500">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </div>
          {lesson.completed && (
            <span
              className="shrink-0 rounded-full bg-ledger-100 px-2 py-0.5 text-xs font-medium text-ledger-700"
              aria-label="Completed"
            >
              ✓ Done
            </span>
          )}
        </div>
        <p className="mt-3 text-xs text-ledger-500">
          ~{lesson.durationMinutes} min · {lesson.challengeIds.length} challenge
          {lesson.challengeIds.length !== 1 ? "s" : ""}
        </p>
      </Card>
    </Link>
  );
}
