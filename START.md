# Start MarketHub

## Status checklist

- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] Code pushed to GitHub
- [ ] **You:** Replace placeholders in `backend/.env` with Supabase credentials
- [ ] Run `bash scripts/setup.sh` (creates tables + demo data)
- [ ] Deploy frontend (Vercel) + backend (Render) — see **DEPLOY.md**

## Option A — Supabase (recommended)

## 1. Supabase `.env`

Open `backend/.env` and replace:

- `PROJECT_REF` → your project ref (from Supabase URL)
- `YOUR_PASSWORD` / `REGION` → your DB password and region
- `JWT_SECRET` → a long random string

Get URLs from: **Supabase → Project Settings → Database → Connect → Prisma**

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
JWT_SECRET=change-me-to-a-long-random-string
```

## Option B — Local PostgreSQL (Docker)

If you have Docker:

```bash
docker compose up -d
```

Set in `backend/.env`:

```env
DATABASE_URL="postgresql://markethub:markethub@localhost:5432/markethub"
DIRECT_URL="postgresql://markethub:markethub@localhost:5432/markethub"
JWT_SECRET=dev-secret-change-in-production
```

## 2. Database setup

```bash
npm run setup
```

Check DB connection: http://localhost:4000/health/db

## 3. Run

**Terminal 1:**
```bash
npm run dev:backend
```

**Terminal 2:**
```bash
npm run dev:frontend
```

Open http://localhost:3000

**Demo login:** `customer@demo.com` / `Password123!`

## Commands

| Command | Purpose |
|---------|---------|
| `npm run install-node` | Download Node into `.tools/` |
| `npm run setup:deps` | Install packages only |
| `npm run setup` | DB push + seed (needs real `.env`) |
| `npm run dev:backend` | API on :4000 |
| `npm run dev:frontend` | Store on :3000 |
| `npm run db:studio` | Browse DB in Prisma Studio |
