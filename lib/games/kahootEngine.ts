import type {
  BalanceQuestion,
  CategoryQuestion,
  DebitCreditQuestion,
  StatementSortQuestion,
} from "@/lib/games/gameData";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";

export type KahootPlayer = {
  id: string;
  name: string;
  score: number;
  isBot: boolean;
  avatar: string;
  lastAnswerCorrect?: boolean;
};

export type KahootQuestion = {
  id: string;
  prompt: string;
  subPrompt?: string;
  options: { id: string; label: string; correct: boolean }[];
  explanation: string;
  timeLimitSec: number;
};

const CATEGORY_LABELS: Record<CategoryQuestion["correctCategory"], string> = {
  asset: "Asset",
  liability: "Liability",
  equity: "Equity",
  income: "Income",
  expense: "Expense",
};

export function debitCreditToKahoot(questions: DebitCreditQuestion[]): KahootQuestion[] {
  return questions.map((q, i) => ({
    id: `dc-${i}`,
    prompt: q.transaction,
    subPrompt: `Which side for ${q.accountName}?`,
    options: [
      { id: "debit", label: "Debit", correct: q.correctSide === "debit" },
      { id: "credit", label: "Credit", correct: q.correctSide === "credit" },
      { id: "both", label: "Both sides", correct: false },
      { id: "neither", label: "Not recorded", correct: false },
    ],
    explanation: q.explanation,
    timeLimitSec: 15,
  }));
}

export function categoryToKahoot(questions: CategoryQuestion[]): KahootQuestion[] {
  return questions.slice(0, 10).map((q, i) => {
    const all = Object.keys(CATEGORY_LABELS) as CategoryQuestion["correctCategory"][];
    const wrong = shuffle(all.filter((cat) => cat !== q.correctCategory)).slice(0, 3);
    const options = shuffle([
      {
        id: q.correctCategory,
        label: CATEGORY_LABELS[q.correctCategory],
        correct: true,
      },
      ...wrong.map((cat) => ({
        id: cat,
        label: CATEGORY_LABELS[cat],
        correct: false,
      })),
    ]);

    return {
      id: `cat-${i}`,
      prompt: q.accountName,
      subPrompt: q.hint,
      options,
      explanation: q.explanation,
      timeLimitSec: 15,
    };
  });
}

export function balanceToKahoot(questions: BalanceQuestion[]): KahootQuestion[] {
  return questions.slice(0, 8).map((q, i) => {
    const correct = formatCentsForMessage(q.correctAmountCents);
    const distractors = [
      formatCentsForMessage(Math.round(q.correctAmountCents * 0.5)),
      formatCentsForMessage(q.correctAmountCents + 5000),
      formatCentsForMessage(Math.max(100, q.correctAmountCents - 2500)),
    ].filter((v, idx, arr) => v !== correct && arr.indexOf(v) === idx);

    while (distractors.length < 3) {
      distractors.push(
        formatCentsForMessage(q.correctAmountCents + (distractors.length + 1) * 1000),
      );
    }

    const options = shuffle([
      { id: "correct", label: correct, correct: true },
      ...distractors.slice(0, 3).map((label, d) => ({
        id: `d-${d}`,
        label,
        correct: false,
      })),
    ]);

    return {
      id: `bal-${i}`,
      prompt: q.scenario,
      subPrompt: `Missing ${q.missingSide} amount for ${q.lines[q.missingIndex]?.accountName ?? "the entry"}`,
      options,
      explanation: q.explanation,
      timeLimitSec: 20,
    };
  });
}

export function statementsToKahoot(questions: StatementSortQuestion[]): KahootQuestion[] {
  return questions.slice(0, 10).map((q, i) => ({
    id: `stmt-${i}`,
    prompt: q.accountName,
    subPrompt: q.hint,
    options: [
      { id: "pl", label: "Profit & Loss", correct: q.correctStatement === "pl" },
      { id: "bs", label: "Balance Sheet", correct: q.correctStatement === "bs" },
      { id: "neither", label: "Neither statement", correct: false },
      { id: "both", label: "Both statements", correct: false },
    ],
    explanation: q.explanation,
    timeLimitSec: 15,
  }));
}

export function calcKahootPoints(
  correct: boolean,
  timeLeftSec: number,
  timeLimitSec: number,
  streak: number,
): number {
  if (!correct) return 0;
  const speedBonus = Math.round((timeLeftSec / timeLimitSec) * 600);
  const streakBonus = Math.min(streak, 5) * 100;
  return 400 + speedBonus + streakBonus;
}

/** Simulate AI bot answer timing and accuracy */
export function simulateBotAnswer(
  botSkill: number,
  question: KahootQuestion,
): { correct: boolean; responseTimeMs: number } {
  const correct = Math.random() < botSkill;
  const baseTime = 3000 + Math.random() * 8000;
  const responseTimeMs = correct
    ? baseTime * (0.5 + Math.random() * 0.5)
    : baseTime * (0.7 + Math.random() * 0.8);

  return { correct, responseTimeMs: Math.min(responseTimeMs, question.timeLimitSec * 1000 - 500) };
}

export const BOT_PERSONAS: { id: string; name: string; skill: number; avatar: string }[] = [
  { id: "bot-alex", name: "Alex (Bookkeeper Bot)", skill: 0.72, avatar: "🤖" },
  { id: "bot-sam", name: "Sam (CPA Bot)", skill: 0.85, avatar: "📊" },
  { id: "bot-jordan", name: "Jordan (Intern Bot)", skill: 0.55, avatar: "📒" },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type GamePair = {
  id: string;
  title: string;
  kinestheticGameId: string;
  quizTopic: string;
  visualStyle: "3d" | "8bit" | "paper" | "neon";
  description: string;
};

export const GAME_PAIRS: GamePair[] = [
  {
    id: "debit-credit-pair",
    title: "Debit & Credit Mastery",
    kinestheticGameId: "debit-credit",
    quizTopic: "debit-credit-quiz",
    visualStyle: "neon",
    description: "Speed-tap debits and credits, then prove it in the Arena quiz.",
  },
  {
    id: "category-pair",
    title: "Account Classification",
    kinestheticGameId: "category-blitz",
    quizTopic: "category-quiz",
    visualStyle: "8bit",
    description: "Sort accounts by dragging, then battle bots on classification.",
  },
  {
    id: "balance-pair",
    title: "Journal Balancing",
    kinestheticGameId: "balance-entry",
    quizTopic: "balance-quiz",
    visualStyle: "paper",
    description: "Fill missing amounts kinesthetically, then quiz on double-entry rules.",
  },
  {
    id: "statements-pair",
    title: "Financial Statements",
    kinestheticGameId: "statement-sorter",
    quizTopic: "statements-quiz",
    visualStyle: "3d",
    description: "Sort to P&L or Balance Sheet, then Arena quiz on report reading.",
  },
];
