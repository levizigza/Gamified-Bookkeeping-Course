import type { WorldId } from "@/lib/types";

/** Learning week module (maps to a world in the course). */
export type ModuleId = WorldId;

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Learning outcome this badge represents. */
  learningOutcome: string;
  moduleId?: ModuleId;
  earned: boolean;
  earnedAt?: string;
};

export type AchievementEventType =
  | "xp_earned"
  | "level_up"
  | "badge_unlocked"
  | "module_unlocked"
  | "streak_milestone"
  | "challenge_completed"
  | "mastery_threshold";

export type AchievementEvent = {
  id: string;
  type: AchievementEventType;
  timestamp: string;
  title: string;
  description: string;
  xpDelta?: number;
  badgeId?: string;
  moduleId?: ModuleId;
  metadata?: Record<string, string | number | boolean>;
};

export type ChallengeAttempt = {
  id: string;
  challengeId: string;
  moduleId: ModuleId;
  attemptNumber: number;
  correct: boolean;
  firstTry: boolean;
  scorePercent: number;
  xpEarned: number;
  timestamp: string;
  /** Concept tags missed on this attempt (for weak-area detection). */
  weakTags: string[];
};

export type ModuleProgress = {
  moduleId: ModuleId;
  week: number;
  title: string;
  unlocked: boolean;
  masteryPercent: number;
  challengesCompleted: number;
  challengesTotal: number;
  /** XP earned within this module. */
  xpEarned: number;
  lockMessage?: string;
};

export type WeakArea = {
  category: string;
  label: string;
  missCount: number;
  recommendation: string;
  lessonId: string;
  lessonTitle: string;
  tip: string;
};

export type UserProgress = {
  businessName: string;
  totalXp: number;
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  levelProgressPercent: number;
  /** Daily login / practice streak. */
  streakDays: number;
  /** Best in-session correct-answer streak across challenges. */
  bestAnswerStreak: number;
  /** Overall mastery averaged across unlocked modules. */
  masteryPercent: number;
  modules: ModuleProgress[];
  badges: Badge[];
  earnedBadgeCount: number;
  attempts: ChallengeAttempt[];
  weakAreas: WeakArea[];
  nextChallengeId: string | null;
  nextChallengeTitle: string | null;
  recentAchievements: AchievementEvent[];
};

export type XpAwardInput = {
  baseXp: number;
  correct: boolean;
  attemptNumber: number;
  currentAnswerStreak: number;
};

export type XpAwardResult = {
  xpEarned: number;
  streakBonus: number;
  isFirstTry: boolean;
  appliedMultiplier: number;
};

export type ModuleUnlockState = {
  moduleId: ModuleId;
  unlocked: boolean;
  lockMessage?: string;
};
