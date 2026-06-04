#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"

echo "=== MarketHub status ==="
echo ""

echo "Store ($VERCEL_URL):"
code=$(curl -s -o /tmp/mh-store.html -w "%{http_code}" -L "$VERCEL_URL" --max-time 20)
title=$(grep -oE '<title>[^<]+</title>' /tmp/mh-store.html 2>/dev/null | head -1)
preview=$(grep -c 'Preview mode' /tmp/mh-store.html 2>/dev/null || echo 0)
echo "  HTTP $code — $title"
[ "$preview" = "0" ] && echo "  Products: live API" || echo "  Products: preview/demo mode"

echo ""
echo "Login via Vercel proxy:"
curl -s -X POST "$VERCEL_URL/api/backend/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"customer@demo.com","password":"Password123!"}' --max-time 20 \
  | grep -q '"success":true' && echo "  OK" || echo "  FAILED"

echo ""
echo "Local API (:4000):"
curl -sf "http://127.0.0.1:4000/health" >/dev/null && echo "  running" || echo "  down"

if [ -f "$ROOT/PUBLIC_URLS.txt" ]; then
  echo ""
  echo "Tunnel (PUBLIC_URLS.txt):"
  grep -E '^API_URL=' "$ROOT/PUBLIC_URLS.txt" || true
  API_TUNNEL=$(grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" | cut -d= -f2-)
  if [ -n "$API_TUNNEL" ]; then
    curl -sf "$API_TUNNEL/health" >/dev/null && echo "  tunnel: OK" || echo "  tunnel: down"
  fi
fi

echo ""
echo "Render (permanent):"
render=$(curl -s -o /tmp/rh.json -w "%{http_code}" "https://markethub-api.onrender.com/health" --max-time 15)
if [ "$render" = "200" ] && grep -q '"status":"ok"' /tmp/rh.json 2>/dev/null; then
  echo "  markethub-api.onrender.com: LIVE — run bash scripts/switch-to-render.sh"
else
  echo "  markethub-api.onrender.com: not live (HTTP $render) — resume on Render dashboard"
fi

echo ""
pgrep -f "keep-api-online.sh" >/dev/null && echo "keep-api-online: running" || echo "keep-api-online: not running"
