# Continue MarketHub setup

## Right now (5 min) — fix login on the live store

**In Mac Terminal** (leave open):

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/keep-api-online.sh
```

Copy the **API** URL it prints, then in **Vercel → esite2026 → Settings → Environment Variables**:

- `API_URL` = that URL  
- Redeploy

Or auto-update repo files and push:

```bash
bash scripts/sync-api-url.sh "$(grep '^API_URL=' PUBLIC_URLS.txt | cut -d= -f2-)" --force
git add vercel.json frontend/.env.production
git commit -m "Update API tunnel URL"
git push origin main
```

## Permanent (no Mac) — see `RENDER-NOW.md`

```bash
bash scripts/open-render-resume.sh
```

When Render is live:

```bash
bash scripts/switch-to-render.sh && git push origin main
```

## Status

```bash
bash scripts/status.sh
```

**Store:** https://esite2026.vercel.app
