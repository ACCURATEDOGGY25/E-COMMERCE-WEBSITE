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
  echo "No RENDER_API_KEY — use Render dashboard (env copied to clipboard)."
  bash "$ROOT/scripts/render-env-paste.sh"
  open "https://dashboard.render.com/blueprints" 2>/dev/null || true
  echo ""
  echo "  1. Blueprint → E-COMMERCE-WEBSITE (or Resume markethub-api)"
  echo "  2. Paste environment variables → Save"
  echo "  3. Manual Deploy → test /health"
  echo "  4. Vercel: NEXT_PUBLIC_API_URL=https://markethub-api.onrender.com"
  exit 0
fi

bash "$ROOT/scripts/deploy-all.sh"
echo ""
echo "When Live, set on Vercel: NEXT_PUBLIC_API_URL=$API_URL"
bash "$ROOT/scripts/verify-production.sh" "https://e-commerce-website-two-phi-62.vercel.app" "$API_URL" || true
