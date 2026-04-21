<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-21 | Updated: 2026-04-21 -->

# agents

## Purpose
Subagent definitions for the Claude Code agent system. Each markdown file defines a subagent that Claude Code can spawn.

## Key Files

| File | Description |
|------|-------------|
| `copilot-rescue.md` | Defines the `copilot-rescue` subagent: a thin forwarding wrapper that routes rescue requests to `copilot-companion.mjs`. Uses Sonnet model, Bash tool only. Has access to `copilot-cli-runtime` and `gpt-5-4-prompting` skills. |

## For AI Agents

### Working In This Directory
- Agent files use YAML frontmatter (`name`, `description`, `model`, `tools`, `skills`) followed by a system prompt
- The `copilot-rescue` agent is deliberately minimal — it must not inspect the repo or do independent work
- It only forwards to `node "$CLAUDE_PLUGIN_ROOT/scripts/copilot-companion.mjs" task ...`

<!-- MANUAL: -->
