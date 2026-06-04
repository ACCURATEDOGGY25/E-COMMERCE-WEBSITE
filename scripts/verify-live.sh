#!/usr/bin/env bash
# Verify production after Vercel + Render deploy
# Usage: bash scripts/verify-live.sh https://your-app.vercel.app [https://your-api.onrender.com]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

VERCEL_URL="${1:-}"
API_URL="${2:-https://markethub-api.onrender.com}"

if [ -z "$VERCEL_URL" ]; then
  echo "Usage: bash scripts/verify-live.sh https://YOUR-PROJECT.vercel.app [API_URL]"
  echo ""
  echo "Find your URL: Vercel Dashboard → E-COMMERCE-WEBSITE → Domains"
  exit 1
fi

VERCEL_URL="${VERCEL_URL%/}"
API_URL="${API_URL%/}"

echo "=== MarketHub production check ==="
echo "Store: $VERCEL_URL"
echo "API:   $API_URL"
echo ""

code=$(curl -s -o /tmp/mh-store.html -w "%{http_code}" -L "$VERCEL_URL" --max-time 30)
title=$(grep -oE '<title>[^<]+</title>' /tmp/mh-store.html 2>/dev/null | head -1)
echo "Store HTTP $code — $title"
if echo "$title" | grep -qi MarketHub; then
  echo "  OK — MarketHub storefront"
else
  echo "  WARN — expected MarketHub in title"
fi

api=$(curl -s -w "\nHTTP:%{http_code}" "$API_URL/health" --max-time 20 2>/dev/null | tail -2)
echo "API health: $api"

echo ""
echo "Checklist:"
echo "  [ ] Vercel env: NEXT_PUBLIC_API_URL = $API_URL"
echo "  [ ] Render env: FRONTEND_URL = $VERCEL_URL"
echo "  [ ] Login: customer@demo.com / Password123!"
