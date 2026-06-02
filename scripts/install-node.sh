#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p .tools

ARCH="$(uname -m)"
OS="$(uname -s)"
NODE_VERSION="v22.14.0"

case "$OS-$ARCH" in
  Darwin-arm64)  DIR="node-${NODE_VERSION}-darwin-arm64" ;;
  Darwin-x86_64) DIR="node-${NODE_VERSION}-darwin-x64" ;;
  Linux-x86_64)  DIR="node-${NODE_VERSION}-linux-x64" ;;
  Linux-aarch64|Linux-arm64) DIR="node-${NODE_VERSION}-linux-arm64" ;;
  *)
    echo "Unsupported platform: $OS $ARCH"
    exit 1
    ;;
esac

URL="https://nodejs.org/dist/${NODE_VERSION}/${DIR}.tar.gz"
echo "==> Downloading Node.js ${NODE_VERSION}..."
curl -fsSL "$URL" -o .tools/node.tar.gz
rm -rf .tools/node
tar -xzf .tools/node.tar.gz -C .tools
mv ".tools/${DIR}" .tools/node
rm -f .tools/node.tar.gz

echo "==> Installed: $(.tools/node/bin/node -v) (npm $(.tools/node/bin/npm -v))"
