<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-21 | Updated: 2026-04-21 -->

# agents

## Purpose
Subagent definitions for the Claude Code agent system. Each markdown file defines a subagent that Claude Code can spawn.

## Key Files

| File | Description |
|------|-------------|
| `copilot-rescue.md` | Defines the `copilot-rescue` subagent: a thin forwarding wrapper that routes rescue requests to `copilot-companion.mjs`. Uses Sonnet model, Bash tool only. Has access to `copilot-cli-runtime` and `gpt-5-4-prompting` skills. |
| `copilot-review.md` | Defines the `copilot-review` subagent: a thin forwarding wrapper that routes native review requests to `copilot-companion.mjs review`. Uses Sonnet model, Bash tool only. No skills needed. |
| `copilot-adversarial-review.md` | Defines the `copilot-adversarial-review` subagent: a thin forwarding wrapper that routes adversarial review requests to `copilot-companion.mjs adversarial-review`. Uses Sonnet model, Bash tool only. No skills needed. |

## For AI Agents

### Working In This Directory
- Agent files use YAML frontmatter (`name`, `description`, `model`, `tools`, `skills`) followed by a system prompt
- All three agents are deliberately minimal — they must not inspect the repo or do independent work
- `copilot-rescue` only forwards to `node "$CLAUDE_PLUGIN_ROOT/scripts/copilot-companion.mjs" task ...`
- `copilot-review` only forwards to `node "$CLAUDE_PLUGIN_ROOT/scripts/copilot-companion.mjs" review ...`
- `copilot-adversarial-review` only forwards to `node "$CLAUDE_PLUGIN_ROOT/scripts/copilot-companion.mjs" adversarial-review ...`
- Sub-agents cannot spawn other sub-agents — keep all three as leaf nodes

<!-- MANUAL: -->
