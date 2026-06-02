#!/usr/bin/env bash
# Writes Supabase credentials into backend/.env and frontend/.env.local
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=env.sh
source "$ROOT/scripts/env.sh"

BACKEND_ENV="$ROOT/backend/.env"
FRONTEND_ENV="$ROOT/frontend/.env.local"

echo "==> MarketHub — Supabase environment setup"
echo ""
echo "Get connection strings from:"
echo "  Supabase → Project Settings → Database → Connect → Prisma"
echo ""

read -rp "Project ref (from URL, e.g. abcxyz...): " PROJECT_REF
read -rsp "Database password: " DB_PASSWORD
echo ""
read -rp "AWS region (e.g. us-east-1, eu-west-1): " REGION

if [ -z "$PROJECT_REF" ] || [ -z "$DB_PASSWORD" ] || [ -z "$REGION" ]; then
  echo "Error: project ref, password, and region are required."
  exit 1
fi

# URL-encode password for connection string
if [ -x "$ROOT/.tools/node/bin/node" ]; then
  ENCODED_PASS=$("$ROOT/.tools/node/bin/node" -e "console.log(encodeURIComponent(process.argv[1]))" "$DB_PASSWORD")
else
  ENCODED_PASS="$DB_PASSWORD"
  echo "Warning: Node not found — if your password has special characters, URL-encode it manually."
fi

DATABASE_URL="postgresql://postgres.${PROJECT_REF}:${ENCODED_PASS}@aws-0-${REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.${PROJECT_REF}:${ENCODED_PASS}@aws-0-${REGION}.pooler.supabase.com:5432/postgres"

if command -v openssl >/dev/null 2>&1; then
  JWT_SECRET=$(openssl rand -hex 32)
else
  JWT_SECRET="change-me-$(date +%s)-$(head -c 16 /dev/urandom | xxd -p 2>/dev/null || echo random)"
fi

# Preserve optional keys from existing .env if present
STRIPE_SECRET=""
STRIPE_WEBHOOK=""
CLOUD_NAME=""
CLOUD_KEY=""
CLOUD_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""
if [ -f "$BACKEND_ENV" ]; then
  STRIPE_SECRET=$(grep -E '^STRIPE_SECRET_KEY=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  STRIPE_WEBHOOK=$(grep -E '^STRIPE_WEBHOOK_SECRET=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  CLOUD_NAME=$(grep -E '^CLOUDINARY_CLOUD_NAME=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  CLOUD_KEY=$(grep -E '^CLOUDINARY_API_KEY=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  CLOUD_SECRET=$(grep -E '^CLOUDINARY_API_SECRET=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  GOOGLE_ID=$(grep -E '^GOOGLE_CLIENT_ID=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  GOOGLE_SECRET=$(grep -E '^GOOGLE_CLIENT_SECRET=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
fi

cat > "$BACKEND_ENV" <<EOF
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (configured $(date +%Y-%m-%d))
DATABASE_URL="${DATABASE_URL}"
DIRECT_URL="${DIRECT_URL}"

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Stripe (optional)
STRIPE_SECRET_KEY=${STRIPE_SECRET:-sk_test_...}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK:-whsec_...}

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=${CLOUD_NAME:-}
CLOUDINARY_API_KEY=${CLOUD_KEY:-}
CLOUDINARY_API_SECRET=${CLOUD_SECRET:-}

# Google OAuth (optional)
GOOGLE_CLIENT_ID=${GOOGLE_ID:-}
GOOGLE_CLIENT_SECRET=${GOOGLE_SECRET:-}
EOF

chmod 600 "$BACKEND_ENV" 2>/dev/null || true

read -rp "Supabase project URL (optional, for frontend e.g. https://xxx.supabase.co): " SUPABASE_URL
read -rp "Supabase anon key (optional, press Enter to skip): " SUPABASE_ANON

cat > "$FRONTEND_ENV" <<EOF
# Local API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Supabase (optional — for future Auth UI)
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL:-}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON:-}

# Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
EOF

chmod 600 "$FRONTEND_ENV" 2>/dev/null || true

echo ""
echo "==> Wrote $BACKEND_ENV"
echo "==> Wrote $FRONTEND_ENV"
echo ""
echo "Next: create tables and demo data"
echo "  bash scripts/setup.sh"
echo ""
echo "Then restart the API and open http://localhost:3000"
