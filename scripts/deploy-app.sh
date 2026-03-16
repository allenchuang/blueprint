#!/usr/bin/env bash
set -euo pipefail

# Deploy a monorepo app to production (PM2 + Caddy).
# Reads app metadata from packages/app-config/src/apps-registry.ts.
#
# Usage:
#   ./scripts/deploy-app.sh <app-id> [--domain <base-domain>]
#
# Examples:
#   ./scripts/deploy-app.sh blog --domain aeir.ai
#   ./scripts/deploy-app.sh web

APP_ID="${1:-}"
BASE_DOMAIN=""

if [ -z "$APP_ID" ]; then
  echo "Usage: $0 <app-id> [--domain <base-domain>]"
  echo "Available apps are defined in packages/app-config/src/apps-registry.ts"
  exit 1
fi

shift
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) BASE_DOMAIN="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$REPO_ROOT/packages/app-config/src/apps-registry.ts"

if [ ! -f "$REGISTRY" ]; then
  echo "Error: apps-registry.ts not found at $REGISTRY"
  exit 1
fi

PORT=$(grep -A 15 "id: \"$APP_ID\"" "$REGISTRY" | grep "port:" | head -1 | grep -o '[0-9]\+')
SUBDOMAIN=$(grep -A 15 "id: \"$APP_ID\"" "$REGISTRY" | grep "subdomain:" | head -1 | sed 's/.*"\(.*\)".*/\1/')
APP_TYPE=$(grep -A 15 "id: \"$APP_ID\"" "$REGISTRY" | grep "type:" | head -1 | sed 's/.*"\(.*\)".*/\1/')

if [ -z "$PORT" ]; then
  echo "Error: App '$APP_ID' not found in registry"
  exit 1
fi

echo "Deploying $APP_ID (port $PORT, subdomain $SUBDOMAIN, type $APP_TYPE)"

if [ ! -d "$REPO_ROOT/apps/$APP_ID" ]; then
  echo "Error: apps/$APP_ID/ directory does not exist"
  exit 1
fi

echo "1/4 Installing dependencies..."
cd "$REPO_ROOT"
pnpm install

echo "2/4 Building $APP_ID..."
pnpm build --filter="$APP_ID"

echo "3/4 Updating PM2..."
if pm2 describe "$APP_ID" > /dev/null 2>&1; then
  pm2 restart "$APP_ID"
else
  case "$APP_TYPE" in
    nextjs)
      pm2 start "../../node_modules/next/dist/bin/next" \
        --name "$APP_ID" \
        --cwd "$REPO_ROOT/apps/$APP_ID" \
        --interpreter node \
        -- start -p "$PORT"
      ;;
    fastify)
      pm2 start "dist/index.js" \
        --name "$APP_ID" \
        --cwd "$REPO_ROOT/apps/$APP_ID"
      ;;
    *)
      echo "Warning: App type '$APP_TYPE' not supported for PM2 auto-start. Add it manually."
      ;;
  esac
fi
pm2 save

if [ -n "$BASE_DOMAIN" ]; then
  echo "4/4 Updating Caddy..."
  CADDY_BLOCK="${SUBDOMAIN}.${BASE_DOMAIN} {
    reverse_proxy localhost:${PORT}
}"
  CADDYFILE="/etc/caddy/Caddyfile"
  if sudo grep -q "${SUBDOMAIN}.${BASE_DOMAIN}" "$CADDYFILE" 2>/dev/null; then
    echo "  Caddy block for ${SUBDOMAIN}.${BASE_DOMAIN} already exists, skipping"
  else
    echo "" | sudo tee -a "$CADDYFILE" > /dev/null
    echo "$CADDY_BLOCK" | sudo tee -a "$CADDYFILE" > /dev/null
    sudo systemctl reload caddy
    echo "  Added ${SUBDOMAIN}.${BASE_DOMAIN} -> localhost:${PORT}"
  fi
else
  echo "4/4 Skipping Caddy (no --domain provided)"
fi

echo ""
echo "Done! $APP_ID is running on port $PORT"
[ -n "$BASE_DOMAIN" ] && echo "  Public URL: https://${SUBDOMAIN}.${BASE_DOMAIN}"
echo "  Direct URL: http://localhost:${PORT}"
