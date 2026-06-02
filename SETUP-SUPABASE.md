# Connect Supabase (5 minutes)

Your shop preview works locally, but **login, cart, and real products** need a database.

## Steps

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Wait for the project to finish provisioning
3. Open **Project Settings → Database** (or **Connect → ORMs → Prisma**)
4. Copy both URLs into `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET=paste-a-long-random-string-here
```

5. Run setup (no global npm needed):

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
export PATH=".tools/node/bin:$PATH"
bash scripts/setup.sh
```

6. Restart the API if it was running:

```bash
bash scripts/npm.sh run dev --prefix backend
```

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@demo.com | Password123! |
| Seller | seller@demo.com | Password123! |

## Password tips

- If your DB password has `@`, `#`, or `%`, [URL-encode](https://www.urlencoder.org/) it in the connection string
- Use port **6543** + `?pgbouncer=true` only on `DATABASE_URL`
- Use port **5432** on `DIRECT_URL`
