/**
 * Course content registry — single entry point for lessons, challenges, and badges.
 */

import { getChallenges } from "@/lib/data/mock-data";
import { getAllLessonContent } from "@/lib/data/lessons";
import { BADGE_DEFINITIONS } from "@/lib/game/badges";
import {
  RICH_CHALLENGE_ADAPTERS,
  adaptCatalogChallengeToPlaceholder,
} from "@/lib/content/adapters";
import type { CourseContentBundle, LessonContent } from "@/lib/content/schemas";
import { validateCourseContent } from "@/lib/content/validation";

export const COURSE_META = {
  version: "1.0.0",
  courseId: "ledger-quest-bright-path",
  courseTitle: "Ledger Quest: Bright Path Consulting",
  courseDescription:
    "Gamified bookkeeping course for Alberta small-business owners — June 2024 practice month.",
} as const;

function buildChallengeRegistry() {
  const richById = new Map(RICH_CHALLENGE_ADAPTERS.map((c) => [c.id, c]));
  const catalog = getChallenges();

  return catalog.map((challenge) => {
    const rich = richById.get(challenge.id);
    if (rich) return rich;
    return adaptCatalogChallengeToPlaceholder(challenge);
  });
}

/** Full course content bundle for admin tools and future CMS sync. */
export function getCourseContent(): CourseContentBundle {
  return {
    version: COURSE_META.version,
    courseId: COURSE_META.courseId,
    courseTitle: COURSE_META.courseTitle,
    courseDescription: COURSE_META.courseDescription,
    lessons: getAllLessonContent(),
    challenges: buildChallengeRegistry(),
    badges: BADGE_DEFINITIONS,
  };
}

export function getLessonContentById(id: string): LessonContent | undefined {
  return getAllLessonContent().find((lesson) => lesson.id === id);
}

export function getChallengeContentById(id: string) {
  return getCourseContent().challenges.find((challenge) => challenge.id === id);
}

export function getValidatedCourseContent() {
  const bundle = getCourseContent();
  const validation = validateCourseContent(bundle);
  return { bundle, validation };
}
