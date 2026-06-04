#!/usr/bin/env bash
# Push updated API tunnel URL to GitHub so Vercel redeploys (runs in background loop).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="$ROOT/.deploy-logs/vercel-sync.log"
mkdir -p "$ROOT/.deploy-logs"

exec >>"$LOG" 2>&1
echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) background-sync-vercel ==="

API_URL="$(grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" 2>/dev/null | cut -d= -f2- | tr -d '\r')"
[ -n "$API_URL" ] || exit 0
curl -sf "$API_URL/health" >/dev/null || { echo "API down, skip push"; exit 0; }

if git diff --quiet vercel.json 2>/dev/null && ! git status --porcelain vercel.json | grep -q .; then
  echo "vercel.json unchanged"
  exit 0
fi

git add vercel.json
git commit -m "chore: update API tunnel URL for Vercel" 2>/dev/null || true
bash "$ROOT/scripts/push-github.sh" 2>/dev/null || echo "push skipped (auth or no change)"
