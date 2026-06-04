# MarketHub — you’re set for tonight

## Your live store

**https://esite2026.vercel.app**

Login: `customer@demo.com` / `Password123!`

## What’s running

- **Vercel** — storefront (redeployed with API URL)
- **Mac API + tunnel** — must stay on; started with `bash scripts/start-overnight.sh`

## Before sleep

1. **Leave your Mac on** (not asleep long-term, or tunnel stops)
2. Don’t close Terminal if you ran `keep-api-online.sh` yourself — or use overnight script above
3. Optional: plug in power

## Tomorrow (permanent, no Mac needed)

```bash
bash scripts/render-env-paste.sh
```

Render → Resume **markethub-api** → paste env → Deploy  
Vercel → `API_URL` = `https://markethub-api.onrender.com` → Redeploy

## If login stops working

Tunnel URL changed. In Terminal:

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/start-overnight.sh
```

Copy new `API_URL` from `PUBLIC_URLS.txt` into Vercel → Redeploy.
