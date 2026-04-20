#!/usr/bin/env bash
# Recreate symlinks so Claude Code and GitHub Copilot layouts share .agents/skills.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

mkdir -p .claude .github/copilot

rm -f .claude/skills
ln -sf ../.agents/skills .claude/skills

rm -f .github/copilot/skills
ln -sf ../../.agents/skills .github/copilot/skills

echo "Linked .claude/skills -> .agents/skills"
echo "Linked .github/copilot/skills -> .agents/skills"
