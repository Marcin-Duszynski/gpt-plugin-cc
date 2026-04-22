---
description: Run an AI-crafted code review using GPT-5.4 via Copilot CLI
argument-hint: '<review focus prompt>'
allowed-tools: Agent
---

Run a GPT-5.4 code review with an AI-crafted prompt.

Raw slash-command arguments:
`$ARGUMENTS`

Your job:

1. Take the user's arguments as the review focus. If the user provided no arguments, default the focus to: "Review all recent changes for bugs, logic errors, security issues, and code quality problems."

2. Build an enriched review prompt for GPT-5.4 that includes:
   - An instruction to use `git diff` and `git status` to examine the current changes in the repository
   - The user's review focus as the primary area of concern
   - An instruction to report findings with severity (critical, high, medium, low), affected file and line, and a clear explanation of each issue
   - An instruction to provide a summary verdict at the end

3. Invoke the `gpt:gpt-review` subagent via the `Agent` tool (`subagent_type: "gpt:gpt-review"`), passing the enriched prompt as the task prompt.

4. After the Agent tool call completes, do not repeat or echo the subagent's full output. Instead, return:
   - A **short summary** (2-4 sentences) of the key findings
   - A **Next actions** section listing what the user can do next (e.g. "Fix the critical issues", "Run `/gpt:review` again after changes", "Commit if satisfied")

Core constraints:
- This command is review-only. Do not fix issues, apply patches, or suggest that you are about to make changes.
- Do not run any git commands yourself. The Copilot CLI handles all git analysis internally.
