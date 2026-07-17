# Testing

Ledger Quest uses [Vitest](https://vitest.dev/) for unit and integration tests. Tests focus on **accounting logic** and **game scoring** — not React UI components.

## Quick start

```bash
# Run the full suite once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Accounting modules only
npm run test:accounting

# Gamification / scoring only
npm run test:game

# Coverage report (HTML in ./coverage)
npm run test:coverage
```

All tests run in a **Node** environment. No browser or Supabase connection is required.

## Project layout

```
tests/
  setup.ts                      # Global Vitest setup (runs before each file)
  helpers/fixtures.ts           # Shared journal entries, challenge attempts
  accounting.integration.test.ts  # Smoke tests across all accounting domains

lib/accounting/
  journalValidation.test.ts     # Debits/credits, validation, corrections
  trialBalance.test.ts          # Trial balance generation and totals
  financialStatements.test.ts     # P&L, Balance Sheet, accounting equation
  yearEndCalculators.test.ts    # Depreciation, home office, mileage

lib/game/
  xp.test.ts                    # XP awards, levels, streak bonus
  mastery.test.ts               # Module mastery percentages
  unlocks.test.ts               # Week/module unlock chain (80% rule)
  gamification.test.ts          # Streaks, retries, badges, progress assembly
  journalScoring.test.ts        # Journal challenge grading
  …                             # Other challenge-specific scorers

vitest.config.ts                # Vitest configuration
vitest-env.d.ts                 # TypeScript types for Vitest globals
```

Tests live next to the code they exercise (`lib/**/*.test.ts`) plus shared helpers under `tests/`.

## What is tested

| Area | What we verify | Primary test file(s) |
|------|----------------|----------------------|
| Journal entries balance | Debits equal credits; teaching examples pass | `journalValidation.test.ts` |
| Invalid journal entries | Too few lines, both sides on one line, unbalanced amounts | `journalValidation.test.ts` |
| Trial balance totals | June sample balances; bad entries skipped | `trialBalance.test.ts` |
| Profit & Loss | Net income = revenue − direct costs − operating expenses | `financialStatements.test.ts` |
| Balance Sheet equation | Assets = liabilities + equity | `financialStatements.test.ts` |
| Depreciation | Cost × rate; journal entry suggestion | `yearEndCalculators.test.ts` |
| Home office % | Area ratio × eligible costs | `yearEndCalculators.test.ts` |
| Mileage | Tiered CRA-style km rates | `yearEndCalculators.test.ts` |
| XP scoring | First try, retry half-XP, streak bonus, levels | `xp.test.ts` |
| Mastery scoring | First-try average; retries ignored | `mastery.test.ts` |
| Unlock logic | Week N unlocks at 80% prior-week mastery | `unlocks.test.ts` |

The integration file `tests/accounting.integration.test.ts` runs one focused assertion per domain so regressions are easy to spot.

## Writing new tests

1. Add a `*.test.ts` file beside the module under `lib/`, or under `tests/` for cross-cutting checks.
2. Import shared data from `tests/helpers/fixtures.ts` when you need journal lines or `ChallengeAttempt` records.
3. Use **cents** for all money amounts (e.g. `$80.00` → `8000`).
4. Prefer testing pure functions in `lib/accounting/` and `lib/game/` rather than React components.

Example:

```typescript
import { describe, expect, it } from "vitest";
import { isBalanced } from "@/lib/accounting/journalValidation";
import { balancedEntry } from "@/tests/helpers/fixtures";

it("balances a simple cash purchase", () => {
  const entry = balancedEntry("supplies", 8000, "bank-cash", 8000);
  expect(isBalanced(entry)).toBe(true);
});
```

## Configuration

`vitest.config.ts` sets:

- **Environment:** `node` (no DOM)
- **Setup file:** `tests/setup.ts`
- **Path alias:** `@/` → project root (same as Next.js)
- **Coverage:** `lib/accounting/**` and `lib/game/**` (excludes test files)

## CI

The full suite should pass before merging:

```bash
npm test
```

Optionally add coverage gates in CI with `npm run test:coverage`.

## What we do not test here

- React pages and components (no Testing Library setup yet)
- Supabase or localStorage persistence (see `lib/storage/storage.test.ts` for adapter unit tests)
- End-to-end browser flows

Those can be added later with Playwright or React Testing Library if needed.
