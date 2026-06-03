#!/usr/bin/env bash
# Permanent 24/7 API on Render — run after dashboard login or with RENDER_API_KEY
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
API_URL="${API_URL:-https://markethub-api.onrender.com}"

if [ -f "$ROOT/deploy.secrets.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/deploy.secrets.env"
  set +a
fi

echo "=== Permanent Render deploy (markethub-api) ==="

if [ -z "${RENDER_API_KEY:-}" ]; then
  echo "No RENDER_API_KEY — opening Render dashboard."
  echo ""
  echo "Manual steps (one time):"
  echo "  1. New → Blueprint → repo E-COMMERCE-WEBSITE"
  echo "  2. Service name: markethub-api (or resume existing)"
  echo "  3. Paste env from clipboard:"
  bash "$ROOT/scripts/finish-production.sh" 2>/dev/null | head -1 || true
  if command -v pbcopy >/dev/null && [ -f "$ROOT/backend/.env" ]; then
    {
      echo "NODE_ENV=production"
      grep -E '^(DATABASE_URL|DIRECT_URL|JWT_SECRET)=' "$ROOT/backend/.env" | sed 's/^"//;s/"$//'
      echo "FRONTEND_URL=https://your-vercel-url.vercel.app"
    } | pbcopy
    echo "  (env vars copied to clipboard)"
  fi
  open "https://dashboard.render.com/blueprints" 2>/dev/null || true
  exit 0
fi

bash "$ROOT/scripts/deploy-all.sh"
echo ""
echo "When Live, set on Vercel: NEXT_PUBLIC_API_URL=$API_URL"
bash "$ROOT/scripts/verify-production.sh" "https://e-commerce-website-two-phi-62.vercel.app" "$API_URL" || true
