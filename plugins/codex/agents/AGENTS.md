<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# agents

## Purpose
Subagent definitions for the Claude Code agent system. Each markdown file defines a subagent that Claude Code can spawn.

## Key Files

| File | Description |
|------|-------------|
| `codex-rescue.md` | Defines the `codex-rescue` subagent: a thin forwarding wrapper that routes rescue requests to `codex-companion.mjs`. Uses Sonnet model, Bash tool only. Has access to `codex-cli-runtime` and `gpt-5-4-prompting` skills. |

## For AI Agents

### Working In This Directory
- Agent files use YAML frontmatter (`name`, `description`, `model`, `tools`, `skills`) followed by a system prompt
- The `codex-rescue` agent is deliberately minimal — it must not inspect the repo or do independent work
- It only forwards to `node "$CLAUDE_PLUGIN_ROOT/scripts/codex-companion.mjs" task ...`

<!-- MANUAL: -->
