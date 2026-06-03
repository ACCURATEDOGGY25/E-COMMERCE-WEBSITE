#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== MarketHub status ==="
echo ""

echo "Local:"
curl -sf "http://127.0.0.1:4000/health/db" >/dev/null && echo "  API :4000  OK (DB connected)" || echo "  API :4000  down"
code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000" 2>/dev/null || echo "000")
echo "  Store :3000 HTTP $code"

if [ -f "$ROOT/PUBLIC_URLS.txt" ]; then
  echo ""
  echo "Public tunnels (from PUBLIC_URLS.txt):"
  # shellcheck disable=SC1090
  source <(grep -E '^[A-Z_]+=' "$ROOT/PUBLIC_URLS.txt" | sed 's/^/export /')
  if [ -n "${STORE_URL:-}" ]; then
    sc=$(curl -s -o /dev/null -w "%{http_code}" -L "$STORE_URL" --max-time 12 2>/dev/null || echo "000")
    echo "  Store: $STORE_URL  HTTP $sc"
  fi
  if [ -n "${API_URL:-}" ]; then
    ac=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" --max-time 12 2>/dev/null || echo "000")
    echo "  API:   $API_URL  HTTP $ac"
  fi
else
  echo ""
  echo "  No PUBLIC_URLS.txt — run: bash scripts/deploy-automatic.sh"
fi

echo ""
echo "Cloud (Render/Vercel):"
bash "$ROOT/scripts/verify-production.sh" 2>/dev/null | grep -E '^(==>|    HTTP|    WARN)' || true

if pgrep -fl cloudflared >/dev/null 2>&1; then
  echo ""
  echo "  cloudflared: running"
else
  echo ""
  echo "  cloudflared: not running"
fi
