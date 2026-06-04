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

node -e "
const fs = require('fs');
const root = process.argv[1];
const api = process.argv[2];
const files = [
  [root + '/vercel.json', (p) => {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    j.env = j.env || {};
    j.env.API_URL = api;
    j.env.NEXT_PUBLIC_API_URL = api;
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  }],
  [root + '/frontend/.env.production', (p) => {
    fs.writeFileSync(p, 'API_URL=' + api + '\nNEXT_PUBLIC_API_URL=' + api + '\n');
  }],
];
for (const [p, fn] of files) fn(p);
" "$ROOT" "$API_URL"

echo "Updated vercel.json + frontend/.env.production"
echo ""
echo "Next:"
echo "  1. Vercel dashboard → API_URL = $API_URL → Redeploy (if not using git deploy)"
echo "  2. git add vercel.json frontend/.env.production && git commit && git push"
echo "  3. You can stop keep-api-online.sh on your Mac"
echo ""
if command -v pbcopy >/dev/null; then
  printf '%s' "$API_URL" | pbcopy
  echo "Copied API URL to clipboard for Vercel."
fi
