<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-21 | Updated: 2026-04-21 -->

# .claude-plugin

## Purpose
Plugin manifest for the Claude Code plugin system. Declares the plugin identity, version, and metadata.

## Key Files

| File | Description |
|------|-------------|
| `plugin.json` | Plugin manifest: name (`copilot`), description, author. Read at runtime to populate client info. |

## For AI Agents

### Working In This Directory
- `plugin.json` is loaded at runtime by `scripts/lib/app-server.mjs` to set the JSON-RPC client version

<!-- MANUAL: -->
