import {
  MODULE_KEY_CHALLENGES,
  MODULE_ORDER,
  MODULE_TITLES,
  MODULE_UNLOCK_THRESHOLD,
} from "@/lib/game/constants";
import type { ChallengeAttempt, ModuleId, ModuleUnlockState } from "@/lib/game/types";
import { calculateMasteryPercent } from "@/lib/game/mastery";

export { MODULE_UNLOCK_THRESHOLD };

export function getUnlockMessage(moduleId: ModuleId, priorModuleTitle: string): string {
  return `Score ${MODULE_UNLOCK_THRESHOLD}% mastery in ${priorModuleTitle} to unlock`;
}

/**
 * Week 1 is always unlocked. Each subsequent module unlocks when the
 * previous module's key-challenge mastery reaches 80%.
 */
export function evaluateModuleUnlocks(
  attempts: ChallengeAttempt[],
): ModuleUnlockState[] {
  return MODULE_ORDER.map(({ moduleId, week }, index) => {
    if (week === 1) {
      return { moduleId, unlocked: true };
    }

    const prior = MODULE_ORDER[index - 1];
    const priorKeyChallenges = MODULE_KEY_CHALLENGES[prior.moduleId];
    const priorMastery = calculateMasteryPercent(attempts, priorKeyChallenges);
    const unlocked = priorMastery >= MODULE_UNLOCK_THRESHOLD;

    return {
      moduleId,
      unlocked,
      lockMessage: unlocked
        ? undefined
        : getUnlockMessage(moduleId, MODULE_TITLES[prior.moduleId]),
    };
  });
}

export function isModuleUnlocked(
  moduleId: ModuleId,
  attempts: ChallengeAttempt[],
): boolean {
  const state = evaluateModuleUnlocks(attempts).find((s) => s.moduleId === moduleId);
  return state?.unlocked ?? false;
}
