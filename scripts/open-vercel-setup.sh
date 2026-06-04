#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API="https://markethub-api.onrender.com"
if [ -f "$ROOT/PUBLIC_URLS.txt" ]; then
  T=$(grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" | cut -d= -f2- || true)
  if curl -sf "${T}/health" --max-time 6 >/dev/null 2>&1; then
    API="$T"
  fi
fi
echo "NEXT_PUBLIC_API_URL=$API"
command -v pbcopy >/dev/null && printf 'NEXT_PUBLIC_API_URL=%s\n' "$API" | pbcopy && echo "Copied to clipboard."
open "https://vercel.com/new" 2>/dev/null || true
cat "$ROOT/VERCEL.md" | head -35
