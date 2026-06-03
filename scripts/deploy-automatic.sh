#!/usr/bin/env bash
# Automatic public deploy — no Render/Vercel dashboard required.
# Uses your local API + Supabase + Cloudflare quick tunnels.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
CF="$ROOT/.tools/cloudflared"
LOG_DIR="$ROOT/.deploy-logs"
API_PORT="${API_PORT:-4000}"
WEB_PORT="${WEB_PORT:-3000}"
URLS_FILE="$ROOT/PUBLIC_URLS.txt"

mkdir -p "$LOG_DIR"

if [ -f "$ROOT/deploy.secrets.env" ]; then
  echo "==> Found deploy.secrets.env — trying Render + Vercel first..."
  if bash "$ROOT/scripts/deploy-all.sh"; then
    if bash "$ROOT/scripts/verify-production.sh" 2>/dev/null | grep -q "MarketHub detected"; then
      exit 0
    fi
  fi
  echo "==> Cloud deploy not ready — using automatic tunnels..."
fi

bash "$ROOT/scripts/install-cloudflared.sh"

stop_old() {
  pkill -f "cloudflared tunnel --url http://127.0.0.1:$API_PORT" 2>/dev/null || true
  pkill -f "cloudflared tunnel --url http://127.0.0.1:$WEB_PORT" 2>/dev/null || true
}

wait_for_port() {
  local port="$1" name="$2" n=0
  while ! curl -s -o /dev/null "http://127.0.0.1:$port" 2>/dev/null; do
    n=$((n + 1))
    if [ "$n" -gt 60 ]; then
      echo "Error: $name did not start on port $port"
      exit 1
    fi
    sleep 1
  done
}

read_tunnel_url() {
  local log="$1"
  local url=""
  for _ in $(seq 1 90); do
    url=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$log" 2>/dev/null | head -1 || true)
    [ -n "$url" ] && break
    sleep 1
  done
  if [ -z "$url" ]; then
    echo "Error: tunnel URL not found in $log" >&2
    tail -20 "$log" >&2 || true
    exit 1
  fi
  echo "$url"
}

start_tunnel() {
  local port="$1" log="$2"
  "$CF" tunnel --url "http://127.0.0.1:$port" >"$log" 2>&1 &
  echo $!
}

echo "=== MarketHub automatic deploy (tunnels) ==="

stop_old

# Backend
if ! curl -sf "http://127.0.0.1:$API_PORT/health" >/dev/null 2>&1; then
  echo "==> Starting API on :$API_PORT..."
  cd "$ROOT"
  bash scripts/npm.sh run dev --prefix backend >"$LOG_DIR/backend.log" 2>&1 &
  sleep 2
fi
wait_for_port "$API_PORT" "API"

echo "==> Starting API tunnel..."
start_tunnel "$API_PORT" "$LOG_DIR/tunnel-api.log" >/dev/null
sleep 2
API_PUBLIC="$(read_tunnel_url "$LOG_DIR/tunnel-api.log")"
echo "    API: $API_PUBLIC"

# Restart API with CORS for tunnel store (placeholder, updated after web tunnel)
export FRONTEND_URL="http://127.0.0.1:$WEB_PORT"
pkill -f "tsx watch src/index" 2>/dev/null || true
sleep 1
cd "$ROOT"
FRONTEND_URL="$FRONTEND_URL" bash scripts/npm.sh run dev --prefix backend >"$LOG_DIR/backend.log" 2>&1 &
wait_for_port "$API_PORT" "API"

# Frontend
pkill -f "next dev" 2>/dev/null || true
sleep 1
echo "==> Starting store on :$WEB_PORT..."
cd "$ROOT/frontend"
NEXT_PUBLIC_API_URL="$API_PUBLIC" npm run dev >"$LOG_DIR/frontend.log" 2>&1 &
wait_for_port "$WEB_PORT" "store"

echo "==> Starting store tunnel..."
start_tunnel "$WEB_PORT" "$LOG_DIR/tunnel-web.log" >/dev/null
sleep 2
WEB_PUBLIC="$(read_tunnel_url "$LOG_DIR/tunnel-web.log")"
echo "    Store: $WEB_PUBLIC"

# Fix CORS with public store URL
pkill -f "tsx watch src/index" 2>/dev/null || true
sleep 1
cd "$ROOT"
FRONTEND_URL="$WEB_PUBLIC" bash scripts/npm.sh run dev --prefix backend >"$LOG_DIR/backend.log" 2>&1 &
sleep 4

cat >"$URLS_FILE" <<EOF
# MarketHub public URLs (auto-generated)
STORE_URL=$WEB_PUBLIC
API_URL=$API_PUBLIC
LOGIN=customer@demo.com / Password123!
Generated=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "============================================"
echo "  YOUR LIVE SHOP (automatic):"
echo "  $WEB_PUBLIC"
echo ""
echo "  API: $API_PUBLIC"
echo "  Login: customer@demo.com / Password123!"
echo "============================================"
echo ""
echo "Saved to PUBLIC_URLS.txt"
echo "Keep this terminal open (tunnels stop if you close it)."
echo "Logs: $LOG_DIR/"

open "$WEB_PUBLIC" 2>/dev/null || true
