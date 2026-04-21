# Changelog

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
