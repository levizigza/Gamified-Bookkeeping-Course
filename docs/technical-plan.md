# Technical Plan — Ledger Quest

Architecture and implementation guide for the Ledger Quest web app.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| State (v1) | React state + local persistence (localStorage / IndexedDB) |
| State (future) | Supabase (auth, progress, sync) |
| Testing | Vitest for pure accounting utilities |

---

## Repository Structure

```
/
├── app/                    # Next.js routes & layouts
├── components/
│   ├── ui/                 # Primitives (Button, Card, ProgressBar)
│   ├── game/               # XP, badges, streaks, worlds shell
│   └── challenges/         # Challenge-specific UI (thin wrappers)
├── lib/
│   ├── accounting/         # Pure functions: journal, TB, P&L, BS
│   ├── gamification/       # XP, mastery, badge rules
│   ├── data/               # Repositories & local adapters
│   └── scenarios/          # Bright Path Consulting seed data
├── types/                  # Financial & domain TypeScript types
├── docs/                   # Product & course documentation
└── .cursor/rules/          # Cursor project rules
```

---

## Architecture Principles

### 1. Pure accounting logic

All bookkeeping calculations live in `lib/accounting/` as **pure functions** with no React, no `fetch`, no browser APIs.

```typescript
// lib/accounting/journal.ts
export function validateJournalEntry(entry: JournalEntry): ValidationResult { ... }
export function postEntry(ledger: Ledger, entry: JournalEntry): Ledger { ... }
```

UI components **call** utilities; they do not embed debit/credit rules.

### 2. TypeScript types for all financial models

Define shared types in `types/`:

- `Money` (integer cents + currency code)
- `Account`, `AccountType`, `ChartOfAccounts`
- `JournalEntry`, `JournalLine`
- `TrialBalance`, `ProfitAndLoss`, `BalanceSheet`
- `Transaction`, `Challenge`, `UserProgress`

### 3. Money in cents

Store and compute amounts as **integer cents** internally. Format for display only:

```typescript
type Money = { amountCents: number; currency: 'USD' | 'CAD' };
```

Avoid floating-point arithmetic for money.

### 4. Data layer abstraction

```typescript
// lib/data/progress-repository.ts
export interface ProgressRepository {
  getProgress(userId: string): Promise<UserProgress>;
  saveProgress(progress: UserProgress): Promise<void>;
}

// lib/data/local-progress-repository.ts  — v1
// lib/data/supabase-progress-repository.ts — future
```

Seed scenario data (June 2024 transactions) lives in `lib/scenarios/bright-path-june-2024.ts` and is loaded through repositories, not imported in components.

### 5. Challenge + feedback model

Every challenge references:

- `learningObjectiveId`
- `validateAnswer(input): ChallengeResult`
- `feedback` object with `correctExplanation` and `incorrectHints` keyed by mistake type

Feedback copy is co-located with challenge definition or loaded from content files—not hardcoded in JSX.

---

## App Router Pages (v1)

| Route | Purpose |
|-------|---------|
| `/` | Landing + continue journey |
| `/worlds` | World map (4 worlds) |
| `/worlds/[worldId]` | World hub + challenge list |
| `/challenges/[challengeId]` | Active challenge |
| `/profile` | XP, badges, mastery, streaks |
| `/ledger` | June 2024 practice ledger view |

---

## Component Guidelines

- **Mobile-first:** Design layouts at 320px; enhance at `sm`/`md`/`lg`
- **Accessible:** Semantic landmarks, focus rings, `aria-*` on interactive challenges, keyboard-operable drag alternatives (buttons/lists)
- **Thin UI:** Challenge components orchestrate state; validation delegates to `lib/`
- **Simulator feel:** Progress animations, world theming, sound optional (off by default)

### Component layering

```
Page → WorldShell → ChallengeRunner → ChallengeUI (specific)
                          ↓
                   lib/accounting + lib/gamification
```

---

## Gamification Implementation

| Feature | Location | Notes |
|---------|----------|-------|
| XP | `lib/gamification/xp.ts` | Configurable per challenge type |
| Streaks | `lib/gamification/streaks.ts` | Date-based; timezone-aware |
| Badges | `lib/gamification/badges.ts` | Rule engine on progress events |
| Mastery | `lib/gamification/mastery.ts` | Exponential moving average of accuracy |
| Progress | `lib/gamification/progress.ts` | World % complete |

Emit progress events from challenge completion handler; persist via `ProgressRepository`.

---

## Accounting Modules

| Module | Responsibility |
|--------|----------------|
| `chart-of-accounts.ts` | Default COA for Bright Path Consulting |
| `journal.ts` | Entry validation, posting, balance checks |
| `trial-balance.ts` | Aggregate balances by account |
| `statements.ts` | P&L and Balance Sheet from TB |
| `adjustments.ts` | Depreciation, home office, mileage calculators |
| `sales-tax.ts` | Tax line generation (educational model) |

Each function returns structured results (`ok` / `error` with codes) for rich feedback.

---

## Local Data (v1)

- **User progress:** `localStorage` key `ledger-quest-progress`
- **Ledger state:** `localStorage` or IndexedDB for June entries
- **Seed transactions:** Static JSON/TS in `lib/scenarios/`

Migration path: same domain types; swap repository implementation for Supabase without changing accounting or UI contracts.

---

## Supabase Readiness (Future)

Planned tables (not implemented in v1):

- `profiles` — display name, mastery snapshot
- `user_progress` — world/challenge completion, XP, streaks
- `user_ledger_entries` — optional sync of practice ledger
- `badge_awards` — earned badges with timestamps

Use Row Level Security; keep accounting validation **client + server** when API routes are added.

---

## Testing Strategy

**Priority:** Unit tests for `lib/accounting/`:

- Journal entries balance
- Trial balance ties to ledger
- P&L + BS reconcile with TB
- June scenario end-to-end golden test
- Adjustment entries (depreciation, home office, mileage)

UI: manual QA checklist per world; optional Playwright for critical flows later.

---

## Implementation Phases

### Phase 1 — Foundation
- Next.js scaffold, Tailwind, types, COA, journal utilities
- Local progress repository
- Daily Ledger world (subset of June challenges)

### Phase 2 — Core loop
- Full June 2024 transaction set
- Account Sorter + trial balance
- XP, streaks, badges, feedback system

### Phase 3 — Statements
- Reports Room: P&L and Balance Sheet generators
- Interpretation challenges

### Phase 4 — Year-end
- Adjusting entry modules
- Boss fight flow + handoff checklist
- Mastery score + course completion

### Phase 5 — Polish
- Accessibility audit
- Mobile UX pass
- Supabase repository stub + env wiring (no production deploy required)

---

## Environment & Config

```env
# Future
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

v1 runs with zero external services.

---

## References

- [Product Brief](./product-brief.md)
- [Course Map](./course-map.md)
