#!/usr/bin/env bash
# Applies backend/supabase.paste.env and frontend/supabase.paste.env → .env files
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_PASTE="$ROOT/backend/supabase.paste.env"
FRONTEND_PASTE="$ROOT/frontend/supabase.paste.env"
BACKEND_ENV="$ROOT/backend/.env"
FRONTEND_ENV="$ROOT/frontend/.env.local"

read_paste_var() {
  local file="$1"
  local key="$2"
  if [ ! -f "$file" ]; then
    echo ""
    return
  fi
  local line
  line=$(grep -E "^${key}=" "$file" 2>/dev/null | head -1 || true)
  if [ -z "$line" ]; then
    echo ""
    return
  fi
  local val="${line#*=}"
  val="${val%\"}"
  val="${val#\"}"
  val="${val#\'}"
  val="${val%\'}"
  echo "$val"
}

if [ ! -f "$BACKEND_PASTE" ]; then
  cp "$ROOT/backend/supabase.paste.env.example" "$BACKEND_PASTE"
  echo "Created $BACKEND_PASTE — paste your DATABASE_URL and DIRECT_URL, then run this script again."
  exit 1
fi

DATABASE_URL=$(read_paste_var "$BACKEND_PASTE" "DATABASE_URL")
DIRECT_URL=$(read_paste_var "$BACKEND_PASTE" "DIRECT_URL")

if [ -z "$DATABASE_URL" ] || [ -z "$DIRECT_URL" ]; then
  echo "Error: Paste DATABASE_URL and DIRECT_URL into:"
  echo "  $BACKEND_PASTE"
  echo ""
  echo "Supabase → Project Settings → Database → Connect → Prisma"
  exit 1
fi

if echo "$DATABASE_URL" | grep -qE 'PROJECT_REF|YOUR_PASSWORD|\[PASSWORD\]'; then
  echo "Error: DATABASE_URL still looks like a placeholder."
  exit 1
fi

# Keep existing JWT or generate new
JWT_SECRET=$(read_paste_var "$BACKEND_ENV" "JWT_SECRET" 2>/dev/null || true)
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-in-production" ]; then
  if command -v openssl >/dev/null 2>&1; then
    JWT_SECRET=$(openssl rand -hex 32)
  else
    JWT_SECRET="jwt-$(date +%s)-secret"
  fi
fi

cat > "$BACKEND_ENV" <<EOF
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (from supabase.paste.env)
DATABASE_URL="${DATABASE_URL}"
DIRECT_URL="${DIRECT_URL}"

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EOF

chmod 600 "$BACKEND_ENV" 2>/dev/null || true
echo "==> Updated $BACKEND_ENV"

# Frontend
if [ -f "$FRONTEND_PASTE" ]; then
  SUPABASE_URL=$(read_paste_var "$FRONTEND_PASTE" "NEXT_PUBLIC_SUPABASE_URL")
  SUPABASE_ANON=$(read_paste_var "$FRONTEND_PASTE" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
  API_URL=$(read_paste_var "$FRONTEND_PASTE" "NEXT_PUBLIC_API_URL")
  [ -z "$API_URL" ] && API_URL="http://localhost:4000"

  cat > "$FRONTEND_ENV" <<EOF
NEXT_PUBLIC_API_URL=${API_URL}
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL:-https://tfqchbjkykeuvlvqleor.supabase.co}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON:-}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
EOF
  chmod 600 "$FRONTEND_ENV" 2>/dev/null || true
  echo "==> Updated $FRONTEND_ENV"
fi

echo ""
echo "Next: bash scripts/setup.sh"
