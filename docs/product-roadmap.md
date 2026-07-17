# Product roadmap

Ledger Quest teaches bookkeeping through a simulated small business. This roadmap phases delivery from a local MVP to a multi-tenant learning platform with optional Rukbe integration.

---

## Phase 1 — Local MVP ✅ (current)

**Goal:** Prove the learning loop works end-to-end without a backend.

| Capability | Status |
|------------|--------|
| 4-week course structure (worlds, lessons, challenges) | Done |
| 5 interactive challenges with scoring and remediation | Done |
| Reports Room (TB, P&L, BS, insights) | Done |
| Year-end calculators | Done |
| XP, levels, streaks, badges | Done |
| Module unlock at 80% mastery | Done |
| localStorage persistence + legacy migration | Done |
| Adaptive weak-area feedback | Done |
| Admin content preview with validation | Done |
| Certificate page | Done |
| Mobile-first UI, accessibility baseline | Done |
| Vitest suite (accounting + game logic) | Done |

**Remaining MVP gaps (known):**

- 9 challenge placeholders still show "coming soon"
- No auth — single anonymous local user
- Reports Room route is not gated (world unlock is dashboard-only)
- Certificate uses mock progress server-side; real completion requires client merge

---

## Phase 2 — Supabase auth and persistence

**Goal:** Multi-device progress, real user accounts, production data model.

| Work item | Notes |
|-----------|-------|
| Supabase project + schema | [database-schema.sql](./database-schema.sql) |
| `supabaseAdapter` | Implement `StorageAdapter` in `lib/storage/` |
| Auth (email magic link or OAuth) | Supabase Auth → `profiles` table |
| RLS policies | Learners read/write only their rows |
| Migrate localStorage → cloud | One-time import on first login |
| Environment config | `NEXT_PUBLIC_SUPABASE_*` — see [supabase-setup.md](./supabase-setup.md) |
| Server components for progress | Replace `getMockGamificationProgress()` with adapter reads |

**Success metric:** Learner completes a challenge on phone, continues on desktop with same XP and unlocks.

---

## Phase 3 — Instructor dashboard

**Goal:** Non-developers can manage content and monitor cohorts.

| Work item | Notes |
|-----------|-------|
| Admin role + protected routes | Separate from learner app |
| Lesson/challenge CRUD | Backed by `lib/content/schemas.ts` |
| Content publish workflow | Draft → review → live |
| Validation dashboard | Extend `/admin/content-preview` |
| Cohort overview | Completion rates, weak-area heatmaps |
| Learner detail view | Attempt history, badge timeline |

**Success metric:** Instructor updates a lesson explanation without a code deploy.

---

## Phase 4 — Rukbe app integration

**Goal:** Connect Ledger Quest to Rukbe bookkeeping software when API access is available.

> **Dependency:** Rukbe API credentials and documented endpoints. This phase is exploratory until access is confirmed.

| Work item | Notes |
|-----------|-------|
| API discovery | Auth, rate limits, sandbox environment |
| Export journal entries | Map Bright Path COA → Rukbe accounts |
| Import bank feed (optional) | Real transactions as practice material |
| Handoff flow | Year-End Boss → "Send to Rukbe" CTA |
| Deep links | Open Rukbe report from Reports Room |

**Success metric:** Learner exports June 2024 practice entries into a Rukbe sandbox company.

**Fallback if no API:** CSV export matching Rukbe import format; manual upload.

---

## Phase 5 — Certificates and cohort leaderboard

**Goal:** Social proof and instructor-led programs.

| Work item | Notes |
|-----------|-------|
| Verifiable certificates | Unique ID, completion date, mastery score, PDF download |
| Cohort leaderboard | Opt-in; weekly XP or mastery rank |
| Instructor-assigned cohorts | Group enrollments tied to Phase 3 |
| Share links | LinkedIn-ready certificate URL |
| Privacy controls | Hide from leaderboard, delete account data |

**Success metric:** Instructor runs a 4-week cohort; top learners appear on a leaderboard; graduates receive shareable certificates.

---

## Cross-cutting concerns (all phases)

| Topic | Approach |
|-------|----------|
| Accessibility | WCAG 2.1 AA target; keyboard nav, ARIA labels, reduced motion |
| Money | Always cents internally; `formatCentsForMessage` for display |
| Testing | Expand integration tests as challenges are added |
| Content quality | `lib/content/validation.ts` + admin preview warnings |
| Performance | No heavy animation libs; static lesson pages where possible |

---

## Suggested timeline (indicative)

| Phase | Effort | Depends on |
|-------|--------|------------|
| 1 — MVP | Complete | — |
| 2 — Supabase | 2–4 weeks | Supabase project |
| 3 — Instructor | 3–5 weeks | Phase 2 |
| 4 — Rukbe | 2–6 weeks | API access |
| 5 — Certificates + leaderboard | 2–3 weeks | Phase 2–3 |

Phases 4 and 5 can run in parallel once Phase 2 is stable.
