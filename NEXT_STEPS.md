# Next steps — MarketHub

## Done

- [x] Full-stack MVP (shop, cart, checkout, seller dashboard)
- [x] Supabase connected (`tfqchbjkykeuvlvqleor`, region `aws-1-eu-north-1`)
- [x] Database seeded (demo users & products)
- [x] Code on GitHub: [E-COMMERCE-WEBSITE](https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE)
- [x] Local dev: API `:4000`, store `:3000`

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

## Optional later (v2)

- Stripe live keys for real payments
- Supabase anon key + Auth UI
- Custom domain on Vercel
- Cloudinary for image uploads
- Reset DB password (you shared it in chat earlier)

---

## Local commands

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
export PATH=".tools/node/bin:$PATH"

bash scripts/npm.sh run dev --prefix backend   # :4000
bash scripts/npm.sh run dev --prefix frontend  # :3000
```

See **DEPLOY.md** for troubleshooting.
