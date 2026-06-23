#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required on the server."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required on the server."
  exit 1
fi

if [ ! -f "apps/api/.env" ]; then
  echo "Missing apps/api/.env on the server."
  echo "Create it from apps/api/.env.example and set MONGODB_URI, JWT_SECRET, CLIENT_URL, and PORT."
  exit 1
fi

if [ ! -f "apps/web/.env.local" ]; then
  echo "Missing apps/web/.env.local on the server."
  echo "Create it from apps/web/.env.example and set NEXT_PUBLIC_API_URL."
  exit 1
fi

npm ci
npm run build

if ! command -v pm2 >/dev/null 2>&1; then
  npm install --global pm2
fi

pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
