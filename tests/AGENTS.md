<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# tests

## Purpose
Test suite for the plugin's library modules. Uses the Node.js built-in test runner (`node --test`).

## Key Files

| File | Description |
|------|-------------|
| `helpers.mjs` | Shared test utilities (temp directories, fixture loading) |
| `fake-codex-fixture.mjs` | Mock Codex app-server for integration-style tests |
| `broker-endpoint.test.mjs` | Tests for broker endpoint creation and parsing |
| `bump-version.test.mjs` | Tests for the version-bump script |
| `commands.test.mjs` | Tests for argument parsing and command-line flag handling |
| `git.test.mjs` | Tests for Git helper functions (review target resolution, diff collection) |
| `process.test.mjs` | Tests for process management (command execution, tree termination) |
| `render.test.mjs` | Tests for output rendering (review results, status reports, cancel reports) |
| `runtime.test.mjs` | Tests for the Codex app-server client and turn capture logic |
| `state.test.mjs` | Tests for persistent state management (jobs, config) |

## For AI Agents

### Working In This Directory
- Run all tests: `npm test` (or `node --test tests/*.test.mjs`)
- Each test file is self-contained and can be run individually
- Tests create temp directories and clean up after themselves
- The `fake-codex-fixture.mjs` provides a mock app-server for testing the JSON-RPC protocol without a real Codex binary

### Common Patterns
- Import from `node:test` (`describe`, `it`, `beforeEach`, `afterEach`) and `node:assert`
- Library modules are imported directly from `../plugins/codex/scripts/lib/`
- No mocking framework; stubs are manual or use the fake fixture

<!-- MANUAL: -->
