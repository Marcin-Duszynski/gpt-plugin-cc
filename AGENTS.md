<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# gpt-plugin-cc

## Purpose
A Claude Code plugin collection that integrates OpenAI Codex and GitHub Copilot for code reviews and task delegation. Users invoke slash commands (`/codex:review`, `/copilot:review`, `/codex:rescue`, `/copilot:rescue`, etc.) inside Claude Code. The Codex plugin bridges to the local Codex CLI via its app-server JSON-RPC protocol; the Copilot plugin invokes the Copilot CLI directly.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Project manifest (npm scripts: `build`, `test`, `bump-version`) |
| `package-lock.json` | Locked dependency tree |
| `tsconfig.app-server.json` | TypeScript config for generated app-server types |
| `README.md` | User-facing install and usage guide |
| `LICENSE` | Apache-2.0 licence |
| `NOTICE` | Attribution notice |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `.claude-plugin/` | Marketplace registration metadata (see `.claude-plugin/AGENTS.md`) |
| `plugins/` | Contains the `codex` and `copilot` plugin packages (see `plugins/AGENTS.md`) |
| `scripts/` | Repository-level tooling scripts (see `scripts/AGENTS.md`) |
| `tests/` | Test suite for the plugin library modules (see `tests/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Node.js >= 18.18.0, ESM only (`"type": "module"`)
- Run `npm test` before committing (uses `node --test`)
- Run `npm run build` to regenerate app-server types (requires `codex` CLI)
- Version is synchronised across four manifests; use `npm run bump-version <ver>` and `npm run check-version`

### Testing Requirements
- All tests live in `tests/` and use the Node.js built-in test runner
- No external test framework; import `node:test` and `node:assert`

### Common Patterns
- Pure ESM (`.mjs` everywhere, no CommonJS)
- No bundler; scripts run directly via `node`
- Library code in `plugins/{codex,copilot}/scripts/lib/`; entry-point scripts in `plugins/{codex,copilot}/scripts/`

## Dependencies

### External
- `typescript` ^6.x (dev only, for app-server type generation)
- `@types/node` ^25.x (dev only)

<!-- MANUAL: -->
