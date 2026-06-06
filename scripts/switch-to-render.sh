#!/usr/bin/env bash
# After markethub-api is Live on Render — point Vercel at permanent API
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_URL="${API_URL:-https://markethub-api.onrender.com}"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"

echo "=== Switch to Render API ==="
echo "  API:   $API_URL"
echo "  Store: $VERCEL_URL"
echo ""

code=$(curl -s -o /tmp/render-health.json -w "%{http_code}" "$API_URL/health" --max-time 25)
if [ "$code" != "200" ] || ! grep -q '"status":"ok"' /tmp/render-health.json 2>/dev/null; then
  echo "Render API not healthy yet (HTTP $code)."
  echo "  1. bash scripts/render-env-paste.sh"
  echo "  2. Resume markethub-api on Render → paste env → Deploy"
  echo "  3. Run this script again"
  exit 1
fi
echo "Render API: OK"

echo "$API_URL" > "$ROOT/config/production-api-url.txt"
node -e "
const fs = require('fs');
const root = process.argv[1];
const api = process.argv[2];
fs.writeFileSync(root + '/frontend/.env.production', 'API_URL=' + api + '\nNEXT_PUBLIC_API_URL=' + api + '\n');
" "$ROOT" "$API_URL"

echo "Updated config/production-api-url.txt"
echo ""
echo "Next:"
echo "  1. Vercel dashboard → API_URL = $API_URL → Redeploy (optional if using git deploy)"
echo "  2. git add config/production-api-url.txt && git commit && git push"
echo "  3. You can stop keep-api-online.sh on your Mac"
echo ""
if command -v pbcopy >/dev/null; then
  printf '%s' "$API_URL" | pbcopy
  echo "Copied API URL to clipboard for Vercel."
fi
