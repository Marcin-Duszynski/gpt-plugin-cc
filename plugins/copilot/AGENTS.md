<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-21 | Updated: 2026-04-21 -->

# copilot

## Purpose
The core Copilot plugin package for Claude Code. Provides slash commands (`/copilot:review`, `/copilot:adversarial-review`, `/copilot:rescue`, `/copilot:status`, `/copilot:result`, `/copilot:cancel`, `/copilot:setup`) that bridge Claude Code to the local GitHub Copilot CLI via its app-server JSON-RPC protocol. Supports foreground and background execution, a persistent broker for session reuse, and an optional stop-time review gate.

## Key Files

| File | Description |
|------|-------------|
| `CHANGELOG.md` | Release history |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `.claude-plugin/` | Plugin manifest (`plugin.json`) read by Claude Code (see `.claude-plugin/AGENTS.md`) |
| `agents/` | Subagent definitions (see `agents/AGENTS.md`) |
| `commands/` | Slash command definitions in markdown (see `commands/AGENTS.md`) |
| `hooks/` | Claude Code hook configuration (see `hooks/AGENTS.md`) |
| `prompts/` | Prompt templates for Copilot reviews (see `prompts/AGENTS.md`) |
| `schemas/` | JSON schemas for structured Copilot output (see `schemas/AGENTS.md`) |
| `scripts/` | All runtime JavaScript — entry points and library modules (see `scripts/AGENTS.md`) |
| `skills/` | Skill definitions for the copilot-rescue subagent (see `skills/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- This is the plugin root; `$CLAUDE_PLUGIN_ROOT` resolves here at runtime
- All executable logic lives under `scripts/` (ESM `.mjs` files)
- Commands in `commands/` reference scripts via `$CLAUDE_PLUGIN_ROOT/scripts/...`
- The plugin communicates with Copilot exclusively through the app-server JSON-RPC protocol (stdio for direct, Unix socket for broker)

### Architecture Overview
1. **Commands** (`commands/`) define the user-facing slash commands and parse arguments
2. **Scripts** (`scripts/`) are the entry points invoked by commands and hooks
3. **Library** (`scripts/lib/`) contains all shared logic: Copilot client, state management, git helpers, rendering
4. **Hooks** (`hooks/`) wire session lifecycle and the optional stop-review gate
5. **Agents** (`agents/`) define the `copilot-rescue` subagent for task delegation
6. **Skills** (`skills/`) provide internal guidance documents for the rescue subagent

### Testing Requirements
- Tests live in the repo-root `tests/` directory, not here
- Run `npm test` from the repo root

<!-- MANUAL: -->
