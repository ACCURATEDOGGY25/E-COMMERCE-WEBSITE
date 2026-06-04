#!/usr/bin/env bash
# Confirm GitHub repo is ready for Vercel/Render import
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GH="$ROOT/.tools/gh"
REPO="ACCURATEDOGGY25/E-COMMERCE-WEBSITE"

echo "=== GitHub check: $REPO ==="
"$GH" api "repos/$REPO" --jq '"size_kb: \(.size) | default_branch: \(.default_branch) | pushed: \(.pushed_at)"'
echo ""
echo "Branches on GitHub:"
"$GH" api "repos/$REPO/branches" --jq '.[].name'
echo ""
echo "Top-level files:"
"$GH" api "repos/$REPO/contents/" --jq '.[].name' | head -15
echo ""
echo "Local vs remote:"
cd "$ROOT"
git fetch origin 2>/dev/null || true
git status -sb
echo ""
echo "If GitHub shows files but Vercel fails → use branch: main, root: frontend"
echo "See VERCEL-GITHUB-FIX.md"
