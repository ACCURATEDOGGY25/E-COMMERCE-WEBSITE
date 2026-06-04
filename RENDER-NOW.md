# Permanent API on Render (15 min, no Mac needed)

Your store **https://esite2026.vercel.app** works best with a 24/7 API on Render.

## Steps

1. **Copy env to clipboard**
   ```bash
   cd "/Users/mac/Documents/NEW WEBSITE"
   bash scripts/render-env-paste.sh
   ```

2. **Render dashboard**
   - [dashboard.render.com](https://dashboard.render.com)
   - Open **markethub-api** (or **New → Blueprint** → repo `E-COMMERCE-WEBSITE`)
   - If **Suspended** → **Resume**
   - **Environment** → paste → **Save**
   - **Manual Deploy** → wait until **Live**

3. **Test**
   ```bash
   curl https://markethub-api.onrender.com/health
   ```
   Should return `{"status":"ok",...}`

4. **Point Vercel at Render**
   ```bash
   bash scripts/switch-to-render.sh
   git add vercel.json frontend/.env.production
   git commit -m "Switch production API to Render"
   git push origin main
   ```

5. **Stop Mac tunnel** — close Terminal running `keep-api-online.sh`

## Check status anytime

```bash
bash scripts/status.sh
```
