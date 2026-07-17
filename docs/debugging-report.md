# Debugging report — Internal Server Error (500)

**Date:** 2026-06-17  
**App:** Ledger Quest  
**Approach:** Reproduce → diagnose → minimal fix (no architectural rewrite)

---

## 1. Symptoms

- Every route returns **HTTP 500 Internal Server Error** in development (`/`, `/dashboard`, `/lessons/*`, `/challenges/*`, etc.)
- `npm run build` **succeeds** (no TypeScript or compile errors)
- `npm test` **passes** (133/133)
- `npm run lint` **passes**

This pattern means the **application source is valid**; the failure is **runtime environment / dev cache**, not broken React components or accounting logic.

---

## 2. Failing routes (before fix)

| Route | Dev (stale cache) | Production (clean build) |
|-------|-------------------|--------------------------|
| `/` | 500 | 200 |
| `/dashboard` | 500 | 200 |
| `/reports` | 500 | 200 |
| `/profile` | 500 | 200 |
| `/certificate` | 500 | 200 |
| `/lessons/lesson-why-bookkeeping` | 500 | 200 |
| `/challenges/challenge-classify-transaction` | 500 | 200 |
| `/lessons/bad-id` | 500 | **404** (correct) |

---

## 3. Exact error (terminal)

From `next dev` on a corrupted cache:

```
⨯ [Error: ENOENT: no such file or directory, open
  '...\Gamified BookKeeping Software\.next\static\development\_buildManifest.js.tmp.<random>']
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
```

Next.js tries to atomically write `_buildManifest.js.tmp.*` during dev compilation. The temp file disappears before rename — classic symptom of:

1. **OneDrive sync** on the project folder (workspace path contains `OneDrive\Microsoft Copilot Chat Files\...`)
2. **Stale `.next` cache** from a previous build while dev server was running
3. **Multiple dev servers** on ports 3000 and 3001 fighting over the same `.next` directory

Secondary error when starting production:

```
Error: listen EADDRINUSE: address already in use :::3000
```

Zombie Node processes (PIDs 80840, 39096) held ports while serving broken state.

---

## 4. Dependency chain

```
User opens localhost:3000
  → stale next dev process (port 3000)
  → Turbopack/webpack writes to .next/static/development/
  → OneDrive sync intercepts/deletes .tmp file
  → ENOENT on _buildManifest.js.tmp
  → Next.js cannot serve page
  → HTTP 500 Internal Server Error (all routes)
```

Layout and pages compile successfully; failure happens **after** compile when reading/writing the dev build manifest.

---

## 5. Root cause hypothesis

**Primary:** Corrupted or race-prone `.next` dev cache under a **OneDrive-synced** directory, amplified by **Turbopack** temp writes and **multiple concurrent** dev servers.

**Ruled out:**

- TypeScript / import errors (`npm run build` clean)
- Missing lesson/challenge IDs (404 works for bad IDs in production)
- Server components calling `localStorage` (storage facade guards `typeof window`)
- Supabase references (adapter not connected; uses `localStorageAdapter` only)
- Accounting logic crashes (133 unit/integration tests pass)

---

## 6. Fix plan (minimal)

| # | Action | Risk |
|---|--------|------|
| 1 | Stop all Node processes on ports 3000/3001 | Low |
| 2 | Delete `.next` (`npm run clean`) | Low |
| 3 | `npm run build` then `npm run start` OR `npm run dev:clean` | Low |
| 4 | Default `dev` script without `--turbopack` (more stable on OneDrive) | Low |
| 5 | Document OneDrive: exclude `.next` and `node_modules` from sync | None |
| 6 | Optional: move repo outside OneDrive for daily dev | None |

**No application code rewrite required.**

---

## 7. Risk areas (monitor)

| Area | Status | Notes |
|------|--------|-------|
| OneDrive + `.next` | High env risk | Exclude folder from sync or use `dev:clean` |
| Turbopack + sync | Medium | Use `npm run dev` (webpack) or `dev:turbo` only if stable |
| Port conflicts | Medium | Kill stale `node` before restart |
| 9 stub challenges | Known gap | Show "coming soon", not 500 |
| `/reports` not gated | By design | Dashboard worlds reflect unlock |
| `npm run typecheck` | Not defined | Use `npm run build` for type checking |

---

## 8. Verification commands

```bash
npm run clean
npm run build          # must exit 0
npm test               # 133 passed
npm run lint           # no errors
npm run dev:clean      # dev server, then curl /
PORT=3002 npm start    # production smoke test (if 3000 busy)
```

**Expected after fix:** all main routes return **200**; invalid IDs return **404**.

---

## 9. What was changed (this session)

| File | Change | Why |
|------|--------|-----|
| `scripts/clean-next.mjs` | Added | Cross-platform `.next` removal |
| `package.json` | `dev` without turbopack; added `dev:clean`, `dev:turbo`, `clean` | Stable dev on OneDrive; easy recovery |
| `README.md` | Troubleshooting blurb | Points users to `dev:clean` |
| `docs/debugging-report.md` | This file | Record root cause and proof |

**No changes** to routes, accounting logic, storage adapter, or component architecture.

---

## 10. Command results (final)

| Command | Result |
|---------|--------|
| `npm run build` | ✓ Success |
| `npm test` | ✓ 133/133 passed |
| `npm run lint` | ✓ No warnings |
| `npx tsc --noEmit` | Not in package.json; build covers types |
| Production `npm start` (port 3002, clean `.next`) | ✓ All routes 200 |
| `next dev` (port 3003, clean `.next`, webpack) | ✓ All routes 200 |
| Stale dev (port 3000/3001, corrupt `.next`) | ✗ 500 ENOENT |

---

## 11. Remaining known issues

1. **OneDrive** — may recur until `.next` is excluded from sync or project is moved locally
2. **Stub challenges** — 9 challenges show empty state (not 500)
3. **Certificate page** — uses mock server progress; client merge on dashboard is authoritative
4. **Long-term** — consider moving workspace to `C:\dev\ledger-quest` outside OneDrive

---

## 12. Quick recovery (copy-paste)

**PowerShell:**

```powershell
# Stop dev servers on 3000/3001 (adjust PIDs if needed)
Get-NetTCPConnection -LocalPort 3000,3001 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

cd "path\to\Gamified BookKeeping Software"
npm run dev:clean
```

**Recommended OneDrive setting:** Right-click project folder → OneDrive → *Free up space* / exclude `.next` from backup, or move repo outside OneDrive.
