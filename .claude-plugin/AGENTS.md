<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# .claude-plugin

## Purpose
Marketplace registration metadata for the Claude Code plugin marketplace. This directory is read by the Claude Code plugin system to discover and list the plugin.

## Key Files

| File | Description |
|------|-------------|
| `marketplace.json` | Declares the marketplace entry: owner, plugin names, versions, and paths to the inner `plugins/codex` and `plugins/copilot` packages |

## For AI Agents

### Working In This Directory
- The `version` field in `marketplace.json` must stay in sync with `package.json`, `package-lock.json`, and each plugin's `.claude-plugin/plugin.json`
- Use `npm run bump-version <ver>` from the repo root to update all manifests at once
- Do not edit `marketplace.json` version by hand

<!-- MANUAL: -->
