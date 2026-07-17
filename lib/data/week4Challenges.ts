import type { ExpectedJournalLine } from "@/lib/data/week1JournalChallenges";
import { YEAR_END_BOSS_BADGES } from "@/lib/game/yearEndBossScoring";
import type { YearEndBossScenario } from "@/lib/game/yearEndBossScoring";

export const YEAR_END_BOSS_CHALLENGE_ID = "challenge-year-end-boss";

function journalLines(
  ...entries: { accountId: string; debitCents?: number; creditCents?: number }[]
): ExpectedJournalLine[] {
  return entries.map((e) => ({
    accountId: e.accountId,
    debitCents: e.debitCents ?? 0,
    creditCents: e.creditCents ?? 0,
  }));
}

export type YearEndBossChallenge = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  worldId: "year-end-boss";
  xpReward: number;
  passThresholdPercent: number;
  scenarios: YearEndBossScenario[];
};

export const yearEndBossScenarios: YearEndBossScenario[] = [
  {
    id: "boss-depreciation-vehicle",
    kind: "depreciation",
    title: "Vehicle depreciation",
    narrative:
      "Bright Path Consulting owns a business vehicle originally purchased for $30,000. " +
      "Your accountant asks you to post year-end amortization at 30% for this simulation. " +
      "Calculate the amortization amount and record the adjusting entry.",
    calculationPrompt: "What is the amortization amount for this period?",
    calculationHint: "Amortization = cost × depreciation rate (30% of $30,000).",
    inputsSummary: "Vehicle cost: $30,000 · Rate: 30%",
    correctAmountCents: 900_000,
    expectedLines: journalLines(
      { accountId: "depreciation-expense", debitCents: 900_000 },
      { accountId: "accumulated-amortization-vehicle", creditCents: 900_000 },
    ),
    ownerExplanation:
      "Depreciation spreads the vehicle's cost over time. You debit Depreciation Expense to recognize the expense " +
      "and credit Accumulated Amortization - Vehicle so the Balance Sheet shows a lower net book value.",
    consistencyTip:
      "Post depreciation the same way each year unless your accountant changes the rate or method.",
    badgeId: YEAR_END_BOSS_BADGES.depreciationDefender,
    badgeName: "Depreciation Defender",
    maxXp: 100,
  },
  {
    id: "boss-home-office",
    kind: "home_office",
    title: "Home office allocation",
    narrative:
      "You use 150 square feet of your 1,500 sq ft home regularly for Bright Path consulting work. " +
      "Eligible home costs for the year total $35,850 (rent, utilities, insurance). " +
      "Calculate the business-use claim and post the year-end adjusting entry.",
    calculationPrompt: "What is the home office claim amount?",
    calculationHint: "Business-use % = office area ÷ total home area. Claim = eligible costs × that percentage.",
    inputsSummary: "Office: 150 sq ft · Home: 1,500 sq ft · Eligible costs: $35,850",
    correctAmountCents: 358_500,
    expectedLines: journalLines(
      { accountId: "home-office-rent", debitCents: 358_500 },
      { accountId: "shareholder-loan", creditCents: 358_500 },
    ),
    ownerExplanation:
      "The business-use portion of home costs is an expense. When you personally paid those bills, " +
      "credit Shareholder Loan — the company owes you for the business share you funded.",
    consistencyTip:
      "Measure your office space once, document it, and use the same basis each year.",
    badgeId: YEAR_END_BOSS_BADGES.homeOfficeHero,
    badgeName: "Home Office Hero",
    maxXp: 100,
  },
  {
    id: "boss-mileage",
    kind: "mileage",
    title: "Mileage claim",
    narrative:
      "You drove 25,000 business kilometres for Bright Path in 2024. " +
      "Use the tiered allowance: first 5,000 km at $0.68/km, remaining km at $0.61/km. " +
      "Calculate the mileage claim and post the adjusting entry.",
    calculationPrompt: "What is the total mileage claim?",
    calculationHint:
      "(5,000 × $0.68) + (20,000 × $0.61). Rates are editable in the calculator — verify current CRA rates in real life.",
    inputsSummary: "Business km: 25,000 · First 5,000 @ $0.68 · Remaining @ $0.61",
    correctAmountCents: 1_560_000,
    expectedLines: journalLines(
      { accountId: "vehicle-expense-mileage", debitCents: 1_560_000 },
      { accountId: "shareholder-loan", creditCents: 1_560_000 },
    ),
    ownerExplanation:
      "The mileage method records vehicle expense without tracking every gas receipt. " +
      "Debit Vehicle Expense - Mileage and credit Shareholder Loan when you paid vehicle costs personally.",
    consistencyTip:
      "Keep a mileage log supporting every business kilometre you claim.",
    badgeId: YEAR_END_BOSS_BADGES.mileageMaster,
    badgeName: "Mileage Master",
    maxXp: 100,
  },
];

export function getYearEndBossChallenge(): YearEndBossChallenge {
  return {
    id: YEAR_END_BOSS_CHALLENGE_ID,
    title: "Year-End Boss Fight",
    description:
      "Post three year-end adjusting entries: depreciation, home office, and mileage. " +
      "Calculate each amount, build the journal entry, and earn badges at 80% mastery.",
    lessonId: "lesson-handoff",
    worldId: "year-end-boss",
    xpReward: yearEndBossScenarios.reduce((sum, s) => sum + s.maxXp, 0),
    passThresholdPercent: 80,
    scenarios: yearEndBossScenarios,
  };
}
