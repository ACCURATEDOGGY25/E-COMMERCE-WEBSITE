#!/usr/bin/env bash
# One-time Vercel login (opens browser — click Allow on any Cursor pop-up)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"
cd "$ROOT"
echo "==> Vercel login — approve browser + Cursor permission prompts"
npx vercel@41.6.0 login
echo "==> Done. Deploy with: npx vercel@41.6.0 --cwd frontend --prod"
