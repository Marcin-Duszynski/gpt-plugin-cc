<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# skills

## Purpose
Skill definitions for the `codex-rescue` subagent. Skills provide internal guidance documents that shape how the subagent constructs and forwards prompts to Codex.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `codex-cli-runtime/` | Runtime contract for calling the codex-companion script (see `codex-cli-runtime/AGENTS.md`) |
| `codex-result-handling/` | Guidance for presenting Codex output back to the user (see `codex-result-handling/AGENTS.md`) |
| `gpt-5-4-prompting/` | Prompt-crafting recipes and anti-patterns for Codex/GPT models (see `gpt-5-4-prompting/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Each skill is a directory containing a `SKILL.md` file
- Skills are referenced by name in the agent's frontmatter (`skills: [codex-cli-runtime, gpt-5-4-prompting]`)
- These are read-only guidance documents, not executable code

<!-- MANUAL: -->
