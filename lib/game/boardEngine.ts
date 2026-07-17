import {
  BOARD_SPACES,
  REQUIRED_MISSIONS_BY_WEEK,
  getBoardSpace,
} from "@/lib/game/boardData";

export type BoardRaceMode = "computer" | "classroom";

export type BoardRunner = {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  isHuman: boolean;
};

export type BoardGameState = {
  version: 1;
  mode: BoardRaceMode;
  runners: BoardRunner[];
  activeRunnerIndex: number;
  openedMissionIds: string[];
  completedMissionIds: string[];
  collectedRewardSpaces: number[];
  totalXp: number;
  rollCount: number;
  winnerId: string | null;
  finishedRunnerIds: string[];
  hasSeenHowTo: boolean;
  tutorialVersion: number;
};

export type MoveResult = {
  state: BoardGameState;
  from: number;
  to: number;
  rolled: number;
  stoppedByMissionId?: string;
  unlockedWeek?: 2 | 3 | 4;
  rewardXp: number;
  winnerId: string | null;
};

const RUNNER_COLORS = ["#f5c842", "#60a5fa", "#f472b6", "#a78bfa"];
const RUNNER_ICONS = ["🧑‍💼", "🤖", "🦊", "🐢"];

export function createBoardGameState(
  mode: BoardRaceMode = "computer",
  classroomNames: string[] = [],
): BoardGameState {
  const cleanNames = classroomNames.map((name) => name.trim()).filter(Boolean).slice(0, 4);
  const names =
    mode === "classroom" && cleanNames.length >= 2
      ? cleanNames
      : ["You", "Byte", "Penny", "Tally"];

  return {
    version: 1,
    mode,
    runners: names.map((name, index) => ({
      id: index === 0 ? "player" : `runner-${index}`,
      name,
      icon: mode === "computer" ? RUNNER_ICONS[index] : ["⭐", "🚀", "🌈", "🦁"][index],
      color: RUNNER_COLORS[index],
      position: 0,
      isHuman: mode === "classroom" || index === 0,
    })),
    activeRunnerIndex: 0,
    openedMissionIds: [],
    completedMissionIds: [],
    collectedRewardSpaces: [],
    totalXp: 0,
    rollCount: 0,
    winnerId: null,
    finishedRunnerIds: [],
    hasSeenHowTo: false,
    tutorialVersion: 0,
  };
}

export function getUnlockedWeek(completedMissionIds: string[]): 1 | 2 | 3 | 4 {
  const completed = new Set(completedMissionIds);
  let unlocked: 1 | 2 | 3 | 4 = 1;

  for (const week of [1, 2, 3] as const) {
    if (REQUIRED_MISSIONS_BY_WEEK[week].every((id) => completed.has(id))) {
      unlocked = (week + 1) as 2 | 3 | 4;
    } else {
      break;
    }
  }

  return unlocked;
}

export function getWeekProgress(
  week: 1 | 2 | 3 | 4,
  completedMissionIds: string[],
): { completed: number; total: number; percent: number } {
  const required = REQUIRED_MISSIONS_BY_WEEK[week];
  const completed = new Set(completedMissionIds);
  const count = required.filter((id) => completed.has(id)).length;
  return {
    completed: count,
    total: required.length,
    percent: Math.round((count / required.length) * 100),
  };
}

export function getMaxPositionForUnlockedWeek(unlockedWeek: 1 | 2 | 3 | 4): number {
  if (unlockedWeek === 4) return BOARD_SPACES.length - 1;
  const nextWeekStart =
    BOARD_SPACES.find((space) => space.week === unlockedWeek + 1)?.index ?? 1;
  return nextWeekStart - 1;
}

function firstRequiredMissionBetween(
  from: number,
  to: number,
  completedMissionIds: string[],
): string | undefined {
  const completed = new Set(completedMissionIds);
  for (let index = from + 1; index <= to; index += 1) {
    const space = getBoardSpace(index);
    if (
      space.requiredForUnlock &&
      space.missionId &&
      !completed.has(space.missionId)
    ) {
      return space.missionId;
    }
  }
  return undefined;
}

export function openMission(state: BoardGameState, missionId: string): BoardGameState {
  if (state.openedMissionIds.includes(missionId)) return state;
  return {
    ...state,
    openedMissionIds: [...state.openedMissionIds, missionId],
  };
}

