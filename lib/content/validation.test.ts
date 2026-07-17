import { describe, expect, it } from "vitest";
import { getValidatedCourseContent } from "@/lib/content/registry";
import { validateCourseContent } from "@/lib/content/validation";

describe("content validation", () => {
  it("loads the full course bundle", () => {
    const { bundle } = getValidatedCourseContent();
    expect(bundle.lessons.length).toBeGreaterThan(0);
    expect(bundle.challenges.length).toBeGreaterThan(0);
    expect(bundle.badges.length).toBeGreaterThan(0);
  });

  it("flags catalog-only challenges without scenarios", () => {
    const { validation } = getValidatedCourseContent();
    const placeholderWarnings = validation.warnings.filter(
      (w) => w.entityType === "challenge" && w.code === "missing_feedback",
    );
    expect(placeholderWarnings.length).toBeGreaterThan(0);
  });

  it("passes validation for fully authored rich challenges", () => {
    const { bundle } = getValidatedCourseContent();
    const classify = bundle.challenges.find(
      (c) => c.id === "challenge-classify-transaction",
    );
    expect(classify?.scenarios.length).toBeGreaterThan(0);

    const result = validateCourseContent({
      ...bundle,
      challenges: classify ? [classify] : [],
      lessons: [],
      badges: [],
    });
    expect(result.isClean).toBe(true);
  });

  it("detects missing learning objectives", () => {
    const { bundle } = getValidatedCourseContent();
    const result = validateCourseContent({
      ...bundle,
      lessons: [
        {
          ...bundle.lessons[0],
          learningObjectives: [],
        },
      ],
      challenges: [],
      badges: [],
    });
    expect(result.counts.missing_learning_objective).toBe(1);
  });

  it("detects missing badge criteria", () => {
    const { bundle } = getValidatedCourseContent();
    const result = validateCourseContent({
      ...bundle,
      badges: [{ ...bundle.badges[0], criteria: "" }],
      lessons: [],
      challenges: [],
    });
    expect(result.counts.missing_badge_criteria).toBe(1);
  });
});
