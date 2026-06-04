#!/usr/bin/env bash
# Commit (if needed), push to GitHub → Vercel auto-deploys from main
# Usage: bash scripts/deploy-push.sh ["commit message"]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
MSG="${1:-Update MarketHub site}"

echo "=== Deploy: GitHub + Vercel ==="

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  # Never commit secrets
  git reset HEAD deploy.secrets.env backend/.env backend/render.paste.env 2>/dev/null || true
  git reset HEAD frontend/.env.local frontend/.env.production 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "Only ignored/local files changed — nothing to commit."
  else
    git commit -m "$MSG"
    echo "Committed: $MSG"
  fi
else
  echo "No file changes — pushing existing commits."
fi

bash "$ROOT/scripts/push-github.sh"

echo ""
echo "============================================"
echo "  GitHub: https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE"
echo "  Store:  https://esite2026.vercel.app"
echo "  Vercel redeploys in ~1–2 min (Git integration on main)"
echo "============================================"
echo ""
echo "Check: Vercel Dashboard → Deployments → Ready"
echo "API_URL: set in Vercel Settings (not in git) — see DEPLOY-AUTO.md"
