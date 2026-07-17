# Supabase setup guide

Ledger Quest runs on **localStorage** today. This guide documents how to connect Supabase later without changing app logic — the storage adapter interface in `lib/storage/` is the swap point.

## Prerequisites

- A [Supabase](https://supabase.com) project (free tier is fine)
- [Supabase CLI](https://supabase.com/docs/guides/cli) optional, for migrations

## 1. Create the database schema

1. Open your Supabase project → **SQL Editor**
2. Paste and run the full contents of [`database-schema.sql`](./database-schema.sql)
3. Confirm all tables appear under **Table Editor**

The schema includes:

| Table | Purpose |
|-------|---------|
| `profiles` | Learner profile (business name, currency) — 1:1 with `auth.users` |
| `courses` | Top-level course catalog |
| `modules` | Weekly worlds (Daily Ledger, Account Sorter, …) |
| `lessons` | Lesson content metadata |
| `challenges` | Challenge definitions |
| `challenge_attempts` | Per-user attempt history |
| `user_progress` | Aggregated XP, level, streaks |
| `badges` | Badge definitions |
| `user_badges` | Badges earned per user |
| `journal_entries` | Practice ledger headers |
| `journal_entry_lines` | Debit/credit lines (amounts in cents) |
| `saved_reports` | Snapshots of generated reports |

All user-owned tables reference `auth.users(id)` and have **Row Level Security** so learners only see their own data.

## 2. Seed catalog content (optional)

Catalog rows (`courses`, `modules`, `lessons`, `challenges`, `badges`) can stay in `lib/data/` until you are ready to move them to the database. When you do, insert rows that match the IDs already used in the app:

```sql
insert into public.courses (id, slug, title, description, is_published)
values (
  'ledger-quest-bright-path',
  'bright-path-consulting',
  'Ledger Quest: Bright Path Consulting',
  'Gamified bookkeeping for Alberta small-business owners.',
  true
);

-- modules: daily-ledger, account-sorter, reports-room, year-end-boss
-- lessons: lesson-account-types, lesson-double-entry, …
-- challenges: challenge-classify-transaction, challenge-double-entry-duel, …
-- badges: first-entry, streak-3, insight-detective, …
```

Keep `id` values identical to those in `lib/data/` so challenge components do not need rewrites.

## 3. Environment variables (when connecting)

Create `.env.local` (never commit secrets):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The anon key is safe in the browser; RLS enforces per-user access.

## 4. Install the client (future step)

```bash
npm install @supabase/supabase-js
```

Create `lib/supabase/client.ts` for browser usage and `lib/storage/supabaseAdapter.ts` implementing `StorageAdapter` from `lib/storage/types.ts`.

## 5. Swap the storage adapter

Today the app exports the local adapter:

```ts
// lib/storage/index.ts
export { localStorageAdapter as storage } from "./localStorageAdapter";
```

To use Supabase:

```ts
import { supabaseAdapter } from "./supabaseAdapter";
export const storage = supabaseAdapter;
```

No challenge or dashboard component should import `localStorage` directly — they go through `lib/data/progress-storage.ts` or `storage` from `lib/storage`.

## 6. Auth flow (future)

1. Enable **Email** or **OAuth** providers in Supabase Auth settings
2. On sign-up, the `handle_new_user` trigger creates `profiles` and `user_progress` rows automatically
3. Pass `session.user.id` as `userId` to every `StorageAdapter` call

## 7. RLS verification checklist

Test with two test accounts in the SQL editor or Supabase client:

- [ ] User A cannot `select` User B's `challenge_attempts`
- [ ] User A cannot `update` User B's `user_progress`
- [ ] User A cannot read User B's `journal_entries` or `saved_reports`
- [ ] Both users can read published `courses`, `modules`, `lessons`, `challenges`, `badges`
- [ ] Unauthenticated clients cannot read user tables

Example policy test (run as authenticated user A):

```sql
-- Should return only your rows
select * from public.challenge_attempts;
select * from public.user_progress where user_id = auth.uid();
```

## 8. Local development without Supabase

Nothing in this repo requires a live Supabase connection. The app uses:

- **Static catalog** — `lib/data/mock-data.ts`, `lib/data/lessons.ts`
- **User state** — `lib/storage/localStorageAdapter.ts` via `lib/data/progress-storage.ts`

Mock gamification progress (`lib/game/mockProgress.ts`) continues to power the dashboard server render; localStorage merges in challenge scores on the client.

## 9. Mapping app types → tables

| App type | Table(s) |
|----------|----------|
| `ChallengeAttempt` | `challenge_attempts` |
| `UserProgress` (aggregated) | `user_progress` + derived from attempts |
| `Badge` (earned) | `user_badges` joined with `badges` |
| `JournalEntry` | `journal_entries` + `journal_entry_lines` |
| `Profile` / business name | `profiles` |
| Report snapshot | `saved_reports.payload` (JSON) |

Money is always stored as **integer cents** in `journal_entry_lines` and in report JSON payloads, matching `lib/types/accounting.ts`.

## 10. Next implementation steps

When you are ready to go live:

1. Implement `supabaseAdapter.ts` against `StorageAdapter`
2. Add auth UI (sign-in / sign-up)
3. Migrate existing localStorage data on first login (one-time import)
4. Move catalog seed data into SQL or a seed script
5. Replace mock progress on the dashboard with `storage.listChallengeAttempts()`

Until then, treat this document and `database-schema.sql` as the contract between frontend types and the future backend.
