#!/usr/bin/env bash
# Wire esite2026.vercel.app to the live API (no Vercel/Render tokens required)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
GH="$ROOT/.tools/gh"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"
API_URL="${API_URL:-}"

if [ -z "$API_URL" ] && [ -f "$ROOT/PUBLIC_URLS.txt" ]; then
  API_URL="$(grep '^API_URL=' "$ROOT/PUBLIC_URLS.txt" | cut -d= -f2- || true)"
fi
API_URL="${API_URL:-https://markethub-api.onrender.com}"

echo "=== Wire production ==="
echo "  Store: $VERCEL_URL"
echo "  API:   $API_URL"

# CORS: allow Vercel origin on local/tunnel API
if [ -f "$ROOT/backend/.env" ]; then
  node -e "
    const fs = require('fs');
    const path = process.argv[1];
    const add = process.argv[2];
    let t = fs.readFileSync(path, 'utf8');
    const key = 'FRONTEND_URL=';
    if (!t.includes(add)) {
      if (t.match(/^FRONTEND_URL=/m)) {
        t = t.replace(/^FRONTEND_URL=(.*)$/m, (_, v) => {
          const parts = v.split(',').map(s => s.trim()).filter(Boolean);
          if (!parts.includes(add)) parts.push(add);
          return 'FRONTEND_URL=' + parts.join(',');
        });
      } else {
        t += (t.endsWith('\n') ? '' : '\n') + 'FRONTEND_URL=' + add + '\n';
      }
      fs.writeFileSync(path, t);
      console.log('  backend/.env: added Vercel to FRONTEND_URL');
    }
  " "$ROOT/backend/.env" "$VERCEL_URL"
fi

echo "  Set API_URL in Vercel dashboard → Settings → Environment Variables"
echo "  Value: $API_URL"

# Restart local API if running
if curl -sf "http://127.0.0.1:4000/health" >/dev/null 2>&1; then
  pkill -f "tsx watch src/index" 2>/dev/null || true
  sleep 1
  # shellcheck source=lib/daemon.sh
  source "$ROOT/scripts/lib/daemon.sh"
  mkdir -p "$ROOT/.deploy-logs"
  start_daemon "$ROOT/.deploy-logs/backend.log" bash "$ROOT/scripts/npm.sh" run dev --prefix "$ROOT/backend"
  sleep 3
  echo "  Local API restarted with updated CORS"
fi

cd "$ROOT/frontend" && npm run build >/dev/null && echo "  Frontend build OK"

cd "$ROOT"
git add vercel.json frontend/src/lib/api.ts frontend/src/lib/backendUrl.ts \
  frontend/src/app/api/backend PUBLIC_URLS.txt scripts/wire-production.sh 2>/dev/null || true
git add -u
if git diff --cached --quiet; then
  echo "  Nothing to commit"
else
  git commit -m "Wire Vercel store to API via proxy for login and checkout."
  git push origin main
  echo "  Pushed — Vercel will redeploy in ~2 min"
fi

echo ""
echo "Done. After deploy: https://esite2026.vercel.app/products (no Preview banner)"
echo "Login: customer@demo.com / Password123!"
