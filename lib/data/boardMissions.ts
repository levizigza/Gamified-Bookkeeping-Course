import { completeMission, openMission, type BoardGameState } from "@/lib/game/boardEngine";
import { loadBoardState, saveBoardState } from "@/lib/data/boardProgress";

/** Maps live challenge/lesson/game routes to board mission IDs. */
export const ACTIVITY_TO_MISSION: Record<string, string> = {
  "/lessons/lesson-why-bookkeeping": "w1-what-why",
  "/lessons/lesson-double-entry": "w1-double-entry",
  "/games/category-blitz?week=1": "w1-category-game",
  "/games/balance-entry?week=1": "w1-tax-game",
  "/challenges/challenge-double-entry-duel": "w1-gate",
  "/lessons/lesson-account-types": "w2-account-types",
  "/games/cash-flow-snap?week=2": "w2-cash-timing",
  "/challenges/challenge-sort-accounts": "w2-sorter",
  "/lessons/lesson-trial-balance": "w2-trial-balance",
  "/games/balance-entry?week=2": "w2-gate",
  "/lessons/lesson-profit-loss": "w3-profit-loss",
  "/games/statement-sorter": "w3-statement-sorter",
  "/lessons/lesson-balance-sheet": "w3-balance-sheet",
  "/games/equation-hero": "w3-equation",
  "/challenges/challenge-insight-detective": "w3-gate",
  "/lessons/lesson-depreciation": "w4-journals",
  "/games/year-end-prep": "w4-prep",
  "/challenges/challenge-year-end-boss": "w4-boss",
  "/lessons/lesson-handoff": "w4-handoff",
};

export const CHALLENGE_TO_MISSION: Record<string, string> = {
  "challenge-double-entry-duel": "w1-gate",
  "challenge-sort-accounts": "w2-sorter",
  "challenge-insight-detective": "w3-gate",
  "challenge-year-end-boss": "w4-boss",
};

/** Challenges that have real interactive UI (not practice redirects). */
export const LIVE_CHALLENGE_IDS = new Set(Object.keys(CHALLENGE_TO_MISSION));

/** Stub catalog challenges that redirect to other practice. */
export const PRACTICE_REDIRECT_CHALLENGE_IDS = new Set([
  "challenge-why-books",
  "challenge-first-journal",
  "challenge-june-meals",
  "challenge-june-equipment",
  "challenge-trial-balance",
  "challenge-build-pl",
  "challenge-build-bs",
  "challenge-depreciation",
  "challenge-handoff",
]);

/**
 * Mark a board mission complete after a real activity finish.
 * Opens the mission first if needed so honor-system collect is not required.
 */
export function markBoardMissionComplete(missionId: string): BoardGameState {
  let state = loadBoardState();
  if (!state.openedMissionIds.includes(missionId)) {
    state = openMission(state, missionId);
  }
  if (!state.completedMissionIds.includes(missionId)) {
    state = completeMission(state, missionId).state;
  }
  saveBoardState(state);
  return state;
}

export function markChallengeMissionComplete(challengeId: string): void {
  const missionId = CHALLENGE_TO_MISSION[challengeId];
  if (!missionId) return;
  markBoardMissionComplete(missionId);
}
