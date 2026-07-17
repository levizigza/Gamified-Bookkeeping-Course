# Ledger Quest

A gamified bookkeeping education app for small-business owners. Learners run a simulated consulting firm (**Bright Path Consulting**, Calgary, June 2024), earn XP, unlock weekly modules, and practice double-entry accounting through interactive challenges — not flashcards.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Progress persists in the browser via a storage adapter (localStorage today; Supabase-ready).

---

## What you get

- **4-week course** disguised as a business simulator (Daily Ledger → Account Sorter → Reports Room → Year-End Boss Fight)
- **5 fully interactive challenges** with instant feedback, remediation, and completion summaries
- **Reports Room** with Trial Balance, P&L, Balance Sheet, and business insights
- **Year-end calculators** (depreciation, home office, mileage) with suggested journal entries
- **Adaptive learning** — mistakes map to seven weak-area categories with recommended practice
- **Certificate** page when overall mastery reaches 80%

> Educational simulation only — not tax or accounting advice.

---

## Quick start

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**If you see Internal Server Error (500) in dev:** this project lives under OneDrive, which can corrupt the `.next` cache. Run:

```bash
npm run dev:clean
```

Also stop any stale `node` processes holding port 3000. See [docs/debugging-report.md](docs/debugging-report.md).

### Other scripts

| Command | Purpose |
|---------|---------|
| `npm run dev:clean` | Delete `.next` then start dev (fixes most 500 errors) |
| `npm run dev:turbo` | Dev with Turbopack (faster; less stable on OneDrive) |
| `npm run clean` | Remove `.next` cache only |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Run Vitest suite (133 tests) |
| `npm run test:accounting` | Accounting logic only |
| `npm run test:game` | Gamification logic only |
| `npm run lint` | ESLint via Next.js |

See [docs/testing.md](docs/testing.md) for coverage and fixtures.

---

## Course structure

The curriculum follows four **worlds** (modules). Each world has lessons and challenges. **80% mastery** on a module's key challenges unlocks the next world.

| Week | Module | Key challenges | Lessons |
|------|--------|----------------|---------|
| 1 | Daily Ledger | Classify Transaction, Double-Entry Duel | Why Bookkeeping, Double-Entry, June Sprint |
| 2 | Account Sorter | Account Sorter | Account Categories, Trial Balance |
| 3 | Reports Room | Insight Detective | Profit & Loss, Balance Sheet |
| 4 | Year-End Boss | Year-End Boss Fight | Depreciation, Accountant Handoff |

**Sample business context:** Solo consulting firm in Calgary, Alberta. Currency is **CAD**; sales tax is **5% GST**. All monetary amounts are stored as **integer cents** internally.

Progress logic lives in `lib/game/` (`constants.ts`, `unlocks.ts`, `mastery.ts`, `progress.ts`).

---

## How challenges work

1. **Lesson** — narrative intro, objectives, examples, boss tip (`lib/data/lessons.ts` + `LessonContentView`)
2. **Challenge** — interactive UI in `components/challenges/`
3. **Scoring** — domain-specific modules in `lib/game/` (e.g. `scoring.ts`, `journalScoring.ts`, `accountSorterScoring.ts`)
4. **Feedback** — wrong answers trigger `RemediationFeedback` and optional `SimplerExampleCard`
5. **Persistence** — bests, badges, and mastery saved via `lib/data/progress-storage.ts` → `lib/storage/`

### Implemented challenges

| ID | Component |
|----|-----------|
| `challenge-classify-transaction` | `TransactionClassifier` |
| `challenge-double-entry-duel` | `DoubleEntryDuel` |
| `challenge-sort-accounts` | `AccountSorter` |
| `challenge-insight-detective` | `InsightDetective` |
| `challenge-year-end-boss` | `YearEndBossFight` |

Other challenge IDs exist in `lib/data/mock-data.ts` as placeholders ("coming soon" UI).

Challenge routing: `app/challenges/[challengeId]/page.tsx` maps IDs to components.

---

## Accounting calculations

All money is **cents** (`number`). Display uses `formatCentsForMessage()` from `lib/accounting/journalValidation.ts` (en-CA, CAD).

