import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountSorter } from "@/components/challenges/AccountSorter";
import { DoubleEntryDuel } from "@/components/challenges/DoubleEntryDuel";
import { InsightDetective } from "@/components/challenges/InsightDetective";
import { YearEndBossFight } from "@/components/challenges/YearEndBossFight";
import { TransactionClassifier } from "@/components/challenges/TransactionClassifier";
import { ChallengePracticeRedirect } from "@/components/challenges/ChallengePracticeRedirect";
import { PageHeader } from "@/components/ui/PageHeader";
import { getChallengeById, getLessonById } from "@/lib/data/mock-data";
import {
  CLASSIFY_TRANSACTION_CHALLENGE_ID,
  getClassifyTransactionChallenge,
} from "@/lib/data/week1Challenges";
import {
  DOUBLE_ENTRY_DUEL_CHALLENGE_ID,
  getDoubleEntryDuelChallenge,
} from "@/lib/data/week1JournalChallenges";
import {
  ACCOUNT_SORTER_CHALLENGE_ID,
  getAccountSorterChallenge,
} from "@/lib/data/week2Challenges";
import {
  INSIGHT_DETECTIVE_CHALLENGE_ID,
  getInsightDetectiveChallenge,
} from "@/lib/data/week3Challenges";
import {
  YEAR_END_BOSS_CHALLENGE_ID,
  getYearEndBossChallenge,
} from "@/lib/data/week4Challenges";
import { Button } from "@/components/ui/Button";

type ChallengePageProps = {
  params: Promise<{ challengeId: string }>;
};

export async function generateMetadata({ params }: ChallengePageProps) {
  const { challengeId } = await params;
  const challenge = getChallengeById(challengeId);
  const classify = getClassifyTransactionChallenge();
  const duel = getDoubleEntryDuelChallenge();
  const sorter = getAccountSorterChallenge();
  const detective = getInsightDetectiveChallenge();
  const yearEndBoss = getYearEndBossChallenge();
  const title =
    challengeId === CLASSIFY_TRANSACTION_CHALLENGE_ID
      ? classify.title
      : challengeId === DOUBLE_ENTRY_DUEL_CHALLENGE_ID
        ? duel.title
        : challengeId === ACCOUNT_SORTER_CHALLENGE_ID
          ? sorter.title
          : challengeId === INSIGHT_DETECTIVE_CHALLENGE_ID
            ? detective.title
            : challengeId === YEAR_END_BOSS_CHALLENGE_ID
              ? yearEndBoss.title
              : challenge?.title;
  return {
    title: title ? `${title} — Ledger Quest` : "Challenge — Ledger Quest",
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { challengeId } = await params;
  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    notFound();
  }

  const lesson = getLessonById(challenge.lessonId);
  const isClassifier = challengeId === CLASSIFY_TRANSACTION_CHALLENGE_ID;
  const isDuel = challengeId === DOUBLE_ENTRY_DUEL_CHALLENGE_ID;
  const isSorter = challengeId === ACCOUNT_SORTER_CHALLENGE_ID;
  const isDetective = challengeId === INSIGHT_DETECTIVE_CHALLENGE_ID;
  const isYearEndBoss = challengeId === YEAR_END_BOSS_CHALLENGE_ID;
  const wideLayout = isDetective || isYearEndBoss;
  const hasInteractiveChallenge =
    isClassifier || isDuel || isSorter || isDetective || isYearEndBoss;

  return (
    <div className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${wideLayout ? "max-w-5xl" : "max-w-3xl"}`}>
      <PageHeader
        backHref={lesson ? `/lessons/${lesson.id}` : "/dashboard"}
        backLabel={lesson ? `Back to ${lesson.title}` : "Back to dashboard"}
        title={challenge.title}
        description={challenge.description}
        badge={
          <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-600">
            +{challenge.xpReward} XP
          </span>
        }
        className="mb-8"
      />

      <div className="animate-fade-in">
        {isClassifier ? (
          <TransactionClassifier challenge={getClassifyTransactionChallenge()} />
        ) : isDuel ? (
          <DoubleEntryDuel challenge={getDoubleEntryDuelChallenge()} />
        ) : isSorter ? (
          <AccountSorter challenge={getAccountSorterChallenge()} />
        ) : isDetective ? (
          <InsightDetective challenge={getInsightDetectiveChallenge()} />
        ) : isYearEndBoss ? (
          <YearEndBossFight challenge={getYearEndBossChallenge()} />
        ) : (
          <ChallengePracticeRedirect
            challengeId={challengeId}
            lessonHref={lesson ? `/lessons/${lesson.id}` : undefined}
            lessonTitle={lesson?.title}
          />
        )}
      </div>

      {hasInteractiveChallenge && (
        <div className="mt-8 flex flex-wrap gap-3">
          {lesson && (
            <Link href={`/lessons/${lesson.id}`}>
              <Button variant="outline">Back to lesson</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
