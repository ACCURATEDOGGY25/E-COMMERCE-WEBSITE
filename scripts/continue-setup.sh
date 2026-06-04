#!/usr/bin/env bash
# Next step after esite2026.vercel.app is live — connect login/cart/checkout
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"

echo "=== MarketHub — continue setup ==="
echo ""
echo "Store (live): $VERCEL_URL"
echo ""

code=$(curl -s -o /dev/null -w "%{http_code}" -L "$VERCEL_URL" --max-time 20)
echo "Vercel HTTP: $code"
if [ "$code" = "200" ]; then
  echo "  Deploy looks good (no failed email = build succeeded)."
else
  echo "  Check Vercel dashboard → Deployments."
fi

echo ""
echo "--- Step 1: Keep API online (required for login now) ---"
echo "Open a NEW Mac Terminal window and run:"
echo ""
echo "  cd \"$ROOT\""
echo "  bash scripts/keep-api-online.sh"
echo ""
echo "Leave that window open. It prints your API_URL."
echo ""

echo "--- Step 2: Tell Vercel the API URL ---"
echo "After keep-api-online.sh shows API_URL:"
echo "  1. Vercel → esite2026 → Settings → Environment Variables"
echo "  2. Add: API_URL = (paste the tunnel URL from the script)"
echo "  3. Deployments → Redeploy"
echo ""

echo "--- Step 3 (permanent): Render 24/7 API ---"
echo "  bash scripts/render-env-paste.sh"
echo "  Render dashboard → Resume markethub-api → paste env → Deploy"
echo "  Then Vercel API_URL = https://markethub-api.onrender.com → Redeploy"
echo ""

open "https://vercel.com/dashboard" 2>/dev/null || true
open "https://dashboard.render.com" 2>/dev/null || true
