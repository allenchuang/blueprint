#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Bump version (skip with --no-bump)
if [ "$1" != "--no-bump" ]; then
  npm version patch --no-git-tag-version
fi
VERSION=$(node -p "require('./package.json').version")

# Build
npx tsc

# Create tarball manually (bypasses npm pack bug)
TMPD=$(mktemp -d)
mkdir -p "$TMPD/package"
cp -r dist package.json README.md "$TMPD/package/"
tar czf "$TMPD/blueprint-stack-$VERSION.tgz" -C "$TMPD" package
rm -rf "$TMPD/package"

# Publish the tarball
npm publish "$TMPD/blueprint-stack-$VERSION.tgz" --access public
rm -rf "$TMPD"

echo "✔ Published blueprint-stack@$VERSION"
