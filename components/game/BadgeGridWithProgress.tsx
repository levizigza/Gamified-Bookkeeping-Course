"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/types";
import { INSIGHT_DETECTIVE_BADGE_ID } from "@/lib/data/week3Challenges";
import {
  getYearEndBossEarnedBadgeIds,
  isInsightDetectiveBadgeEarned,
} from "@/lib/data/progress-storage";
import { BadgeGrid } from "@/components/game/BadgeGrid";

type BadgeGridWithProgressProps = {
  badges: Badge[];
  title?: string;
  emptyMessage?: string;
};

export function BadgeGridWithProgress({
  badges,
  title,
  emptyMessage,
}: BadgeGridWithProgressProps) {
  const [mergedBadges, setMergedBadges] = useState(badges);

  useEffect(() => {
    const insightEarned = isInsightDetectiveBadgeEarned();
    const yearEndBadges = new Set(getYearEndBossEarnedBadgeIds());
    const today = new Date().toISOString().slice(0, 10);

    setMergedBadges(
      badges.map((badge) => {
        const earnedFromStorage =
          (badge.id === INSIGHT_DETECTIVE_BADGE_ID && insightEarned) ||
          yearEndBadges.has(badge.id);
        if (!earnedFromStorage) return badge;
        return { ...badge, earned: true, earnedAt: badge.earnedAt ?? today };
      }),
    );
  }, [badges]);

  return (
    <BadgeGrid
      badges={mergedBadges}
      title={title}
      emptyMessage={emptyMessage}
    />
  );
}
