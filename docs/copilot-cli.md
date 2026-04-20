# GitHub Copilot CLI

A reference guide for the `copilot` CLI — GitHub's AI-powered coding assistant — with a focus on high-reasoning model usage.

## Overview

The `copilot` CLI provides an interactive (and scriptable) agentic environment that can edit files, run shell commands, search your codebase, and more. It supports multiple AI models and configurable permission levels.

```bash
copilot               # start interactive session
copilot -p "..."      # non-interactive: run a prompt and exit
copilot -i "..."      # interactive: pre-load a prompt, then stay in the session
```

---

## Models

Select a model with `--model` or the `/model` command inside a session:

```bash
copilot --model gpt-5.4
```

Available models (from `copilot help config`):

| Model | Notes |
|---|---|
| `gpt-5.4` | Highest-capability GPT model; supports xhigh reasoning effort |
| `gpt-5.4-mini` | Lighter GPT-5.4 variant; supports xhigh reasoning effort |
| `gpt-5.3-codex` | Codex-optimised variant |

---

## Reasoning Effort

The `--effort` flag (alias `--reasoning-effort`) controls how much compute the model spends reasoning before responding. Higher effort produces more thorough, accurate answers at the cost of speed and token usage.

```bash
copilot --model gpt-5.4 --effort xhigh
copilot --model gpt-5.4-mini --effort xhigh
```

| Level | When to use |
|---|---|
| `low` | Fast feedback, simple tasks |
| `medium` | Balanced — good default for most work |
| `high` | Complex refactors, architecture decisions |
| `xhigh` | Maximum reasoning; best for hard bugs, security reviews, and large-scale changes |

### GPT-5.4 with xhigh effort

Highest available capability. Use for code review, test generation, refactors, security audits, and any task where reasoning quality directly affects correctness:

```bash
# Interactive session
copilot --model gpt-5.4 --effort xhigh

# Non-interactive (requires --allow-all-tools for automation)
copilot --model gpt-5.4 --effort xhigh \
  --allow-all-tools \
  -p "Review all changes on this branch for logic errors and edge cases"
```

### GPT-5.4-mini with xhigh effort

Cost-efficient option for high-frequency automation where output quality is less critical: CI pipeline checks, summaries, changelogs, and quick lookups:

```bash
# Interactive session
copilot --model gpt-5.4-mini --effort xhigh

# Non-interactive
copilot --model gpt-5.4-mini --effort xhigh \
  --allow-all-tools \
  -p "Summarise the changes in this PR as a one-paragraph changelog entry"
```

---

## Interactive Session Commands

Once inside a session, these slash commands are available:

| Command | Description |
|---|---|
| `/model` | Switch AI model |
| `/plan` | Create an implementation plan before making changes |
| `/review` | Run code review agent on current changes |
| `/diff` | Show a diff of changes made in the session |
| `/pr` | Operate on pull requests for the current branch |
| `/delegate` | Send session to GitHub; Copilot will create a PR |
| `/fleet` | Enable parallel subagent execution |
| `/tasks` | View and manage background tasks |
| `/research` | Deep research using GitHub search and web sources |
| `/compact` | Summarise conversation to reduce context usage |
| `/context` | Show context window token usage |
| `/rewind` / `/undo` | Rewind last turn and revert file changes |
| `/share` | Export session to markdown, HTML, or GitHub gist |
| `/mcp` | Manage MCP server configuration |
| `/lsp` | Manage language server configuration |
| `/instructions` | View or toggle custom instruction files |
| `/env` | Show loaded environment (instructions, MCPs, skills, etc.) |
| `/clear` | Start a new session |

---

## Permissions

By default, the CLI prompts before running shell commands or writing files. Use flags to pre-approve actions.

### Quick flags

```bash
--allow-all-tools     # approve all tool calls without prompting
--allow-all-paths     # allow file access outside the working directory
--allow-all-urls      # allow all outbound URL access
--allow-all           # all three of the above
--yolo                # alias for --allow-all; same effect, shorter to type
```

### Granular tool control

