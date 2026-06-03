#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN="$ROOT/.tools/cloudflared"
mkdir -p "$ROOT/.tools"

if [ -x "$BIN" ]; then
  echo "cloudflared: $("$BIN" --version | head -1)"
  exit 0
fi

ARCH="$(uname -m)"
case "$ARCH" in
  arm64|aarch64) CF_ARCH="arm64" ;;
  *) CF_ARCH="amd64" ;;
esac

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> Downloading cloudflared (darwin-$CF_ARCH)..."
curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-${CF_ARCH}.tgz" -o "$TMP/cloudflared.tgz"
tar -xzf "$TMP/cloudflared.tgz" -C "$TMP"
install -m 755 "$TMP/cloudflared" "$BIN"
echo "==> Installed: $("$BIN" --version | head -1)"
