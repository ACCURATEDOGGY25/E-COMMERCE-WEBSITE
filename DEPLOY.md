# Deploy MarketHub

Your code is on GitHub: [E-COMMERCE-WEBSITE](https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE)

## 1. Database (Supabase) — do this first

1. Create a project at [supabase.com](https://supabase.com)
2. Copy **Prisma** URLs into `backend/.env` (locally)
3. Run locally:

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
export PATH=".tools/node/bin:$PATH"   # if npm not installed globally
bash scripts/setup.sh
```

## 2. Frontend → Vercel

1. [vercel.com/new](https://vercel.com/new) → Import **ACCURATEDOGGY25/E-COMMERCE-WEBSITE**
2. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework** | Next.js |
| **Branch** | `main` |

3. **Environment variables:**

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | Your backend URL (step 3), e.g. `https://markethub-api.onrender.com` |

4. Deploy → open your `.vercel.app` URL

## 3. Backend → Render (free tier)

1. [render.com](https://render.com) → **New → Blueprint** or **Web Service**
2. Connect repo `E-COMMERCE-WEBSITE`
3. Use `render.yaml` in the repo root (or manual):

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Build** | `npm install && npx prisma generate && npm run build` |
| **Start** | `npm start` |

4. **Environment variables** (from Supabase):

- `DATABASE_URL` — pooler, port **6543**, `?pgbouncer=true`
- `DIRECT_URL` — port **5432**
- `JWT_SECRET` — long random string
- `FRONTEND_URL` — your Vercel URL, e.g. `https://your-app.vercel.app`
- `NODE_ENV` — `production`

5. After first deploy, run once locally (or Render shell):

```bash
npx prisma db push
npm run db:seed
```

6. Copy the Render URL → set as `NEXT_PUBLIC_API_URL` in Vercel → **Redeploy** frontend

## 4. Verify

- API health: `https://YOUR-API-URL/health`
- Store loads products after DB is seeded
- Login: `customer@demo.com` / `Password123!`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Vercel: empty repo | Ensure branch `main` has code (push with `bash push.sh`) |
| Vercel: build fails | Root Directory must be `frontend` |
| API CORS errors | Set `FRONTEND_URL` on backend to exact Vercel URL |
| No products | Run `npm run setup` with real Supabase `.env` |
