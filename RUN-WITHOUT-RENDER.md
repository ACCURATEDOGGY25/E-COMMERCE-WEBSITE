# Run MarketHub without Render

Render is **optional**. Use this until you add a card and deploy **markethub-api**.

## Every time you want the shop fully working

**1. Terminal** (leave open):

```bash
cd "/Users/mac/Documents/NEW WEBSITE"
bash scripts/keep-api-online.sh
```

**2. Copy the API URL** it prints (`https://….trycloudflare.com`).

**3. Vercel** → **esite2026** → **Settings** → **Environment Variables**  
   - `API_URL` = that URL  
   - **Redeploy**

Or push from Mac (updates Vercel via GitHub):

```bash
bash scripts/sync-api-url.sh "$(grep '^API_URL=' PUBLIC_URLS.txt | cut -d= -f2-)" --force
git add vercel.json frontend/.env.production
git commit -m "Update API URL"
git push origin main
```

## Your URLs

- **Store:** https://esite2026.vercel.app  
- **Login:** customer@demo.com / Password123!

## Later (Render)

See `RENDER-NOW.md` when ready.
