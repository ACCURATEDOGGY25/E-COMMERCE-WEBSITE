#!/usr/bin/env bash
# Update Vercel config files when tunnel URL changes (then git push)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_URL="${1:-}"
FORCE="${2:-}"

if [ -z "$API_URL" ] && [ -f "$ROOT/PUBLIC_URLS.txt" ]; then
  API_URL="$(grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" | cut -d= -f2-)"
fi
API_URL="${API_URL%/}"
[ -n "$API_URL" ] || { echo "Usage: bash scripts/sync-api-url.sh https://your-tunnel.trycloudflare.com [--force]"; exit 1; }

if [ "$FORCE" != "--force" ]; then
  curl -sf "$API_URL/health" >/dev/null || {
    echo "API not reachable: $API_URL (use --force to sync anyway)"
    exit 1
  }
fi

node -e "
const fs = require('fs');
const root = process.argv[1];
const api = process.argv[2];
const vercel = root + '/vercel.json';
const j = JSON.parse(fs.readFileSync(vercel, 'utf8'));
j.env = { API_URL: api, NEXT_PUBLIC_API_URL: api };
fs.writeFileSync(vercel, JSON.stringify(j, null, 2) + '\n');
fs.writeFileSync(
  root + '/frontend/.env.production',
  'API_URL=' + api + '\nNEXT_PUBLIC_API_URL=' + api + '\n'
);
const urls = 'VERCEL_URL=https://esite2026.vercel.app\nAPI_URL=' + api + '\nLOCAL_API=http://127.0.0.1:4000\nLOGIN=customer@demo.com / Password123!\nUpdated=' + new Date().toISOString().slice(0, 19) + 'Z\n';
fs.writeFileSync(root + '/PUBLIC_URLS.txt', urls);
" "$ROOT" "$API_URL"

echo "Synced API_URL=$API_URL"
echo "Run: git add vercel.json frontend/.env.production && git commit -m 'Update API tunnel URL' && git push"
