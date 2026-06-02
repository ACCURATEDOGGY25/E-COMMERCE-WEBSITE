#!/usr/bin/env bash
# Ensures project-local Node/npm is on PATH when available.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -x "$ROOT/.tools/node/bin/npm" ]; then
  export PATH="$ROOT/.tools/node/bin:$PATH"
fi
