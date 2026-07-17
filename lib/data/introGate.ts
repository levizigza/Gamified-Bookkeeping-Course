const INTRO_GATE_KEY = "ledger-quest:intro-gate:v1";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

/** True once the learner has entered the course from Course Select. */
export function hasEnteredCourse(): boolean {
  return storage()?.getItem(INTRO_GATE_KEY) === "entered";
}

export function markCourseEntered(): void {
  storage()?.setItem(INTRO_GATE_KEY, "entered");
}

/** Used by Replay Intro so the opening animation can run again. */
export function clearCourseEntered(): void {
  storage()?.removeItem(INTRO_GATE_KEY);
}
