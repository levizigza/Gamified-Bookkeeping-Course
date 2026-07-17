"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COURSE_BRAND,
  COURSE_OBJECTIVES,
  COURSE_PREREQUISITES,
  COURSE_WEEKS,
  type CourseWeek,
} from "@/lib/course/courseMenu";
import { playSound } from "@/lib/audio/soundEngine";
import { Button } from "@/components/ui/Button";

type CourseMenuScreenProps = {
  onEnterCourse: () => void;
};

export function CourseMenuScreen({ onEnterCourse }: CourseMenuScreenProps) {
  const router = useRouter();
  const [previewWeek, setPreviewWeek] = useState<CourseWeek | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const previewTitleId = useId();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  const enterWeekOne = () => {
    playSound("chaChing", 0.8);
    onEnterCourse();
    router.push("/lessons/lesson-why-bookkeeping/");
  };

  const openPreview = (week: CourseWeek) => {
    playSound("navClick");
    setPreviewWeek(week);
  };

  return (
    <div
      className={`fixed inset-0 z-[90] overflow-y-auto bg-ledger-950 text-white transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(61,140,109,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(245,200,66,0.12),transparent_40%)]" />
        <div className="accounting-grid absolute inset-0 opacity-25" />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 text-center animate-fade-in-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold-400">
            {COURSE_BRAND.company}
          </p>
          <h1 id={titleId} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Course Select
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ledger-200 sm:text-base">
            {COURSE_BRAND.product}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ledger-400">{COURSE_BRAND.tagline}</p>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            onClick={() => {
              playSound("navClick");
              setShowBrief((open) => !open);
            }}
          >
            {showBrief ? "Hide course brief" : "Prerequisites & objectives"}
          </Button>
          <Button size="sm" onClick={enterWeekOne} className="shadow-glow-gold">
            Start Week 1
          </Button>
        </div>

        {showBrief && (
          <section className="mb-8 grid gap-4 animate-fade-in-up sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                Prerequisites
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-ledger-100">
                {COURSE_PREREQUISITES.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-mono text-gold-400">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                Objectives
              </h2>
              <p className="mt-2 text-xs text-ledger-400">The business owner shall be:</p>
              <ol className="mt-3 space-y-2 text-sm text-ledger-100">
                {COURSE_OBJECTIVES.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-mono text-gold-400">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <ul className="grid flex-1 gap-4 sm:grid-cols-2">
          {COURSE_WEEKS.map((week, index) => (
            <li
              key={week.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <article
                className={`relative h-full overflow-hidden rounded-3xl border p-5 transition ${
                  week.locked
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-gold-400/45 bg-gradient-to-br from-ledger-800/90 to-ledger-900 shadow-glow-gold"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ledger-300">
                      Week {week.week}
                    </p>
                    <h2 className="mt-1 flex items-center gap-2 text-xl font-bold">
                      <span aria-hidden="true">{week.icon}</span>
                      {week.title}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      week.locked
                        ? "bg-white/10 text-ledger-300"
                        : "bg-gold-400/20 text-gold-400"
                    }`}
                  >
                    {week.locked ? "Locked" : "Open"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ledger-300">{week.summary}</p>

                <ol className="mt-4 space-y-1.5 text-sm text-ledger-200">
                  {week.topics.slice(0, 3).map((topic) => (
                    <li key={topic.id} className="flex gap-2">
                      <span className="font-mono text-xs text-gold-400/80">{topic.number}.</span>
                      <span className="line-clamp-1">{topic.title}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex flex-wrap gap-2">
                  {!week.locked ? (
                    <Button size="sm" onClick={enterWeekOne}>
                      Enter week
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="cursor-not-allowed border-white/15 bg-white/5 text-ledger-400"
                    >
                      {week.week === 2 ? "Locked — finish Week 1" : "Locked"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-ledger-200 hover:bg-white/10 hover:text-white"
                    onClick={() => openPreview(week)}
                  >
                    Preview
                  </Button>
                </div>

                {week.locked && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(14,34,27,0.35)_100%)]"
                    aria-hidden="true"
                  />
                )}
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-ledger-500">
          Unlock later weeks by completing earlier modules at 80% mastery.
        </p>
      </div>

      {previewWeek && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          onClick={() => setPreviewWeek(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={previewTitleId}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-ledger-900 p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
              Week {previewWeek.week} preview
            </p>
            <h2 id={previewTitleId} className="mt-2 text-2xl font-bold">
              {previewWeek.icon} {previewWeek.title}
            </h2>
            <p className="mt-2 text-sm text-ledger-300">{previewWeek.summary}</p>

            {previewWeek.locked && (
              <p className="mt-4 rounded-xl border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs text-gold-400">
                This week is locked in play mode. Preview only — complete earlier weeks to unlock.
              </p>
            )}

            <ol className="mt-5 space-y-4">
              {previewWeek.topics.map((topic) => (
                <li key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    <span className="mr-2 font-mono text-gold-400">{topic.number}.</span>
                    {topic.title}
                  </p>
                  {topic.subtopics && topic.subtopics.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-6 text-sm text-ledger-300">
                      {topic.subtopics.map((sub) => (
                        <li key={sub} className="list-disc">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-2">
              {!previewWeek.locked && (
                <Button
                  onClick={() => {
                    setPreviewWeek(null);
                    enterWeekOne();
                  }}
                >
                  Start this week
                </Button>
              )}
              <Button
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10"
                onClick={() => {
                  playSound("navClick");
                  setPreviewWeek(null);
                }}
              >
                Close preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
