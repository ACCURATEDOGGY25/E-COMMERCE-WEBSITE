#!/usr/bin/env bash
# Run AFTER logging into Render + Vercel dashboards
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"

VERCEL_URL="${VERCEL_URL:-https://e-commerce-website-two-phi-62.vercel.app}"
API_URL="${API_URL:-https://markethub-api.onrender.com}"

echo "=== Finish MarketHub production (3 clicks each platform) ==="
echo ""
echo "RENDER (API still shows SUSPENDED until you Resume):"
echo "  1. Open markethub-api service"
echo "  2. Click 'Resume' or 'Manual Deploy' (top right)"
echo "  3. Environment → confirm DATABASE_URL, DIRECT_URL, JWT_SECRET exist"
echo "  4. Wait until status = Live"
echo ""
echo "VERCEL (store still 404 until Redeploy):"
echo "  1. Project E-COMMERCE-WEBSITE → Settings → Root Directory = frontend"
echo "  2. Deployments → Redeploy latest main"
echo "  3. Settings → Environment → NEXT_PUBLIC_API_URL = $API_URL"
echo "  4. Render → FRONTEND_URL = your Vercel URL (no trailing /)"
echo ""

open "https://dashboard.render.com" 2>/dev/null || true
open "https://vercel.com/dashboard" 2>/dev/null || true

if command -v pbcopy >/dev/null && [ -f "$ROOT/backend/.env" ]; then
  {
    echo "NODE_ENV=production"
    grep -E '^(DATABASE_URL|DIRECT_URL|JWT_SECRET)=' "$ROOT/backend/.env" | sed 's/^"//;s/"$//'
    echo "FRONTEND_URL=$VERCEL_URL"
  } | pbcopy
  echo "Copied Render env vars to clipboard (paste in Render → Environment)."
fi

echo ""
echo "When both are Live, run:"
echo "  bash scripts/verify-production.sh $VERCEL_URL $API_URL"
echo ""
echo "Optional full automation next time:"
echo "  bash scripts/setup-deploy-keys.sh && bash scripts/deploy-all.sh"
