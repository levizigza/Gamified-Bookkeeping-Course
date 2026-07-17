# Deployment guide

Ledger Quest is a standard **Next.js 15** App Router application. It has no server-side database dependency in the MVP — progress is stored in the learner's browser (localStorage).

---

## Pre-deploy checklist

```bash
npm install
npm test          # 133 tests should pass
npm run build     # Must complete without errors
npm run lint      # No ESLint warnings
```

Confirm environment:

- Node.js **20+** on the build host
- No required environment variables for the local-storage MVP

---

## Vercel (recommended)

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build`
5. Output: default (`.next`)
6. Deploy

### Vercel settings

| Setting | Value |
|---------|-------|
| Install command | `npm install` |
| Node.js version | 20.x |
| Root directory | `.` |

No `NEXT_PUBLIC_*` variables are required until Supabase is connected (Phase 2).

### Custom domain

Add your domain under **Project → Settings → Domains**. Vercel provisions HTTPS automatically.

---

## Self-hosted (Node)

```bash
npm ci
npm run build
npm run start
```

Default port: **3000**. Set `PORT` to override.

### Process manager (PM2 example)

```bash
pm2 start npm --name ledger-quest -- start
pm2 save
```

Put nginx or Caddy in front for TLS termination.

---

## Static export

Ledger Quest uses client-side storage and dynamic challenge routes. **Do not** use `output: 'export'` without refactoring — stick with the default Node server or Vercel.

---

## Environment variables (future — Supabase)

When Phase 2 is enabled, add to the hosting dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env.local`. See [supabase-setup.md](./supabase-setup.md).

---

## Post-deploy smoke test

1. Landing page loads at `/`
2. Dashboard at `/dashboard` shows stat cards and worlds
3. Open `/lessons/lesson-double-entry` — lesson content renders
4. Start `/challenges/challenge-classify-transaction` — challenge loads
5. Complete a question — XP toast and feedback appear
6. Reports at `/reports` — tabs switch between statements
7. Profile at `/profile` — badges and mastery display
8. Mobile: hamburger menu opens navigation (viewport &lt; 640px)

---

## CI/CD (optional)

Example GitHub Actions workflow:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

Connect the same repository to Vercel for automatic preview deployments on pull requests.

---

## Monitoring

- **Vercel Analytics** — optional, no code changes for basic traffic
- **Error tracking** — add Sentry or similar in `app/error.tsx` when moving beyond MVP
- No backend logs in Phase 1 (client-only persistence)

---

## Rollback

On Vercel: **Deployments → previous deployment → Promote to Production**.

On self-hosted: redeploy the previous build artifact or git tag.
