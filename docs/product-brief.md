# Ledger Quest: Bookkeeping for Business Owners

## Product Brief

### Vision

Ledger Quest is a gamified bookkeeping education web app that teaches beginner business owners to maintain their books daily, understand financial statements, complete bookkeeping before tax season, and make decisions from real financial data. The experience should feel like running a small business simulator—not a dry quiz app.

### Audience

- **Primary:** Business owners with no prior bookkeeping knowledge
- **Mindset:** Practical, time-constrained, motivated to avoid tax-time surprises
- **Success looks like:** Confident daily record-keeping, readable P&L and Balance Sheet, and a clean handoff to an accountant

### Learning Goals

1. Record everyday financial transactions consistently
2. Understand double-entry bookkeeping and sales tax basics
3. Classify transactions into correct account categories
4. Build a trial balance and generate Profit & Loss and Balance Sheet reports
5. Complete common year-end adjusting entries (depreciation, home office, mileage)
6. Prepare books for accountant handoff and tax preparation

### Core Principle

**Consistency beats perfection.** Users learn that reliable, repeatable bookkeeping habits matter more than memorizing every rule on day one.

---

## Product Experience

### Four Worlds (Course Progression)

| World | Course Week | Theme | Player Goal |
|-------|-------------|-------|-------------|
| **Daily Ledger** | Week 1 | What is bookkeeping? | Record June 2024 transactions with double-entry accuracy |
| **Account Sorter** | Week 2 | Transactions & accounts | Classify spending/selling; understand trial balance and account types |
| **Reports Room** | Week 3 | Financial statements | Turn trial balance into P&L and Balance Sheet; draw insights |
| **Year-End Boss Fight** | Week 4 | Year-end journals | Depreciation, home office, mileage; hand off to accountant |

### Gamification Systems

- **XP** — Earned for correct entries, completed challenges, and streaks
- **Streaks** — Reward daily practice (recording transactions, reviewing reports)
- **Badges** — Milestones (first balanced trial balance, first P&L, tax-ready books)
- **Progress bars** — Per-world and overall course completion
- **Mastery score** — Rolling accuracy across challenges; decays slightly on repeated mistakes
- **Immediate feedback** — Every answer explains *why* it is correct or incorrect in plain language

### Fake Business Scenario

Users play as the owner of **Bright Path Consulting**, a solo consulting business. Sample June 2024 transactions include meals, entertainment, vehicle expenses, office supplies, travel, equipment purchases, client invoices, and sales tax. No live accounting integration—all data is local and educational.

### Non-Goals (v1)

- No connection to QuickBooks, Xero, or bank feeds
- No real user business data import
- No multi-user or accountant collaboration portal

---

## Product Requirements

### Platform

- Web app: **Next.js**, **TypeScript**, **Tailwind CSS**
- Clean component architecture; accounting logic in pure utility modules
- Local data first; architecture ready for **Supabase** later

### UX Standards

- Mobile-first responsive layout
- Accessible UI: clear contrast, semantic HTML, keyboard-friendly interactions
- Beginner-friendly copy; avoid unexplained jargon
- Business-simulator tone: purposeful, encouraging, not childish

### Content Quality

- Challenges must be **educationally accurate** (double-entry, account types, statement logic)
- Feedback must teach, not just score
- June 1–30, 2024 transaction set is the primary practice dataset

### Success Metrics (Future)

- World completion rate
- Challenge accuracy and retry patterns
- Streak retention
- Time to first balanced trial balance

---

## Course Source of Truth

The curriculum follows a 4-week structure:

1. **Week 1 — What is bookkeeping?** Everyday transactions, why bookkeeping matters (organization, health, decisions, taxes, banks, partners, legal), double-entry, sales tax. Practice: record all June 2024 transactions.
2. **Week 2 — Transactions** — Cash vs non-cash spending/selling, trial balance, account categories (fixed assets, current assets, long-term liabilities, current liabilities, income, expenses, equity).
3. **Week 3 — Financial statements** — Trial balance → P&L and Balance Sheet; insights for decisions.
4. **Week 4 — Year-end** — Depreciation, home office, mileage claim, accountant handoff for tax prep.

See [course-map.md](./course-map.md) for challenge-level mapping and [technical-plan.md](./technical-plan.md) for implementation architecture.
