# Next steps — MarketHub

## Done

- [x] Full-stack MVP (shop, cart, checkout, seller dashboard)
- [x] Supabase connected (`tfqchbjkykeuvlvqleor`, region `aws-1-eu-north-1`)
- [x] Database seeded (demo users & products)
- [x] Code on GitHub: [E-COMMERCE-WEBSITE](https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE)
- [x] Local dev: API `:4000`, store `:3000`
- [x] **Automatic public URL** — `bash scripts/deploy-automatic.sh` (see `PUBLIC_URLS.txt`)
- [ ] **24/7 cloud** — Render + Vercel (optional; API still suspended on Render)

---

## Step 1 — Deploy backend (Render) ~15 min

1. Go to [render.com](https://render.com) → sign in with GitHub
2. **New +** → **Blueprint** → connect repo **ACCURATEDOGGY25/E-COMMERCE-WEBSITE**
3. Render reads `render.yaml` from the repo
4. Add environment variables (copy from local `backend/.env`):

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Same as local (port **6543**, `?pgbouncer=true`) |
| `DIRECT_URL` | Same as local (port **5432**) |
| `JWT_SECRET` | Same as local |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Leave empty for now; add Vercel URL after step 2 |

5. Deploy → copy your API URL, e.g. `https://markethub-api.onrender.com`
6. Test: `https://YOUR-API.onrender.com/health` → `{"status":"ok"}`

> **If you see “Service Suspended”** on `markethub-api.onrender.com`: open [Render Dashboard](https://dashboard.render.com) → resume the service or create a **new** Web Service from the same repo (`render.yaml`). Free-tier services suspend after inactivity.

> Tables already exist in Supabase from local `setup` — no need to seed again unless you use a new DB.

---

## Step 2 — Deploy frontend (Vercel) ~10 min

1. [vercel.com/new](https://vercel.com/new) → import **E-COMMERCE-WEBSITE**
2. Settings (repo includes root `vercel.json` with `"rootDirectory": "frontend"`):

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` (or leave default if using root `vercel.json`) |
| Framework | Next.js |
| Branch | `main` |

3. Environment variable:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | Your Render URL from step 1 (or `http://localhost:4000` for testing only) |

4. Deploy → confirm URL in Vercel **Domains** (must show **MarketHub** in browser tab, not 404)

Your preview may look like: `https://e-commerce-website-two-phi-62.vercel.app`

### Vercel URL check (June 2026)

| URL | Status | Notes |
|-----|--------|--------|
| `e-commerce-website-two-phi-62.vercel.app` | **404** | Redeploy needed — latest `main` includes root `vercel.json` |
| `e-commerce-website.vercel.app` | **500** | Likely wrong Root Directory — set to `frontend` and redeploy |
| `e-commerce-website-two-phi.vercel.app` | **Wrong app** | “Nest ONDC”, not MarketHub |

**Fix:** Vercel → project **E-COMMERCE-WEBSITE** → **Deployments** → **Redeploy** latest `main` (commit `ef71ae6+`).  
Settings → **Root Directory** = `frontend`, **Production Branch** = `main`.  
Success = browser tab title **MarketHub** and categories on the homepage.

---

## Step 3 — Connect frontend ↔ backend

1. In **Render** → your API service → **Environment**
2. Set `FRONTEND_URL` to your **exact** Vercel URL (no trailing slash), e.g. `https://e-commerce-website-two-phi-62.vercel.app`
3. Save → Render redeploys
4. In **Vercel** → redeploy if you changed env vars

---

## Step 4 — Verify production

- [ ] Homepage shows products
- [ ] Login: `customer@demo.com` / `Password123!`
- [ ] Add to cart → checkout
- [ ] Seller: `seller@demo.com` / `Password123!` → `/seller`

---

## Features (v2) — done

See **FEATURES.md** — Stripe checkout UI, reviews, Cloudinary upload, profile, notifications.

## Permanent Render (24/7 API)

```bash
bash scripts/deploy-render-permanent.sh
```

Or with API key: `bash scripts/setup-deploy-keys.sh` then `bash scripts/deploy-all.sh`

## Optional later

- Supabase Auth UI (anon key)
- Custom domain on Vercel
- Reset DB password if shared earlier

---

## Fully automatic (no Render/Vercel clicks)

```bash
bash scripts/deploy-automatic.sh
```

Opens a **public shop URL** via Cloudflare tunnel (uses your local API + Supabase). Keep the terminal open while you share the link.

---

## One-command deploy (after API keys)

```bash
bash scripts/setup-deploy-keys.sh   # paste Render + Vercel tokens once
bash scripts/deploy-all.sh          # resume API, deploy store, verify
```

---

## Cursor / Mac prompts

When the agent runs deploy or login commands, Cursor may ask for **network**, **git**, or **full disk** access — click **Allow** or **Always allow**.

| Action | What may pop up |
|--------|------------------|
| `bash push.sh` | Browser → GitHub device login |
| `bash scripts/vercel-login.sh` | Browser → Vercel login |
| `bash scripts/open-deploy-dashboards.sh` | Browser → Vercel + Render tabs |

**Stuck terminal?** If `bash push.sh` hangs on “Pushing…”, press **Ctrl+C** — GitHub is already logged in; run `git push origin main` or ignore (repo is up to date).

---

## Quick commands

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
export PATH=".tools/node/bin:$PATH"

bash scripts/status.sh              # check local + public + cloud
bash scripts/deploy-automatic.sh    # public shop URL (no dashboard)
bash scripts/npm.sh run dev --prefix backend   # :4000 only
bash scripts/npm.sh run dev --prefix frontend  # :3000 only
```

See **DEPLOY.md** for troubleshooting.

### Verify from Terminal

```bash
bash scripts/verify-production.sh
# Or with your URLs:
bash scripts/verify-production.sh https://YOUR.vercel.app https://YOUR-API.onrender.com
```
I 