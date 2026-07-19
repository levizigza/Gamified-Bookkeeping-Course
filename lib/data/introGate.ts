/**
 * Intro no longer skips forever after first visit.
 * Opening animation + course select run on every fresh page load.
 * These helpers remain for Replay Intro / future session controls.
 */

const INTRO_GATE_KEY = "ledger-quest:intro-gate:v1";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

/** @deprecated Intro always plays on load; kept for Replay Intro cleanup. */
export function hasEnteredCourse(): boolean {
  return false;
}

export function markCourseEntered(): void {
  storage()?.setItem(INTRO_GATE_KEY, "entered");
}

/** Clears any leftover intro flags (local or session) before replaying. */
export function clearCourseEntered(): void {
  try {
    window.sessionStorage?.removeItem(INTRO_GATE_KEY);
    window.localStorage?.removeItem(INTRO_GATE_KEY);
  } catch {
    // Ignore storage access errors (private mode, etc.).
  }
}
