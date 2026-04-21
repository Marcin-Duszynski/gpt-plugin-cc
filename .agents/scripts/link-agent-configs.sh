#!/usr/bin/env bash
# Recreate symlinks so Claude Code and GitHub Copilot layouts share .agents/skills and .agents/commands.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

mkdir -p .claude .github/copilot

rm -f .claude/skills
ln -sf ../.agents/skills .claude/skills

rm -f .github/copilot/skills
ln -sf ../../.agents/skills .github/copilot/skills

rm -f .claude/commands
ln -sf ../.agents/commands .claude/commands

rm -f .github/agents
ln -sf ../.agents/agents .github/agents

echo "Linked .claude/skills -> .agents/skills"
echo "Linked .github/copilot/skills -> .agents/skills"
echo "Linked .claude/commands -> .agents/commands"
echo "Linked .github/agents -> .agents/agents"
