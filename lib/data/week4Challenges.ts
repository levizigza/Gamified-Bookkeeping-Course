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
    id: "boss-depreciation-journal-1",
    kind: "depreciation",
    title: "Journal #1 — Depreciation",
    narrative:
      "Year-end common journal: Vehicle $30,000 × 30% = $9,000 (NBV $21,000); " +
      "Furniture $15,000 × 20% = $3,000 (NBV $12,000); Computers $5,000 × 50% = $2,500 (NBV $2,500). " +
      "Post Journal #1 for the total amortization.",
    calculationPrompt: "What is total Depreciation expense for Journal #1?",
    calculationHint: "$9,000 + $3,000 + $2,500 = total debit to Depreciation expenses.",
    inputsSummary: "Vehicle $9,000 · Furniture $3,000 · Computers $2,500",
    correctAmountCents: 1_450_000,
    expectedLines: journalLines(
      { accountId: "depreciation-expense", debitCents: 1_450_000 },
      { accountId: "accumulated-amortization-vehicle", creditCents: 900_000 },
      { accountId: "accumulated-amortization-furniture", creditCents: 300_000 },
      { accountId: "accumulated-amortization-equipment", creditCents: 250_000 },
    ),
    ownerExplanation:
      "Journal #1 debits Depreciation expenses $14,500 and credits each asset's Cum. Amortization " +
      "(Vehicle $9,000, Furniture $3,000, Computers/Equipment $2,500) so net book values stay accurate.",
    consistencyTip:
      "Track amortization by asset every year — same rates unless your accountant changes them.",
    badgeId: YEAR_END_BOSS_BADGES.depreciationDefender,
    badgeName: "Depreciation Defender",
    maxXp: 100,
  },
  {
    id: "boss-home-office",
    kind: "home_office",
    title: "Journal #2 — Home office use",
    narrative:
      "Office area 150 of 1,500 total home area (10%). Eligible home costs for the year total $35,850 " +
      "(heat, electricity, insurance, maintenance, mortgage interest, property taxes, internet, and others). " +
      "Calculate the claim and post Journal #2.",
    calculationPrompt: "What is the home office claim amount?",
    calculationHint: "Business-use % = 150 ÷ 1,500. Claim = $35,850 × that percentage.",
    inputsSummary: "Office: 150 · Home: 1,500 · Eligible costs: $35,850",
    correctAmountCents: 358_500,
    expectedLines: journalLines(
      { accountId: "home-office-rent", debitCents: 358_500 },
      { accountId: "shareholder-loan", creditCents: 358_500 },
    ),
    ownerExplanation:
      "Journal #2: Debit Home office use/rent $3,585; Credit Shareholders' loan $3,585 — " +
      "the business owes you for the business share of home costs you paid personally.",
    consistencyTip:
      "Measure your office space once, document it, and use the same basis each year.",
    badgeId: YEAR_END_BOSS_BADGES.homeOfficeHero,
    badgeName: "Home Office Hero",
    maxXp: 100,
  },
  {
    id: "boss-mileage",
    kind: "mileage",
    title: "Journal #3 — Mileage claim",
    narrative:
      "Total distance traveled 35,000 km; business distance 25,000 km. " +
      "Canada-style teaching rates: first 5,000 km at $0.68/km, remaining at $0.61/km. " +
      "Calculate the mileage expense and post Journal #3.",
    calculationPrompt: "What is the total mileage claim?",
    calculationHint:
      "(5,000 × $0.68) + (20,000 × $0.61). Real CRA rates change — verify before filing.",
    inputsSummary: "Business km: 25,000 · First 5,000 @ $0.68 · Remaining @ $0.61",
    correctAmountCents: 1_560_000,
    expectedLines: journalLines(
      { accountId: "vehicle-expense-mileage", debitCents: 1_560_000 },
      { accountId: "shareholder-loan", creditCents: 1_560_000 },
    ),
    ownerExplanation:
      "Journal #3: Debit Vehicle expenses (Mileage) $15,600; Credit Shareholders' loan $15,600.",
    consistencyTip:
      "Keep a mileage log: date, destination, kilometres, and business purpose.",
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
      "Post Journals #1–#3 from Week 4: depreciation ($14,500), home office ($3,585), and mileage ($15,600). " +
      "Then you are ready for handover to accountants for tax preparation.",
    lessonId: "lesson-handoff",
    worldId: "year-end-boss",
    xpReward: yearEndBossScenarios.reduce((sum, s) => sum + s.maxXp, 0),
    passThresholdPercent: 80,
    scenarios: yearEndBossScenarios,
  };
}
