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

## Permanent API (no Mac needed)

```bash
bash scripts/render-env-paste.sh   # env copied to clipboard
```

Render → Resume **markethub-api** → Environment → Paste → Deploy  
When Render shows Live:

```bash
bash scripts/switch-to-render.sh
git push origin main
```

Check anytime: `bash scripts/status.sh`

## If login stops working

Tunnel URL changed. In Terminal:

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/start-overnight.sh
```

Copy new `API_URL` from `PUBLIC_URLS.txt` into Vercel → Redeploy.
