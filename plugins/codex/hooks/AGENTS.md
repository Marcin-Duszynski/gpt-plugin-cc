<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# hooks

## Purpose
Claude Code hook configuration for the plugin. Hooks fire on session lifecycle events and the optional stop-time review gate.

## Key Files

| File | Description |
|------|-------------|
| `hooks.json` | Defines three hooks: `SessionStart` and `SessionEnd` (call `session-lifecycle-hook.mjs` for broker management), `Stop` (calls `stop-review-gate-hook.mjs` for the optional review gate, 15-minute timeout) |

## For AI Agents

### Working In This Directory
- `SessionStart` hook ensures a shared Codex broker session is available
- `SessionEnd` hook tears down the broker session
- `Stop` hook runs a targeted Codex adversarial review on Claude's pending response; blocks the stop if issues are found
- The stop review gate is opt-in and controlled via `/codex:setup --enable-review-gate`

<!-- MANUAL: -->
