# Connect Supabase

## Option A — Paste env vars (easiest)

1. Open **`backend/supabase.paste.env`** and paste from Supabase → **Connect → Prisma**:
   ```env
   DATABASE_URL=postgresql://...   # Transaction pooler (6543)
   DIRECT_URL=postgresql://...     # Direct (5432)
   ```

2. Open **`frontend/supabase.paste.env`** and paste from **Settings → API**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tfqchbjkykeuvlvqleor.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```

3. Apply:
   ```bash
   bash scripts/apply-supabase-paste.sh
   bash scripts/setup.sh
   ```

Paste files are **gitignored** — secrets stay on your machine.

---

## Option B — Interactive setup

Run in Terminal (no global `npm` required):

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/configure-supabase.sh
```

You will be asked for:

| Prompt | Where to find it |
|--------|------------------|
| **Project ref** | Supabase URL: `https://[ref].supabase.co` |
| **Database password** | Password you set when creating the project |
| **Region** | In the connection string, e.g. `us-east-1` |

Then run:

```bash
bash scripts/setup.sh
```

## Option B — Copy template manually

1. Open **`backend/env.supabase.example`** — copy `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` into **`backend/.env`**
2. Open **`frontend/env.supabase.example`** — copy into **`frontend/.env.local`**
3. Get exact URLs from: **Supabase → Project Settings → Database → Connect → Prisma**

### Connection strings

| Variable | Port | Notes |
|----------|------|--------|
| `DATABASE_URL` | **6543** | Add `?pgbouncer=true` at the end |
| `DIRECT_URL` | **5432** | For `prisma db push` and seed |

### Example `backend/.env`

```env
DATABASE_URL="postgresql://postgres.abcdefgh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefgh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=use-a-long-random-string-here
```

### Example `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Optional (Project Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## After setup

```bash
bash scripts/setup.sh          # tables + demo data
bash scripts/npm.sh run dev --prefix backend
bash scripts/npm.sh run dev --prefix frontend
```

**Demo login:** `customer@demo.com` / `Password123!`

## Files (never commit secrets)

| File | Purpose |
|------|---------|
| `backend/.env` | Database + JWT (gitignored) |
| `frontend/.env.local` | Public API URL (gitignored) |
| `backend/env.supabase.example` | Template only |
| `frontend/env.supabase.example` | Template only |

## Password special characters

If your DB password contains `@`, `#`, `%`, etc., URL-encode it in the connection string, or use `bash scripts/configure-supabase.sh` (encodes automatically).
