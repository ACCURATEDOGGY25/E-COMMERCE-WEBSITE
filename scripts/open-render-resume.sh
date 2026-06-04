#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
bash "$ROOT/scripts/render-env-paste.sh"
open "https://dashboard.render.com/web/srv" 2>/dev/null || open "https://dashboard.render.com" 2>/dev/null || true
echo "Paste env → Save → Manual Deploy → then: bash scripts/switch-to-render.sh"
