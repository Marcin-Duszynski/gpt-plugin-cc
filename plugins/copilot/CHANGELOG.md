# Changelog

## 1.1.1

- Filter ephemeral Copilot CLI session events (MCP status noise) from the progress pipeline
- Suppress stderr progress for adversarial review runs, which produce structured JSON output
- Add log file fallback guidance to status and result commands for diagnostic context

## 1.1.0

- Reviews always use GPT-5.4 with xhigh effort
- Fix incorrect Copilot CLI install URL

## 1.0.0

- Initial version of the Copilot plugin for Claude Code
