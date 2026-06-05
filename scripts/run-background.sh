#!/usr/bin/env bash
# Start API + tunnel in the background (survives closing this terminal).
# Usage: bash scripts/run-background.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=lib/daemon.sh
source "$ROOT/scripts/lib/daemon.sh"
LOG="$ROOT/.deploy-logs"
PID="$LOG/keep-api.pid"
KEEP_LOG="$LOG/keep-api-online.log"

mkdir -p "$LOG"

if [ -f "$PID" ]; then
  old=$(cat "$PID" 2>/dev/null || true)
  if [ -n "$old" ] && kill -0 "$old" 2>/dev/null; then
    if curl -sf "http://127.0.0.1:${API_PORT:-4000}/health" >/dev/null 2>&1; then
      API_PUBLIC="$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG/tunnel-api.log" 2>/dev/null | grep -v 'api\.trycloudflare\.com' | tail -1 || true)"
      [ -n "$API_PUBLIC" ] && curl -sf "$API_PUBLIC/health" >/dev/null 2>&1 && {
        echo "Already running (pid $old). API: $API_PUBLIC"
        exit 0
      }
    fi
    echo "Stopping stale keep-api (pid $old)..."
    kill "$old" 2>/dev/null || true
    sleep 2
  fi
fi

pkill -f "cloudflared tunnel --url http://127.0.0.1:${API_PORT:-4000}" 2>/dev/null || true
pkill -f "keep-api-online.sh" 2>/dev/null || true
sleep 1

echo "==> Starting keep-api-online in background..."
if command -v setsid >/dev/null 2>&1; then
  setsid nohup bash "$ROOT/scripts/keep-api-online.sh" >>"$KEEP_LOG" 2>&1 </dev/null &
else
  nohup bash "$ROOT/scripts/keep-api-online.sh" >>"$KEEP_LOG" 2>&1 </dev/null &
fi
echo $! >"$PID"
disown -h $! 2>/dev/null || true
echo "PID $(cat "$PID") — log: $KEEP_LOG"

for _ in $(seq 1 90); do
  API_PUBLIC=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG/tunnel-api.log" 2>/dev/null | tail -1 || true)
  [ -n "$API_PUBLIC" ] && curl -sf "$API_PUBLIC/health" >/dev/null 2>&1 && break
  sleep 2
done

if [ -n "${API_PUBLIC:-}" ]; then
  bash "$ROOT/scripts/sync-api-url.sh" "$API_PUBLIC" --force 2>/dev/null || true
  echo "Tunnel ready: $API_PUBLIC"
  grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" || true
else
  echo "WARN: tunnel not ready yet — check $KEEP_LOG"
fi