export function completeMission(
  state: BoardGameState,
  missionId: string,
): { state: BoardGameState; unlockedWeek?: 2 | 3 | 4 } {
  if (!state.openedMissionIds.includes(missionId)) return { state };
  if (state.completedMissionIds.includes(missionId)) return { state };

  const before = getUnlockedWeek(state.completedMissionIds);
  const completedMissionIds = [...state.completedMissionIds, missionId];
  const after = getUnlockedWeek(completedMissionIds);

  return {
    state: {
      ...state,
      completedMissionIds,
      totalXp: state.totalXp + 100,
    },
    unlockedWeek: after > before ? (after as 2 | 3 | 4) : undefined,
  };
}

export function moveActiveRunner(
  state: BoardGameState,
  rolled: number,
): MoveResult {
  const active = state.runners[state.activeRunnerIndex];
  const unlockedWeek = getUnlockedWeek(state.completedMissionIds);
  const maximum = getMaxPositionForUnlockedWeek(unlockedWeek);
  const intended = Math.min(active.position + Math.max(1, Math.min(rolled, 3)), maximum);
  const blockingMissionId = active.isHuman
    ? firstRequiredMissionBetween(active.position, intended, state.completedMissionIds)
    : undefined;
  const blockingSpace = blockingMissionId
    ? BOARD_SPACES.find((space) => space.missionId === blockingMissionId)
    : undefined;
  const to = blockingSpace ? blockingSpace.index : intended;
  const target = getBoardSpace(to);
  const rewardXp =
    target.rewardXp && !state.collectedRewardSpaces.includes(to) ? target.rewardXp : 0;
  const collectedRewardSpaces =
    rewardXp > 0 ? [...state.collectedRewardSpaces, to] : state.collectedRewardSpaces;
  const runners = state.runners.map((runner, index) =>
    index === state.activeRunnerIndex ? { ...runner, position: to } : runner,
  );
  const winnerId =
    to === BOARD_SPACES.length - 1 &&
    REQUIRED_MISSIONS_BY_WEEK[4].every((id) => state.completedMissionIds.includes(id))
      ? active.id
      : state.winnerId;
  const finishedRunnerIds =
    to === BOARD_SPACES.length - 1 &&
    !state.finishedRunnerIds.includes(active.id) &&
    REQUIRED_MISSIONS_BY_WEEK[4].every((id) => state.completedMissionIds.includes(id))
      ? [...state.finishedRunnerIds, active.id]
      : state.finishedRunnerIds;
  const nextActiveRunnerIndex =
    state.runners
      .map((_, offset) => (state.activeRunnerIndex + offset + 1) % state.runners.length)
      .find((index) => !finishedRunnerIds.includes(state.runners[index].id)) ??
    state.activeRunnerIndex;

  return {
    state: {
      ...state,
      runners,
      collectedRewardSpaces,
      totalXp: state.totalXp + rewardXp,
      rollCount: state.rollCount + 1,
      winnerId: state.winnerId ?? winnerId,
      finishedRunnerIds,
      activeRunnerIndex: nextActiveRunnerIndex,
    },
    from: active.position,
    to,
    rolled,
    stoppedByMissionId: blockingMissionId,
    rewardXp,
    winnerId,
  };
}

export function moveComputerRunner(
  state: BoardGameState,
  runnerIndex: number,
  rolled: number,
): BoardGameState {
  const runner = state.runners[runnerIndex];
  if (!runner || runner.isHuman || state.finishedRunnerIds.includes(runner.id)) return state;

  const playerUnlockedWeek = getUnlockedWeek(state.completedMissionIds);
  const paceCap = Math.min(
    BOARD_SPACES.length - 1,
    getMaxPositionForUnlockedWeek(playerUnlockedWeek) + 2,
  );
  const to = Math.min(runner.position + Math.max(1, Math.min(rolled, 3)), paceCap);
  const finished =
    to === BOARD_SPACES.length - 1 &&
    REQUIRED_MISSIONS_BY_WEEK[4].every((id) => state.completedMissionIds.includes(id));

  return {
    ...state,
    winnerId: finished ? (state.winnerId ?? runner.id) : state.winnerId,
    finishedRunnerIds: finished
      ? [...state.finishedRunnerIds, runner.id]
      : state.finishedRunnerIds,
    runners: state.runners.map((item, index) =>
      index === runnerIndex ? { ...item, position: to } : item,
    ),
  };
}

export function getNextRequiredMission(state: BoardGameState) {
  const unlockedWeek = getUnlockedWeek(state.completedMissionIds);
  const completed = new Set(state.completedMissionIds);
  return BOARD_SPACES.find(
    (space) =>
      space.week <= unlockedWeek &&
      space.requiredForUnlock &&
      space.missionId &&
      !completed.has(space.missionId),
  );
}
