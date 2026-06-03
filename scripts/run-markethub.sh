#!/usr/bin/env bash
# Run API + production storefront — keep this terminal open
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
WEB_PORT="${WEB_PORT:-3000}"
API_PORT="${API_PORT:-4000}"

cleanup() {
  jobs -p | xargs kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

if [ ! -f "$ROOT/frontend/.next/BUILD_ID" ]; then
  echo "==> First run: building storefront..."
  cd "$ROOT/frontend"
  rm -rf .next
  npm run build
fi

echo "==> API on http://localhost:$API_PORT"
bash "$ROOT/scripts/npm.sh" run dev --prefix "$ROOT/backend" &
sleep 2

echo "==> Store on http://localhost:$WEB_PORT"
echo "    (production mode — styles and images work)"
cd "$ROOT/frontend"
PORT="$WEB_PORT" NEXT_PUBLIC_API_URL="http://127.0.0.1:$API_PORT" IMAGES_UNOPTIMIZED=1 exec npm run start
