---
description: Check whether the local Copilot CLI is ready and optionally toggle the stop-time review gate
argument-hint: '[--enable-review-gate|--disable-review-gate]'
allowed-tools: Bash(node:*), Bash(npm:*), AskUserQuestion
---

Run:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copilot-companion.mjs" setup --json $ARGUMENTS
```

If the result says Copilot is unavailable:
- Use `AskUserQuestion` exactly once to ask whether Claude should help install Copilot now.
- Put the install option first and suffix it with `(Recommended)`.
- Use these two options:
  - `Install Copilot (Recommended)`
  - `Skip for now`
- If the user chooses install, direct them to the Copilot CLI installation page and suggest they run `!copilot --version` after installing to verify.

- Then rerun:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copilot-companion.mjs" setup --json $ARGUMENTS
```

If Copilot is already installed:
- Do not ask about installation.

Output rules:
- Present the final setup output to the user.
- If installation was skipped, present the original setup output.
