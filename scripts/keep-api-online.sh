#!/usr/bin/env bash
# Run in Mac Terminal and leave open — powers esite2026.vercel.app login/cart/checkout
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=lib/daemon.sh
source "$ROOT/scripts/lib/daemon.sh"
export PATH="$ROOT/.tools/node/bin:$PATH"
LOG="$ROOT/.deploy-logs"
API_PORT="${API_PORT:-4000}"
URLS="$ROOT/PUBLIC_URLS.txt"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"

mkdir -p "$LOG"
bash "$ROOT/scripts/install-cloudflared.sh" >/dev/null 2>&1 || true

cleanup() {
  pkill -f "cloudflared tunnel --url http://127.0.0.1:$API_PORT" 2>/dev/null || true
  pkill -f "tsx watch src/index" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> MarketHub API for $VERCEL_URL"
node -e "
const fs=require('fs'),p=process.argv[1],add=process.argv[2];
let t=fs.readFileSync(p,'utf8');
if(!t.includes(add)){
  if(/^FRONTEND_URL=/m.test(t)) t=t.replace(/^FRONTEND_URL=(.*)$/m,(_,v)=>{
    const parts=v.split(',').map(s=>s.trim()).filter(Boolean);
    if(!parts.includes(add)) parts.push(add);
    return 'FRONTEND_URL='+parts.join(',');
  });
  else t+='\\nFRONTEND_URL='+add+'\\n';
  fs.writeFileSync(p,t);
}
" "$ROOT/backend/.env" "$VERCEL_URL" 2>/dev/null || true

start_daemon "$LOG/backend.log" bash "$ROOT/scripts/npm.sh" run dev --prefix "$ROOT/backend"
for _ in $(seq 1 45); do
  curl -sf "http://127.0.0.1:$API_PORT/health" >/dev/null && break
  sleep 1
done
curl -sf "http://127.0.0.1:$API_PORT/health" || { echo "API failed to start"; exit 1; }

pkill -f "cloudflared tunnel --url http://127.0.0.1:$API_PORT" 2>/dev/null || true
sleep 1
: >"$LOG/tunnel-api.log"
start_daemon "$LOG/tunnel-api.log" "$ROOT/.tools/cloudflared" tunnel --url "http://127.0.0.1:$API_PORT"
API_PUBLIC=""
for _ in $(seq 1 70); do
  API_PUBLIC=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG/tunnel-api.log" 2>/dev/null | head -1 || true)
  [ -n "$API_PUBLIC" ] && break
  sleep 1
done
[ -n "$API_PUBLIC" ] || { echo "Tunnel failed"; exit 1; }

cat >"$URLS" <<EOF
VERCEL_URL=$VERCEL_URL
API_URL=$API_PUBLIC
LOCAL_API=http://127.0.0.1:$API_PORT
LOGIN=customer@demo.com / Password123!
Updated=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

bash "$ROOT/scripts/sync-api-url.sh" "$API_PUBLIC" --force 2>/dev/null || true

echo ""
echo "============================================"
echo "  Store:  $VERCEL_URL"
echo "  API:    $API_PUBLIC"
echo "  Login:  customer@demo.com / Password123!"
echo "============================================"
echo ""
echo "Vercel: set API_URL = $API_PUBLIC (or git push after sync-api-url.sh)"
echo "Permanent: bash scripts/render-env-paste.sh → Resume on Render"
echo ""
echo "Press Ctrl+C to stop API + tunnel."

while true; do
  sleep 120
  if ! curl -sf "http://127.0.0.1:$API_PORT/health" >/dev/null; then
    echo "[$(date)] WARN: local API down"
  elif ! curl -sf "$API_PUBLIC/health" >/dev/null 2>&1; then
    echo "[$(date)] WARN: tunnel unreachable — restart this script"
  fi
done
