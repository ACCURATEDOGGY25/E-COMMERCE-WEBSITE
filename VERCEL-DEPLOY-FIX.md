# Vercel deploy failed — fix

## Common cause

Build ran from the **repo root** instead of **`frontend`**, so you see:

```text
npm error Missing script: "build"
```

## Fix in Vercel dashboard (esite2026)

1. [vercel.com/dashboard](https://vercel.com/dashboard) → **esite2026** (or your project)
2. **Settings** → **General** → **Root Directory**
3. Set to **`frontend`** → **Save**
4. **Deployments** → latest failed deploy → **Redeploy**

## Optional env (after Render API is live)

| Name | Value |
|------|--------|
| `API_URL` | `https://markethub-api.onrender.com` |
| `NEXT_PUBLIC_API_URL` | same (optional; proxy works without it) |

## Verify

- Build log should show `next build` inside `frontend`
- Live URL: https://esite2026.vercel.app — title **MarketHub**
