# Deploy MarketHub on Vercel

## Your URLs right now

| Type | URL |
|------|-----|
| **Working (tunnel)** | See `PUBLIC_URLS.txt` → `STORE_URL` |
| **Local** | http://localhost:3000 |
| **Vercel** | You must create/deploy — see below |

`https://e-commerce-website.vercel.app` is an **old different app** (not MarketHub).  
`https://e-commerce-website-two-phi-62.vercel.app` is **404** — redeploy or create a new project.

---

## Correct Vercel setup (one time)

1. [vercel.com/new](https://vercel.com/new) → **Import** `ACCURATEDOGGY25/E-COMMERCE-WEBSITE`
2. **Project name:** e.g. `markethub` or `e-commerce-website` (new deploy, not the old Nest app)
3. **Root Directory:** `frontend` ← required
4. **Framework:** Next.js (auto)
5. **Environment variables** (Production + Preview):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://markethub-api.onrender.com` (after Render is live) |
| | or your tunnel API from `PUBLIC_URLS.txt` (temporary) |

6. **Deploy** → open **Domains** → copy `https://….vercel.app`
7. Tab title must say **MarketHub** (not 500, not 404)

---

## CLI deploy

```bash
bash scripts/deploy-vercel.sh
# or with token:
bash scripts/setup-deploy-keys.sh
bash scripts/deploy-vercel.sh
```

---

## After Vercel works

On **Render** → `FRONTEND_URL` = your exact Vercel URL (no trailing `/`)

Test: `customer@demo.com` / `Password123!`
