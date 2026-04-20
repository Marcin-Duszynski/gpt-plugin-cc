<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# scripts

## Purpose
Repository-level tooling scripts for maintenance tasks like version bumping.

## Key Files

| File | Description |
|------|-------------|
| `bump-version.mjs` | Synchronises the version string across all four manifest files (`package.json`, `package-lock.json`, `marketplace.json`, `plugin.json`). Supports `--check` mode for CI validation. |

## For AI Agents

### Working In This Directory
- Run via `npm run bump-version <version>` or `node scripts/bump-version.mjs <version>`
- `--check` mode (no version arg) reads the version from `package.json` and validates all manifests match
- Version format must be valid semver (e.g. `1.0.4`)

### Testing Requirements
- Covered by `tests/bump-version.test.mjs`

<!-- MANUAL: -->
