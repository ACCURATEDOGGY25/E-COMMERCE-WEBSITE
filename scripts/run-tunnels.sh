#!/usr/bin/env bash
# Public URLs via Cloudflare (run in a second terminal while run-markethub.sh is active)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec bash "$ROOT/scripts/deploy-automatic.sh"
