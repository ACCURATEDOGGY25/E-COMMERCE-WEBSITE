#!/usr/bin/env bash
# Start API + store + public tunnels — keep this terminal open
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=lib/daemon.sh
source "$ROOT/scripts/lib/daemon.sh"
export PATH="$ROOT/.tools/node/bin:$PATH"
CF="$ROOT/.tools/cloudflared"
LOG="$ROOT/.deploy-logs"
WEB_PORT="${WEB_PORT:-3000}"
API_PORT="${API_PORT:-4000}"
URLS="$ROOT/PUBLIC_URLS.txt"

mkdir -p "$LOG"
bash "$ROOT/scripts/install-cloudflared.sh" >/dev/null 2>&1 || true

cleanup() {
  pkill -f "cloudflared tunnel --url http://127.0.0.1:$API_PORT" 2>/dev/null || true
  pkill -f "cloudflared tunnel --url http://127.0.0.1:$WEB_PORT" 2>/dev/null || true
  jobs -p | xargs kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait_port() {
  local port="$1"
  local path="${2:-/}"
  local n=0
  while ! curl -sf -o /dev/null "http://127.0.0.1:$port$path" 2>/dev/null; do
    n=$((n + 1))
    [ "$n" -lt 90 ] || { echo "Port $port not ready"; exit 1; }
    sleep 1
  done
}

read_tunnel() {
  local log="$1" url=""
  for _ in $(seq 1 60); do
    url=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$log" 2>/dev/null | head -1 || true)
    [ -n "$url" ] && break
    sleep 1
  done
  [ -n "$url" ] || { echo "Tunnel URL not found in $log"; exit 1; }
  echo "$url"
}

if [ ! -f "$ROOT/frontend/.next/BUILD_ID" ]; then
  echo "==> Building storefront..."
  cd "$ROOT/frontend" && rm -rf .next && npm run build
fi

echo "==> Starting API :$API_PORT"
start_daemon "$LOG/backend.log" bash "$ROOT/scripts/npm.sh" run dev --prefix "$ROOT/backend"
wait_port "$API_PORT" "/health"

echo "==> Starting store :$WEB_PORT (production)"
start_daemon "$LOG/frontend.log" bash -c \
  "cd '$ROOT/frontend' && PORT='$WEB_PORT' NEXT_PUBLIC_API_URL='http://127.0.0.1:$API_PORT' IMAGES_UNOPTIMIZED=1 npm run start"
wait_port "$WEB_PORT"

CSS=$(curl -sL "http://127.0.0.1:$WEB_PORT" | grep -oE '/_next/static/css/[a-f0-9]+\.css' | head -1)
[ -n "$CSS" ] && echo "==> CSS OK ($CSS)"

pkill -f "cloudflared tunnel --url http://127.0.0.1:$API_PORT" 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://127.0.0.1:$WEB_PORT" 2>/dev/null || true
sleep 1

echo "==> Starting tunnels..."
: >"$LOG/tunnel-api.log"
start_daemon "$LOG/tunnel-api.log" "$CF" tunnel --url "http://127.0.0.1:$API_PORT"
sleep 3
API_PUBLIC=$(read_tunnel "$LOG/tunnel-api.log")
echo "    API: $API_PUBLIC"

: >"$LOG/tunnel-web.log"
start_daemon "$LOG/tunnel-web.log" "$CF" tunnel --url "http://127.0.0.1:$WEB_PORT"
sleep 3
WEB_PUBLIC=$(read_tunnel "$LOG/tunnel-web.log")
echo "    Store: $WEB_PUBLIC"

pkill -f "tsx watch src/index" 2>/dev/null || true
sleep 1
start_daemon "$LOG/backend.log" env FRONTEND_URL="$WEB_PUBLIC" bash "$ROOT/scripts/npm.sh" run dev --prefix "$ROOT/backend"
sleep 2

cat >"$URLS" <<EOF
STORE_URL=$WEB_PUBLIC
API_URL=$API_PUBLIC
LOCAL_STORE=http://localhost:$WEB_PORT
LOCAL_API=http://127.0.0.1:$API_PORT
LOGIN=customer@demo.com / Password123!
Updated=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "============================================"
echo "  Public shop: $WEB_PUBLIC"
echo "  Local shop:  http://localhost:$WEB_PORT"
echo "  Login: customer@demo.com / Password123!"
echo "============================================"
echo "Press Ctrl+C to stop all services."
echo ""

open "$WEB_PUBLIC" 2>/dev/null || true
wait
