# Your Supabase project

| | |
|--|--|
| **Project URL** | https://tfqchbjkykeuvlvqleor.supabase.co |
| **Project ref** | `tfqchbjkykeuvlvqleor` |
| **DB region** | `aws-1-eu-north-1` (use exact URIs from dashboard) |
| **Database settings** | https://supabase.com/dashboard/project/tfqchbjkykeuvlvqleor/settings/database |

## Important — use exact connection strings

Do **not** build URLs by hand (region/password encoding is easy to get wrong).

1. Open **Connect → Prisma** in the dashboard
2. Copy the full **Transaction pooler** URI → `backend/supabase.paste.env` → `DATABASE_URL=`
3. Copy the full **Session / Direct** URI → `DIRECT_URL=`
4. Run:

```bash
bash scripts/apply-supabase-paste.sh
bash scripts/setup.sh
```

## If you see `Tenant or user not found`

- Wrong **region** in the hostname (fix by pasting from dashboard)
- Wrong **database password** (reset in Database settings → Database password)
- Project still **provisioning** (wait a few minutes)

## Security

If you shared your DB password in chat, **reset it** in Supabase → Database settings → Reset database password, then paste the new URIs.
