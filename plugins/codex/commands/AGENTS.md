<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# commands

## Purpose
Slash command definitions for the Claude Code plugin system. Each markdown file defines one `/codex:*` command that users invoke in Claude Code.

## Key Files

| File | Description |
|------|-------------|
| `review.md` | `/codex:review` — runs a structured Codex code review on working-tree or branch diff |
| `adversarial-review.md` | `/codex:adversarial-review` — steerable challenge review with custom focus text |
| `rescue.md` | `/codex:rescue` — delegates a task to Codex via the `codex-rescue` subagent (routes through Agent tool) |
| `setup.md` | `/codex:setup` — checks Codex availability, auth status, and optionally manages the review gate |
| `status.md` | `/codex:status` — shows running and recent Codex jobs |
| `result.md` | `/codex:result` — displays stored output for a finished job |
| `cancel.md` | `/codex:cancel` — cancels an active background job |

## For AI Agents

### Working In This Directory
- Command files are markdown with embedded `bash` code blocks that invoke `node "$CLAUDE_PLUGIN_ROOT/scripts/..."` with `"$ARGUMENTS"`
- Commands support flags: `--background`, `--wait`, `--base <ref>`, `--model <name>`, `--effort <level>`
- `rescue.md` is special: it routes through Claude Code's Agent tool to the `codex:codex-rescue` subagent rather than running a script directly

### Common Patterns
- Each command echoes a status line, then runs the corresponding script
- Arguments are passed via `"$ARGUMENTS"` which the script splits and parses
- Background/wait mode is handled by the scripts, not the commands

<!-- MANUAL: -->
