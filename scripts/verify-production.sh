#!/usr/bin/env bash
# Quick production health check — run after Vercel + Render deploy
set -euo pipefail

VERCEL_URL="${1:-https://e-commerce-website-two-phi-62.vercel.app}"
API_URL="${2:-https://markethub-api.onrender.com}"

echo "==> Store: $VERCEL_URL"
code=$(curl -s -o /tmp/verify-store.html -w "%{http_code}" -L "$VERCEL_URL" || echo "000")
title=$(grep -oE '<title>[^<]+</title>' /tmp/verify-store.html 2>/dev/null | head -1 || true)
echo "    HTTP $code  ${title:-(no title)}"
if echo "$title" | grep -qi MarketHub; then
  echo "    OK — MarketHub detected"
else
  echo "    WARN — expected MarketHub in title (404/500/wrong project?)"
fi

echo ""
echo "==> API: $API_URL/health"
api=$(curl -s -w "\nHTTP:%{http_code}" "$API_URL/health" 2>/dev/null || echo "unreachable")
echo "    $api"

echo ""
echo "==> API DB: $API_URL/health/db"
db=$(curl -s -w "\nHTTP:%{http_code}" "$API_URL/health/db" 2>/dev/null || echo "unreachable")
echo "    $db"

echo ""
echo "Usage: bash scripts/verify-production.sh [vercel-url] [api-url]"
