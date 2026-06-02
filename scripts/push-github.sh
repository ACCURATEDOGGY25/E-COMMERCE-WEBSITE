#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GH="$ROOT/.tools/gh"

if [ ! -x "$GH" ]; then
  echo "Error: GitHub CLI missing at .tools/gh"
  exit 1
fi

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "==> GitHub sign-in required (one time)"
  echo "    A browser window will open. Approve access for ACCURATEDOGGY25."
  echo ""
  "$GH" auth login -h github.com -p https -w &
  AUTH_PID=$!
  sleep 3
  open "https://github.com/login/device" 2>/dev/null || true
  wait "$AUTH_PID" || {
    echo "Error: GitHub login failed or timed out."
    exit 1
  }
fi

echo "==> Logged in as: $("$GH" api user -q .login 2>/dev/null || echo "unknown")"
echo "==> Pushing to origin main..."
git push -u origin main

echo ""
echo "Done! https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE"
