<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# lib

## Purpose
Shared library modules for the Codex plugin. Every module is a pure ESM `.mjs` file imported by the entry-point scripts. This is the core of the plugin's logic.

## Key Files

| File | Description |
|------|-------------|
| `codex.mjs` | Codex app-server orchestration: thread/turn lifecycle, review execution, task execution, auth status, availability checks. Central module that ties everything together. |
| `app-server.mjs` | JSON-RPC client for the Codex app-server protocol. Two transports: `SpawnedCodexAppServerClient` (direct stdio) and `BrokerCodexAppServerClient` (Unix socket). |
| `app-server-protocol.d.ts` | TypeScript type declarations for the app-server JSON-RPC protocol (methods, params, responses, notifications) |
| `broker-endpoint.mjs` | Creates and parses broker endpoint URIs (`unix:` for POSIX, `pipe:` for Windows) |
| `broker-lifecycle.mjs` | Manages the shared broker session: spawn, connect, persist, teardown. Sessions are stored as `broker.json` in the state directory. |
| `state.mjs` | Persistent state management: workspace-scoped state directory, job records, config (e.g. `stopReviewGate`). State file is `state.json`; job payloads are individual `.json` files. |
| `tracked-jobs.mjs` | Job tracking: creates job records, tracks progress events, writes log files, runs jobs with automatic status updates on success/failure. |
| `job-control.mjs` | Job querying: status snapshots, single-job lookup, result resolution, cancellation resolution, progress preview from log files. |
| `render.mjs` | Output formatting: renders setup reports, review results (structured and native), task results, status reports, job details, cancel reports into markdown. |
| `git.mjs` | Git helpers: repository detection, branch detection, working-tree state, review target resolution, diff collection (inline and self-collect modes), branch comparison. |
| `process.mjs` | Process management: `runCommand`/`runCommandChecked` (synchronous spawn), `binaryAvailable`, `terminateProcessTree` (cross-platform). |
| `args.mjs` | Argument parsing: `parseArgs` (flags + positionals) and `splitRawArgumentString` (shell-like tokenisation with quote handling). |
| `prompts.mjs` | Prompt template loading and `{{VARIABLE}}` interpolation. |
| `fs.mjs` | File system utilities: temp dirs, JSON read/write, text detection, stdin reading. |
| `workspace.mjs` | Resolves the workspace root (Git root or cwd fallback). |

## For AI Agents

### Working In This Directory
- Every module is stateless except `state.mjs` which reads/writes to disk
- Import paths use `.mjs` extensions (required for ESM resolution)
- No circular dependencies; the dependency graph is roughly: `codex.mjs` -> `app-server.mjs` -> `broker-lifecycle.mjs` -> `broker-endpoint.mjs` / `state.mjs` -> `workspace.mjs` -> `git.mjs` -> `process.mjs`

### Key Architectural Decisions
- **Two transport modes**: Direct (spawn `codex app-server` as child process) and Broker (connect to a shared Unix socket). The broker avoids startup cost for repeated operations.
- **Turn capture**: `codex.mjs` uses a notification-based state machine (`TurnCaptureState`) to track multi-threaded Codex turns including subagent collaboration.
- **Job persistence**: Jobs are tracked in `state.json` (index) with full payloads in individual `{jobId}.json` files and progress in `{jobId}.log` files.

### Testing Requirements
- Each module has a corresponding test in `tests/`: e.g. `state.mjs` -> `tests/state.test.mjs`
- Run `npm test` from the repo root

### Common Patterns
- Functions return plain objects (no classes except the app-server clients)
- Error handling uses thrown `Error` instances, not error codes
- Cross-platform: Windows support via `process.platform` checks, `shell: true` on Win32

## Dependencies

### Internal
- Modules import from each other within this directory
- `app-server.mjs` reads `../../.claude-plugin/plugin.json` for version info

### External
- Node.js built-ins only: `node:fs`, `node:path`, `node:crypto`, `node:os`, `node:net`, `node:child_process`, `node:readline`, `node:process`

<!-- MANUAL: -->
