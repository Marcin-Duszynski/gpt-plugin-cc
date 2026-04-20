<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# scripts

## Purpose
All runtime JavaScript for the plugin. Contains entry-point scripts (invoked by commands and hooks) and the `lib/` directory with shared library modules.

## Key Files (Entry Points)

| File | Description |
|------|-------------|
| `codex-companion.mjs` | Main entry point for the `codex-rescue` subagent; dispatches `task`, `review`, `adversarial-review`, `status`, `result`, `cancel` subcommands |
| `session-lifecycle-hook.mjs` | Hook entry point for `SessionStart`/`SessionEnd`; manages the shared broker session |
| `stop-review-gate-hook.mjs` | Hook entry point for the `Stop` hook; runs a targeted Codex review on Claude's response |
| `app-server-broker.mjs` | Standalone broker process that wraps a single Codex app-server instance for session reuse |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `lib/` | Shared library modules (see `lib/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Entry-point scripts are thin orchestrators that parse arguments, call library functions, and format output
- They are invoked via `node "$CLAUDE_PLUGIN_ROOT/scripts/<name>.mjs"` from commands and hooks
- `codex-companion.mjs` is the largest entry point; it handles both foreground and background execution with job tracking
- `app-server-broker.mjs` runs as a detached background process, spawned by `broker-lifecycle.mjs`

### Testing Requirements
- Entry points are tested indirectly through `tests/runtime.test.mjs` and `tests/commands.test.mjs`
- Library modules have dedicated test files in `tests/`

### Common Patterns
- All files are ESM (`.mjs`)
- Entry points import from `./lib/` using relative paths
- `process.exitCode` is set rather than calling `process.exit()` directly
- Arguments come from `$ARGUMENTS` (split by `args.mjs`) or direct CLI args

<!-- MANUAL: -->
