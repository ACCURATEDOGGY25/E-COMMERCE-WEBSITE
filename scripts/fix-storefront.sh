#!/usr/bin/env bash
# Fix missing CSS/images — use stable production build (dev + tunnel breaks static assets)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
WEB_PORT="${WEB_PORT:-3000}"
API_PORT="${API_PORT:-4000}"

echo "==> Stopping old servers..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
pkill -f "tsx watch src/index" 2>/dev/null || true
sleep 2

echo "==> Clean frontend build..."
cd "$ROOT/frontend"
rm -rf .next
npm run build

echo "==> Starting API :$API_PORT..."
cd "$ROOT"
bash scripts/npm.sh run dev --prefix backend >"$ROOT/.deploy-logs/backend.log" 2>&1 &
sleep 3

API_URL="http://127.0.0.1:$API_PORT"
echo "==> Starting store (production) :$WEB_PORT..."
cd "$ROOT/frontend"
PORT="$WEB_PORT" NEXT_PUBLIC_API_URL="$API_URL" npm run start >"$ROOT/.deploy-logs/frontend.log" 2>&1 &
sleep 4

CSS_OK=$(curl -sL "http://127.0.0.1:$WEB_PORT" | grep -oE '/_next/static/css/[a-f0-9]+\.css' | head -1)
if [ -n "$CSS_OK" ]; then
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$WEB_PORT$CSS_OK")
  echo "==> CSS check: $CSS_OK → HTTP $CODE"
else
  echo "==> WARN: could not detect CSS path"
fi

echo ""
echo "Store ready: http://localhost:$WEB_PORT"
echo "For public URL run: bash scripts/deploy-automatic.sh"