| Area | Location | Responsibility |
|------|----------|----------------|
| Journal validation | `lib/accounting/journalValidation.ts` | Balance checks, line diffs, learner-friendly error messages |
| Journal helpers | `lib/accounting/journal.ts` | Entry construction utilities |
| Trial balance | `lib/accounting/trialBalance.ts` | TB generation, balance validation |
| Financial statements | `lib/accounting/financialStatements.ts` | P&L, Balance Sheet, insights |
| Year-end math | `lib/accounting/yearEndCalculators.ts` | Depreciation, home office, mileage |
| Money types | `lib/accounting/money.ts` | `MoneyAmount`, `formatMoney`, `centsToMoney` |
| Chart of accounts | `lib/data/chartOfAccounts.ts` | Account definitions for Bright Path |
| June 2024 data | `lib/data/reportsData.ts` | Pre-built statements for Reports Room |

Integration tests: `tests/accounting.integration.test.ts`.

---

## Adding lessons and challenges

### Lessons

1. Add a `LessonContent` object in `lib/data/lessons.ts` (types in `lib/content/schemas.ts`)
2. Register the lesson in `lib/data/mock-data.ts` (`lessons` array, world `lessonIds`)
3. Set `primaryChallengeId` to an existing or new challenge ID
4. Preview at `/admin/content-preview` — validation warnings in `lib/content/validation.ts`

### Challenges (interactive)

1. Define challenge data in `lib/data/weekNChallenges.ts`
2. Register in `lib/data/mock-data.ts` `challenges` array
3. Add constant ID + `getXChallenge()` export
4. Build UI in `components/challenges/YourChallenge.tsx`
5. Wire in `app/challenges/[challengeId]/page.tsx`
6. Add to `IMPLEMENTED_CHALLENGE_IDS` in `lib/game/constants.ts`
7. Add to `MODULE_KEY_CHALLENGES` if it counts toward module mastery
8. Add tests in `lib/game/` or `tests/`

### Badges

Define in `lib/game/badges.ts`; unlock rules in `evaluateBadgeUnlocks()`.

---

## Storage and Supabase plan

Today:

```ts
// lib/storage/index.ts
export const storage = localStorageAdapter;
```

- Versioned JSON document + legacy key migration (`lib/storage/localStorageAdapter.ts`)
- Facade: `lib/data/progress-storage.ts`

Future (Phase 2):

1. Run schema in [docs/database-schema.sql](docs/database-schema.sql)
2. Follow [docs/supabase-setup.md](docs/supabase-setup.md)
3. Implement `supabaseAdapter` against `StorageAdapter` in `lib/storage/types.ts`
4. Swap export in `lib/storage/index.ts` — **no UI changes required**

---

## Project layout

```
app/                    # Next.js routes (pages, loading, error)
components/
  challenges/           # Interactive challenge UIs
  dashboard/            # Dashboard widgets
  game/                 # XP, badges, completion panels
  lessons/              # Lesson rendering
  reports/              # Financial statement tables
  ui/                   # Shared primitives (Card, Button, Alert, …)
lib/
  accounting/           # Pure accounting logic (tested)
  content/              # Content schemas, validation, admin preview
  data/                 # Lessons, challenges, mock data, COA
  game/                 # XP, mastery, unlocks, scoring, remediation
  storage/              # Persistence adapter (local → Supabase)
docs/                   # Deployment, testing, schema, roadmap
tests/                  # Integration tests and fixtures
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/debugging-report.md](docs/debugging-report.md) | Internal Server Error diagnosis and recovery |
| [docs/deployment.md](docs/deployment.md) | Deploy to Vercel or Node hosting |
| [docs/product-roadmap.md](docs/product-roadmap.md) | Phased product plan |
| [docs/testing.md](docs/testing.md) | Test commands and conventions |
| [docs/supabase-setup.md](docs/supabase-setup.md) | Database integration guide |
| [docs/database-schema.sql](docs/database-schema.sql) | Supabase table definitions |

---

## License

Private — see repository owner for terms.
