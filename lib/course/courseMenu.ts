export type CourseTopic = {
  id: string;
  number: string;
  title: string;
  subtopics?: string[];
  lessonId?: string;
};

export type CourseWeek = {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  worldName: string;
  icon: string;
  locked: boolean;
  summary: string;
  topics: CourseTopic[];
};

export const COURSE_BRAND = {
  company: "Rukbe Tech Inc.",
  product: "Bookkeeping for Business Owners + Software",
  tagline: "A game-style course for owners who want clean books — and confident decisions.",
} as const;

export const COURSE_PREREQUISITES = [
  "No prior bookkeeping knowledge required",
  "Download and install the Rukbe App",
] as const;

export const COURSE_OBJECTIVES = [
  "Equipped to maintain the books on a daily basis",
  "Able to read and understand the financial statements",
  "Able to complete bookkeeping to the maximum and only leave corporate tax preparation to accountants",
  "Get accustomed to making decisions based on financial data",
] as const;

export const COURSE_WEEKS: CourseWeek[] = [
  {
    id: "week-1",
    week: 1,
    title: "Daily Ledger",
    worldName: "Daily Ledger",
    icon: "📒",
    locked: false,
    summary: "Learn what bookkeeping is, why it matters, and how double-entry plus sales tax work in real life.",
    topics: [
      {
        id: "w1-t1",
        number: "1",
        title: "What is bookkeeping?",
        lessonId: "lesson-why-bookkeeping",
      },
      {
        id: "w1-t2",
        number: "2",
        title: "Why is it so important?",
        lessonId: "lesson-why-bookkeeping",
      },
      {
        id: "w1-t3",
        number: "3",
        title: "What is double-entry bookkeeping? And sales taxes",
        lessonId: "lesson-double-entry",
      },
    ],
  },
  {
    id: "week-2",
    week: 2,
    title: "Account Sorter",
    worldName: "Account Sorter",
    icon: "🗂️",
    locked: true,
    summary: "Classify accounts correctly and prove the month with a balanced trial balance.",
    topics: [
      {
        id: "w2-t1",
        number: "4",
        title: "Trial Balance",
        lessonId: "lesson-trial-balance",
      },
      {
        id: "w2-t2",
        number: "5",
        title: "Assets, Liabilities, Income and Expenses",
        lessonId: "lesson-account-types",
      },
    ],
  },
  {
    id: "week-3",
    week: 3,
    title: "Reports Room",
    worldName: "Reports Room",
    icon: "📊",
    locked: true,
    summary: "Turn balanced books into financial statements you can actually read.",
    topics: [
      {
        id: "w3-t1",
        number: "6",
        title: "Financial Statements",
        lessonId: "lesson-profit-loss",
      },
    ],
  },
  {
    id: "week-4",
    week: 4,
    title: "Year-End Boss Fight",
    worldName: "Year-End Boss Fight",
    icon: "⚔️",
    locked: true,
    summary: "Close the period with adjusting entries, then hand a clean package to your accountant.",
    topics: [
      {
        id: "w4-t1",
        number: "7",
        title: "Other entries before closing a financial period (year)",
        lessonId: "lesson-depreciation",
        subtopics: ["Depreciation", "Home office expenses", "Mileage claim"],
      },
      {
        id: "w4-t2",
        number: "8",
        title: "Handover to accountants for tax preparation",
        lessonId: "lesson-handoff",
      },
    ],
  },
];

export function getCourseWeek(week: number): CourseWeek | undefined {
  return COURSE_WEEKS.find((w) => w.week === week);
}
