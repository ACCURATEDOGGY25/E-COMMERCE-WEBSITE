#!/usr/bin/env bash
# Add categories + products (gaming, fashion, home, etc.)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
cd "$ROOT/backend"
echo "==> Seeding catalog (may take 1–2 min)..."
npm run db:seed
echo "Done. Browse: /products?category=gaming or /products?category=fashion"
