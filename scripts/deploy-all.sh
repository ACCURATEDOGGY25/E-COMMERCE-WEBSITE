#!/usr/bin/env bash
# Deploy MarketHub: resume Render API, set env, deploy Vercel frontend
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
GH="$ROOT/.tools/gh"
VERCEL_URL="${VERCEL_URL:-https://esite2026.vercel.app}"
API_URL="${API_URL:-https://markethub-api.onrender.com}"

cd "$ROOT"

if [ -f "$ROOT/deploy.secrets.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/deploy.secrets.env"
  set +a
fi

if [ ! -f "$ROOT/backend/.env" ]; then
  echo "Error: backend/.env missing. Run Supabase setup first."
  exit 1
fi

load_backend_env() {
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/backend/.env"
  set +a
}

# --- Render ---
render_api() {
  local method="$1" path="$2"
  shift 2
  curl -sS -X "$method" "https://api.render.com/v1${path}" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Accept: application/json" \
    "$@"
}

find_render_service_id() {
  render_api GET "/services?limit=50" | node -e "
    const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
    const list=Array.isArray(d)?d:d.data||[];
    for (const row of list) {
      const s=row.service||row;
      const name=(s.name||'').toLowerCase();
      const slug=(s.slug||'').toLowerCase();
      if (name.includes('markethub')||slug.includes('markethub-api')) {
        console.log(s.id);
        process.exit(0);
      }
    }
    process.exit(1);
  "
}

resume_and_configure_render() {
  if [ -z "${RENDER_API_KEY:-}" ]; then
    echo "==> Render: skip API (set RENDER_API_KEY in deploy.secrets.env)"
    open "https://dashboard.render.com" 2>/dev/null || true
    return 1
  fi

  echo "==> Render: listing services..."
  RENDER_SERVICE_ID="${RENDER_SERVICE_ID:-}"
  if [ -z "$RENDER_SERVICE_ID" ]; then
    RENDER_SERVICE_ID="$(find_render_service_id)" || {
      echo "Error: markethub-api service not found. Create Blueprint from repo first."
      return 1
    }
  fi
  echo "    Service: $RENDER_SERVICE_ID"

  echo "==> Render: resume service..."
  render_api POST "/services/${RENDER_SERVICE_ID}/resume" -o /dev/null -w "HTTP:%{http_code}\n" || true

  load_backend_env
  echo "==> Render: sync env vars..."
  for key in DATABASE_URL DIRECT_URL JWT_SECRET NODE_ENV FRONTEND_URL; do
    case "$key" in
      NODE_ENV) val="production" ;;
      FRONTEND_URL) val="${FRONTEND_URL:-$VERCEL_URL}" ;;
      *) val="${!key:-}" ;;
    esac
    [ -n "$val" ] || continue
    payload=$(node -e "console.log(JSON.stringify({envKey:process.argv[1],value:process.argv[2]}))" "$key" "$val")
    render_api PUT "/services/${RENDER_SERVICE_ID}/env-vars/${key}" \
      -H "Content-Type: application/json" \
      -d "$payload" >/dev/null 2>&1 || \
    render_api POST "/services/${RENDER_SERVICE_ID}/env-vars" \
      -H "Content-Type: application/json" \
      -d "$payload" >/dev/null 2>&1 || true
  done

  echo "==> Render: trigger deploy..."
  render_api POST "/services/${RENDER_SERVICE_ID}/deploys" \
    -H "Content-Type: application/json" \
    -d '{"clearCache":false}' >/dev/null 2>&1 || true

  echo "    API URL: $API_URL"
  return 0
}

# --- Vercel ---
vercel_deploy() {
  if [ -n "${VERCEL_TOKEN:-}" ]; then
    export VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
    export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
    echo "==> Vercel: deploy with token..."
    cd "$ROOT/frontend"
    npx vercel@41.6.0 deploy --prod --yes --token "$VERCEL_TOKEN" \
      -e "NEXT_PUBLIC_API_URL=$API_URL" 2>&1 | tail -15
    return 0
  fi

  if [ -f "$HOME/.local/share/com.vercel.cli/auth.json" ]; then
    echo "==> Vercel: deploy (logged in)..."
    cd "$ROOT/frontend"
    npx vercel@41.6.0 deploy --prod --yes \
      -e "NEXT_PUBLIC_API_URL=$API_URL" 2>&1 | tail -15
    return 0
  fi

  echo "==> Vercel: not logged in — run: bash scripts/vercel-login.sh"
  echo "    Or add VERCEL_TOKEN to deploy.secrets.env"
  open "https://vercel.com/dashboard" 2>/dev/null || true
  return 1
}

# --- Main ---
echo "=== MarketHub production deploy ==="
load_backend_env
export FRONTEND_URL="${FRONTEND_URL:-$VERCEL_URL}"

render_ok=0
vercel_ok=0
resume_and_configure_render && render_ok=1 || true
vercel_deploy && vercel_ok=1 || true

echo ""
echo "==> Waiting 45s for services..."
sleep 45
bash "$ROOT/scripts/verify-production.sh" "$VERCEL_URL" "$API_URL" || true

echo ""
if [ "$render_ok" = 1 ] && [ "$vercel_ok" = 1 ]; then
  echo "Done — check URLs above."
else
  echo "Partial — complete manual steps in NEXT_STEPS.md"
  echo "  Render: https://dashboard.render.com"
  echo "  Vercel: https://vercel.com/dashboard"
  echo ""
  echo "For full automation, copy deploy.secrets.env.example → deploy.secrets.env"
  echo "and add RENDER_API_KEY + VERCEL_TOKEN, then run this script again."
fi
