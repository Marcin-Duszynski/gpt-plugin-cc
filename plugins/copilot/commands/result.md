---
description: Show the stored final output for a finished Copilot job in this repository
argument-hint: '[job-id]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/copilot-companion.mjs" result "$ARGUMENTS"`

Present the full command output to the user. Do not summarize or condense it. Preserve all details including:
- Job ID and status
- The complete result payload, including verdict, summary, findings, details, artifacts, and next steps
- File paths and line numbers exactly as reported
- Any error messages or parse errors
- Follow-up commands such as `/copilot:status <id>` and `/copilot:review`

If the result contains errors, parse failures, or is otherwise unclear, run `/copilot:status <id>` to locate the log file path and read it for additional diagnostic context.
