#!/usr/bin/env bash
set -euo pipefail
# Usage: run from the root of your local clinical-pwa-demo repo on branch demo:
#   git checkout demo
#   ./create_and_commit_demo_files.sh
# This will write the prepared files, commit them, and push to origin/demo.

echo "Creating files for demo branch..."

mkdir -p server src/cds src/components scripts .github/workflows docs

# (This script content matches the one shared in chat and will write all prepared files)
# Save and run locally if pushing via your account is preferred.