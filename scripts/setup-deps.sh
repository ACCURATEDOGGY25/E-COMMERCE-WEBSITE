#!/usr/bin/env bash
# Install dependencies only (no database). Use when Supabase .env isn't ready yet.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=env.sh
source "$ROOT/scripts/env.sh"

if ! command -v npm >/dev/null 2>&1; then
  echo "Run: npm run install-node"
  exit 1
fi

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env (add Supabase credentials before npm run setup)"
fi

if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.example frontend/.env.local
fi

echo "==> Installing backend dependencies..."
(cd backend && npm install)

echo "==> Generating Prisma client..."
(cd backend && npx prisma generate)

echo "==> Installing frontend dependencies..."
(cd frontend && npm install)

echo ""
echo "Dependencies installed."
echo "Next: add Supabase URLs to backend/.env, then run: npm run setup"
