#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GH="$ROOT/.tools/gh"

if [ ! -x "$GH" ]; then
  echo "GitHub CLI not found. Run from project root after setup."
  exit 1
fi

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "==> Sign in to GitHub (browser will open)"
  "$GH" auth login -h github.com -p https -w
fi

echo "==> Pushing to origin main..."
git push -u origin main

echo ""
echo "Done! https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE"
