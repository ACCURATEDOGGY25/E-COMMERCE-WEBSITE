#!/usr/bin/env bash
# Create deploy.secrets.env so deploy-all.sh can run Render + Vercel for you
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy.secrets.env"

echo "Get keys (open in browser):"
open "https://dashboard.render.com/u/settings#api-keys" 2>/dev/null || true
open "https://vercel.com/account/tokens" 2>/dev/null || true
echo "  Render: https://dashboard.render.com/u/settings#api-keys"
echo "  Vercel: https://vercel.com/account/tokens"
echo ""

read -r -p "Paste RENDER_API_KEY (or Enter to skip): " RENDER_KEY
read -r -p "Paste VERCEL_TOKEN (or Enter to skip): " VERCEL_KEY

cat > "$OUT" <<EOF
# Created by setup-deploy-keys.sh — do not commit
RENDER_API_KEY=${RENDER_KEY}
VERCEL_TOKEN=${VERCEL_KEY}
EOF
chmod 600 "$OUT"
echo "Wrote $OUT"
echo "Run: bash scripts/deploy-all.sh"
