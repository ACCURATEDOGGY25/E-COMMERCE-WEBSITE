#!/usr/bin/env bash
# Deploy MarketHub frontend to Vercel
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
FRONTEND="$ROOT/frontend"
URLS="$ROOT/PUBLIC_URLS.txt"

if [ -f "$ROOT/deploy.secrets.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/deploy.secrets.env"
  set +a
fi

# API URL for the live storefront (priority: env > PUBLIC_URLS > Render default)
if [ -z "${NEXT_PUBLIC_API_URL:-}" ] && [ -f "$URLS" ]; then
  NEXT_PUBLIC_API_URL="$(grep '^API_URL=' "$URLS" | cut -d= -f2- || true)"
fi
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://markethub-api.onrender.com}"

echo "=== Deploy frontend to Vercel ==="
echo "    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
echo ""

echo "==> Verifying production build..."
cd "$FRONTEND"
NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" npm run build

if [ -n "${VERCEL_TOKEN:-}" ]; then
  echo "==> Deploying with Vercel CLI..."
  cd "$FRONTEND"
  npx vercel@41.6.0 deploy --prod --yes --token "$VERCEL_TOKEN" \
    -e "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
  echo ""
  echo "Done. Set FRONTEND_URL on Render to your .vercel.app URL."
  exit 0
fi

if [ -f "$HOME/.local/share/com.vercel.cli/auth.json" ]; then
  echo "==> Deploying (logged in)..."
  cd "$FRONTEND"
  npx vercel@41.6.0 deploy --prod --yes \
    -e "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
  exit 0
fi

echo "Vercel CLI not logged in. Use the dashboard (one-time):"
echo ""
echo "  1. https://vercel.com/new → Import ACCURATEDOGGY25/E-COMMERCE-WEBSITE"
echo "  2. Root Directory: frontend  (repo has vercel.json at root too)"
echo "  3. Environment variable:"
echo "       NEXT_PUBLIC_API_URL = $NEXT_PUBLIC_API_URL"
echo "  4. Deploy → copy your .vercel.app URL"
echo "  5. On Render: FRONTEND_URL = that Vercel URL (no trailing /)"
echo ""
echo "For CLI deploy later:"
echo "  bash scripts/setup-deploy-keys.sh   # add VERCEL_TOKEN"
echo "  bash scripts/deploy-vercel.sh"
echo ""

if command -v pbcopy >/dev/null; then
  printf 'NEXT_PUBLIC_API_URL=%s\n' "$NEXT_PUBLIC_API_URL" | pbcopy
  echo "Copied NEXT_PUBLIC_API_URL to clipboard."
fi

open "https://vercel.com/new" 2>/dev/null || true
open "https://vercel.com/dashboard" 2>/dev/null || true
