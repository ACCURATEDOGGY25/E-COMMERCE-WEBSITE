#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=env.sh
source "$ROOT/scripts/env.sh"
ENV_FILE="backend/.env"

echo "==> MarketHub setup"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm not found."
  echo "  Install Node.js 20+ from https://nodejs.org"
  echo "  Or run: bash scripts/install-node.sh"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  cp backend/.env.example "$ENV_FILE"
  echo ""
  echo "Created $ENV_FILE — add your Supabase URLs, then run: npm run setup"
  exit 1
fi

if grep -qE 'PROJECT_REF|YOUR_PASSWORD|\[PROJECT' "$ENV_FILE" 2>/dev/null; then
  echo "Error: Replace placeholder values in $ENV_FILE with your Supabase credentials."
  echo "  Supabase → Project Settings → Database → Connect → Prisma"
  exit 1
fi

if ! grep -q '^DATABASE_URL=' "$ENV_FILE"; then
  echo "Error: DATABASE_URL is missing in $ENV_FILE"
  exit 1
fi

# Derive DIRECT_URL from DATABASE_URL when not configured (Supabase pooled → direct)
if ! grep -q '^DIRECT_URL=.' "$ENV_FILE" || grep -qE 'PROJECT_REF|YOUR_PASSWORD' "$ENV_FILE"; then
  DB_LINE=$(grep '^DATABASE_URL=' "$ENV_FILE" | head -1)
  DB_VAL="${DB_LINE#DATABASE_URL=}"
  DB_VAL="${DB_VAL%\"}"
  DB_VAL="${DB_VAL#\"}"
  DERIVED="${DB_VAL//:6543/:5432}"
  DERIVED="${DERIVED//\?pgbouncer=true/}"
  DERIVED="${DERIVED//&pgbouncer=true/}"

  if grep -q '^DIRECT_URL=' "$ENV_FILE"; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s|^DIRECT_URL=.*|DIRECT_URL=\"${DERIVED}\"|" "$ENV_FILE"
    else
      sed -i "s|^DIRECT_URL=.*|DIRECT_URL=\"${DERIVED}\"|" "$ENV_FILE"
    fi
  else
    echo "DIRECT_URL=\"${DERIVED}\"" >> "$ENV_FILE"
  fi
  echo "==> Wrote DIRECT_URL (port 5432) for Prisma migrations"
fi

echo "==> Installing backend dependencies..."
(cd backend && npm install)

echo "==> Generating Prisma client..."
(cd backend && npx prisma generate)

echo "==> Pushing schema to Supabase..."
(cd backend && npx prisma db push)

echo "==> Seeding demo data..."
(cd backend && npm run db:seed)

if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.example frontend/.env.local
  echo "Created frontend/.env.local"
fi

echo "==> Installing frontend dependencies..."
(cd frontend && npm install)

echo ""
echo "Setup complete!"
echo ""
echo "  npm run dev:backend   → http://localhost:4000"
echo "  npm run dev:frontend  → http://localhost:3000"
echo ""
echo "Demo login: customer@demo.com / Password123!"
