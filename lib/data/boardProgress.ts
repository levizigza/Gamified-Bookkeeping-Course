import {
  createBoardGameState,
  type BoardGameState,
  type BoardRaceMode,
} from "@/lib/game/boardEngine";

const BOARD_STATE_KEY = "ledger-quest:board:v1";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function isBoardState(value: unknown): value is BoardGameState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BoardGameState>;
  return (
    candidate.version === 1 &&
    Array.isArray(candidate.runners) &&
    Array.isArray(candidate.completedMissionIds) &&
    Array.isArray(candidate.openedMissionIds)
  );
}

export function loadBoardState(): BoardGameState {
  const store = storage();
  if (!store) return createBoardGameState();
  try {
    const parsed = JSON.parse(store.getItem(BOARD_STATE_KEY) ?? "null") as unknown;
    if (!isBoardState(parsed)) return createBoardGameState();
    return {
      ...createBoardGameState(parsed.mode, parsed.runners.map((runner) => runner.name)),
      ...parsed,
      finishedRunnerIds: parsed.finishedRunnerIds ?? [],
      tutorialVersion: parsed.tutorialVersion ?? 0,
    };
  } catch {
    return createBoardGameState();
  }
}

export function saveBoardState(state: BoardGameState): void {
  storage()?.setItem(BOARD_STATE_KEY, JSON.stringify(state));
}

export function resetBoardState(
  mode: BoardRaceMode = "computer",
  classroomNames: string[] = [],
): BoardGameState {
  const state = createBoardGameState(mode, classroomNames);
  saveBoardState(state);
  return state;
}
