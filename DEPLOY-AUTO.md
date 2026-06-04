# Auto deploy — GitHub + Vercel

Every push to **`main`** deploys your store automatically.

## How it works

```text
You change code → bash scripts/deploy-push.sh → GitHub (main) → Vercel builds & deploys
```

| Step | What happens |
|------|----------------|
| 1 | `deploy-push.sh` commits (optional) and pushes to GitHub |
| 2 | GitHub Actions runs **CI** + **Deploy** workflows (build check) |
| 3 | **Vercel** detects the push and redeploys **esite2026.vercel.app** |

## One command (use after changes)

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/deploy-push.sh "Describe your change"
```

Or:

```bash
bash push.sh   # push only (if already committed)
```

## Vercel setup (one time)

1. [vercel.com/dashboard](https://vercel.com/dashboard) → project **esite2026**
2. **Settings → Git** → connected to **ACCURATEDOGGY25/E-COMMERCE-WEBSITE**, branch **`main`**
3. **Root Directory:** `frontend`
4. **Environment Variables** (Production):
   - `API_URL` = your live API (tunnel URL or `https://markethub-api.onrender.com`)
   - Optional: `NEXT_PUBLIC_API_URL` = same value

Do **not** rely on tunnel URLs committed in git — they expire.

## GitHub Actions

| Workflow | When |
|----------|------|
| `.github/workflows/ci.yml` | Every push/PR — builds frontend + backend |
| `.github/workflows/deploy.yml` | Every push to `main` — verify + deploy summary |

### Optional Vercel CLI from GitHub

Repo → **Settings → Secrets**:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Optional **Variables**: `API_URL`, `NEXT_PUBLIC_API_URL`

## Render (API, later)

Render does **not** auto-deploy from this repo unless you connect the blueprint. When ready: `RENDER-NOW.md`.

## Live URLs

- **Store:** https://esite2026.vercel.app  
- **Repo:** https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE  
