#!/usr/bin/env bash
# Copy Render env vars to clipboard (from backend/.env) — for permanent deploy
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV="$ROOT/backend/.env"
OUT="$ROOT/backend/render.paste.env"

if [ ! -f "$ENV" ]; then
  echo "Missing backend/.env"
  exit 1
fi

{
  echo "NODE_ENV=production"
  grep -E '^(DATABASE_URL|DIRECT_URL|JWT_SECRET)=' "$ENV" | sed 's/^"//;s/"$//'
  echo "FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app"
} >"$OUT"

if command -v pbcopy >/dev/null; then
  cat "$OUT" | pbcopy
  echo "Copied to clipboard + saved: backend/render.paste.env"
else
  echo "Saved: backend/render.paste.env"
  cat "$OUT"
fi

open "https://dashboard.render.com" 2>/dev/null || true
echo "Resume or create markethub-api → Environment → Paste → Manual Deploy"