```bash
# Allow all git subcommands
copilot --allow-tool='shell(git:*)'

# Allow git but block git push
copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'

# Allow all file writes
copilot --allow-tool='write'

# Allow all tools from a specific MCP server
copilot --allow-tool='MyMCP'

# Allow a specific MCP tool
copilot --allow-tool='MyMCP(my_tool)'
```

### Path permissions

```bash
# Allow access to an additional directory
copilot --add-dir ~/workspace

# Prevent access to /tmp
copilot --disallow-temp-dir
```

### URL permissions

```bash
# Allow HTTPS access to github.com
copilot --allow-url=github.com

# Deny a domain
copilot --deny-url=https://untrusted-host.com
```

---

## Session Management

```bash
copilot --continue              # resume most recent session
copilot --resume                # pick a previous session interactively
copilot --resume=<session-id>   # resume a specific session
copilot --resume=0cb916d        # resume by 7+ char ID prefix
```

---

## MCP Servers

MCP (Model Context Protocol) servers extend the CLI with additional tools. Configuration is loaded from:

- **User** — `~/.copilot/mcp-config.json`
- **Workspace** — `.mcp.json`
- **Plugins** — installed plugins that ship MCP servers

```bash
copilot mcp list                 # list configured servers
copilot mcp add <name> <cmd>     # add a stdio server
copilot mcp add --transport http <name> <url>   # add an HTTP server
copilot mcp get <name>           # show server details
copilot mcp remove <name>        # remove a server

# Add extra tools/toolsets from the built-in GitHub MCP server
copilot --add-github-mcp-toolset all
copilot --enable-all-github-mcp-tools

# Disable a built-in server
copilot --disable-builtin-mcps
copilot --disable-mcp-server github-mcp-server
```

---

## Autopilot Mode

Autopilot runs without pausing for approval at each step. Combined with `xhigh` effort it provides fully autonomous, high-quality execution:

```bash
copilot --autopilot --model gpt-5.4 --effort xhigh
copilot --mode autopilot --model gpt-5.4-mini --effort xhigh -p "Refactor the API layer"
```

Limit the number of autonomous continuation steps:

```bash
copilot --autopilot --max-autopilot-continues 10 --model gpt-5.4 --effort xhigh
```

---

## Non-interactive / Scripting

```bash
# -s suppresses stats (token counts, timing); outputs only the model response — useful for piping
copilot -s -p "Summarise the changes" --model gpt-5.4-mini --effort xhigh

# JSON output (JSONL, one object per line)
copilot --output-format json -p "..." --allow-all

# Share session to a file after completion
copilot -p "..." --share=./session-report.md

# Share to a secret GitHub gist
copilot -p "..." --share-gist
```

---

## Configuration File

Persistent settings live in `~/.copilot/config.json`. Notable keys:

| Key | Default | Notes |
|---|---|---|
| `model` | — | Default model for all sessions |
| `autoUpdate` | `true` | Auto-download CLI updates |
| `experimental` | `false` | Enable experimental features |
| `includeCoAuthoredBy` | `true` | Add Co-authored-by to commits |
| `stream` | `true` | Streaming output |
| `renderMarkdown` | `true` | Render markdown in terminal |
| `theme` | `"auto"` | `"auto"`, `"dark"`, or `"light"` |
| `logLevel` | `"default"` | Set to `"all"` for debug logging |

---

## Quick-reference: High-effort Recipes

```bash
# Code review
copilot --model gpt-5.4 --effort xhigh \
  -p "Review all changes on this branch for logic errors and edge cases" \
  --allow-all

# Test generation
copilot --model gpt-5.4 --effort xhigh \
  --allow-all \
  -p "Write unit tests for every exported function"

# CI changelog summary (cost-aware)
copilot --model gpt-5.4-mini --effort xhigh \
  --allow-all \
  -p "Summarise the changes in this PR as a one-paragraph changelog entry"

# Autonomous PR from a task description
copilot --model gpt-5.4 --effort xhigh \
  --autopilot --allow-all \
  -i "Implement the feature described in issue #42 and open a PR"
```
