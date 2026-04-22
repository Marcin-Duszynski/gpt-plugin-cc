# Changelog

## 1.5.0

- Add `--pr <number>` support to `/copilot:review` and `/copilot:adversarial-review` for PR-based reviews
- Improve error handling to report stderr when Copilot CLI exits non-zero
- Enhance shell argument escaping for focus text in adversarial-review commands

## 1.4.0

- Add dedicated `copilot-review` and `copilot-adversarial-review` subagents for review delegation
- Route `/copilot:review` and `/copilot:adversarial-review` through subagents via the `Agent` tool instead of direct Bash invocations

## 1.3.0

- Remove legacy CLI fallback; Copilot CLI with `--acp` support is now required
- Drop `checkAcpSupport` runtime probe and all JSONL parsing helpers (~200 lines removed)

## 1.2.0

- Migrate task and review execution to ACP (JSON-RPC 2.0 over stdio) when `copilot --acp` is available; fall back to legacy CLI for older installs
- Fix potential process hang on unexpected child exit by draining pending ACP requests in the exit handler
- Drain stderr pipe and add stdin error handler to prevent child process deadlocks on auth failure or early exit

## 1.1.3

- Fix `/copilot:review` no longer emits `[copilot]` progress lines; only the final result is printed to stdout

## 1.1.2

- Fix adversarial review JSON extraction: handle `assistant.message` NDJSON events and prefer `final_answer` phase content
- Fix adversarial review output shape: inject the JSON schema into the prompt so Copilot produces `verdict`, `severity`, and `next_steps`
- Add fallback JSON extraction in structured output parser for responses with trailing text after the JSON object

## 1.1.1

- Filter ephemeral Copilot CLI session events (MCP status noise) from the progress pipeline
- Suppress stderr progress for adversarial review runs, which produce structured JSON output
- Add log file fallback guidance to status and result commands for diagnostic context

## 1.1.0

- Reviews always use GPT-5.4 with xhigh effort
- Fix incorrect Copilot CLI install URL

## 1.0.0

- Initial version of the Copilot plugin for Claude Code
