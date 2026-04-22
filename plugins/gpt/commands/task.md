---
description: Delegate any task to GPT-5.4 via Copilot CLI with xhigh reasoning effort
argument-hint: '<task prompt>'
allowed-tools: Agent
---

Delegate an arbitrary task to GPT-5.4 via the Copilot CLI.

Raw slash-command arguments:
`$ARGUMENTS`

Your job:

1. Take the user's arguments as the task description. If the user provided no arguments, ask them what task they would like GPT-5.4 to perform.

2. Build an enriched task prompt for GPT-5.4 that includes:
   - The user's task description as the primary objective
   - An instruction to work within the current repository and use all available tools (file read/write, shell commands, etc.) as needed
   - An instruction to report clearly what was done, what files were changed, and any issues encountered

3. Invoke the `gpt:gpt-task` subagent via the `Agent` tool (`subagent_type: "gpt:gpt-task"`), passing the enriched prompt as the task prompt.

4. After the Agent tool call completes, do not repeat or echo the subagent's full output. Instead, return:
   - A **short summary** (2-4 sentences) of what was done and any issues encountered
   - A **Next actions** section listing what the user can do next (e.g. "Review the changes", "Run tests", "Commit the changes", "Run `/gpt:task` with a follow-up prompt")
