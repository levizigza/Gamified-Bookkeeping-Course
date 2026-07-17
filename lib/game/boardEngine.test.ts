import { describe, expect, it } from "vitest";
import {
  completeMission,
  createBoardGameState,
  getUnlockedWeek,
  moveActiveRunner,
  openMission,
} from "@/lib/game/boardEngine";

describe("board engine", () => {
  it("starts every race in Week 1", () => {
    const state = createBoardGameState();
    expect(getUnlockedWeek(state.completedMissionIds)).toBe(1);
    expect(state.runners.every((runner) => runner.position === 0)).toBe(true);
  });

  it("stops a human piece at the first unfinished key mission", () => {
    const state = createBoardGameState();
    const result = moveActiveRunner(state, 3);
    expect(result.to).toBe(1);
    expect(result.stoppedByMissionId).toBe("w1-what-why");
  });

  it("does not complete a mission until it has been opened", () => {
    const state = createBoardGameState();
    expect(completeMission(state, "w1-what-why").state.completedMissionIds).toEqual([]);
  });

  it("unlocks Week 2 after all three Week 1 key stars", () => {
    let state = createBoardGameState();
    for (const missionId of ["w1-what-why", "w1-double-entry", "w1-gate"]) {
      state = openMission(state, missionId);
      state = completeMission(state, missionId).state;
    }
    expect(getUnlockedWeek(state.completedMissionIds)).toBe(2);
  });

  it("creates a pass-and-play classroom race", () => {
    const state = createBoardGameState("classroom", ["Ava", "Ben"]);
    expect(state.runners.map((runner) => runner.name)).toEqual(["Ava", "Ben"]);
    expect(state.runners.every((runner) => runner.isHuman)).toBe(true);
  });
});
