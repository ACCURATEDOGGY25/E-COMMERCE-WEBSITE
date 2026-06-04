#!/usr/bin/env bash
# Save full catalog to Supabase — survives refresh on Vercel + local
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
cd "$ROOT"

echo "=== Persist catalog to database ==="

if [ ! -f "$ROOT/backend/.env" ]; then
  echo "Error: backend/.env missing. Run: bash scripts/configure-supabase.sh"
  exit 1
fi

if grep -qE 'PROJECT_REF|YOUR_PASSWORD|\[PROJECT' "$ROOT/backend/.env" 2>/dev/null; then
  echo "Error: Fix Supabase URLs in backend/.env first"
  exit 1
fi

echo "==> Sync database schema..."
cd "$ROOT/backend"
npx prisma db push --skip-generate 2>/dev/null || npx prisma db push
npx prisma generate

echo "==> Seed categories + products (250+)..."
attempt=1
max=3
while [ "$attempt" -le "$max" ]; do
  if npm run db:seed; then
    break
  fi
  echo "Seed attempt $attempt failed — retrying in 5s..."
  sleep 5
  attempt=$((attempt + 1))
  [ "$attempt" -le "$max" ] || exit 1
done

echo "==> Verify counts..."
npx tsx -e "
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const cats = ['gaming','fashion','home','electronics','beauty','sports','books','toys'];
const total = await prisma.product.count({ where: { isActive: true } });
console.log('Total products:', total);
for (const slug of cats) {
  const cat = await prisma.category.findFirst({ where: { slug }, include: { children: true } });
  if (!cat) { console.log(' ', slug, ': (no category)'); continue; }
  const ids = [cat.id, ...cat.children.map((c) => c.id)];
  const n = await prisma.product.count({ where: { categoryId: { in: ids }, isActive: true } });
  console.log(' ', slug, ':', n);
}
await prisma.\$disconnect();
" 2>/dev/null || echo "(skip verify)"

echo ""
echo "============================================"
echo "  Catalog saved in Supabase"
echo "  Refresh https://esite2026.vercel.app — no Preview banner if API is connected"
echo ""
echo "  1. Keep API running: bash scripts/keep-api-online.sh"
echo "  2. Vercel API_URL must point to your live API"
echo "============================================"
