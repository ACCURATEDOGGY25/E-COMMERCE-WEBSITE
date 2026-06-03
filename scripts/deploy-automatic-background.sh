#!/usr/bin/env bash
# Start public deploy in background (survives closing this terminal tab)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$ROOT/.deploy-logs/automatic.log"
mkdir -p "$ROOT/.deploy-logs"

if pgrep -f "deploy-automatic.sh" >/dev/null 2>&1; then
  echo "deploy-automatic already running. Check: bash scripts/status.sh"
  exit 0
fi

nohup bash "$ROOT/scripts/deploy-automatic.sh" >"$LOG" 2>&1 &
echo "Started in background (PID $!). Log: $LOG"
echo "Wait ~60s, then: bash scripts/status.sh"
