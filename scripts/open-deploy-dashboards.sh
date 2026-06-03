#!/usr/bin/env bash
# Opens Vercel + Render dashboards in your browser (macOS)
set -euo pipefail
open "https://vercel.com/dashboard" 2>/dev/null || true
open "https://dashboard.render.com" 2>/dev/null || true
open "https://github.com/ACCURATEDOGGY25/E-COMMERCE-WEBSITE" 2>/dev/null || true
echo "Opened: Vercel, Render, and GitHub repo in your browser."
