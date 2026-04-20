<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# .claude-plugin

## Purpose
Plugin manifest for the Claude Code plugin system. Declares the plugin identity, version, and metadata.

## Key Files

| File | Description |
|------|-------------|
| `plugin.json` | Plugin manifest: name (`codex`), version, description, author. Read by `app-server.mjs` at runtime to populate client info. |

## For AI Agents

### Working In This Directory
- The `version` field must stay in sync with the other three manifests; use `npm run bump-version` from the repo root
- `plugin.json` is loaded at runtime by `scripts/lib/app-server.mjs` to set the JSON-RPC client version

<!-- MANUAL: -->
