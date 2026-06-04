#!/usr/bin/env bash
# Start API + tunnel in background (Mac stays on). Safe to run before sleep.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$ROOT/.deploy-logs"
PIDFILE="$LOG/keep-api.pid"
mkdir -p "$LOG"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "API already running (PID $(cat "$PIDFILE"))"
  grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" 2>/dev/null || true
  exit 0
fi

nohup bash "$ROOT/scripts/keep-api-online.sh" >>"$LOG/keep-api-overnight.log" 2>&1 &
echo $! >"$PIDFILE"
sleep 12
if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Started overnight API (PID $(cat "$PIDFILE"))"
  echo "Log: $LOG/keep-api-overnight.log"
  grep -E '^API_URL=|^VERCEL_URL=' "$ROOT/PUBLIC_URLS.txt" 2>/dev/null || tail -8 "$LOG/keep-api-overnight.log"
else
  echo "Failed to start — check $LOG/keep-api-overnight.log"
  exit 1
fi
