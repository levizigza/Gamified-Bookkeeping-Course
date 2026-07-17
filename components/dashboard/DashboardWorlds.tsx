"use client";

import type { ModuleProgress } from "@/lib/game/types";
import { WorldCard } from "@/components/game/WorldCard";
import { getWorlds } from "@/lib/data/mock-data";

type DashboardWorldsProps = {
  modules: ModuleProgress[];
};

export function DashboardWorlds({ modules }: DashboardWorldsProps) {
  const worlds = getWorlds();

  const mergedWorlds = worlds.map((world) => {
    const mod = modules.find((m) => m.moduleId === world.id);
    return {
      ...world,
      unlocked: mod?.unlocked ?? world.unlocked,
      progressPercent: mod?.masteryPercent ?? world.progressPercent,
      lockMessage: mod?.lockMessage,
    };
  });

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {mergedWorlds.map((world) => (
        <li key={world.id}>
          <WorldCard
            world={world}
            lockMessage={"lockMessage" in world ? world.lockMessage : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
