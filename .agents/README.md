# Shared agent assets

Source of truth for all agent-related assets in this repo. Tool-specific directories (`.claude/`, `.github/`) contain symlinks into here — edit assets in `.agents/`, not in the symlink targets.

Re-link into tool-specific folders after clone:

```bash
./.agents/scripts/link-agent-configs.sh
```

This creates:

- `.claude/skills` → `.agents/skills` (Claude Code project skills)
- `.claude/commands` → `.agents/commands` (Claude Code custom slash commands)
- `.github/copilot/skills` → `.agents/skills` (reference path for Copilot; see `AGENTS.md`)
- `.github/agents` → `.agents/agents` (GitHub Copilot agent definitions)

## Skills (`skills/`)

Process skills used by Claude Code, Cursor, and GitHub Copilot (via repo instructions). They were copied from the [Superpowers](https://github.com/obra/superpowers) `superpowers` plugin (marketplace) skill set; filenames and front matter are unchanged.

## Commands (`commands/`)

Claude Code custom slash commands available project-wide. Invoke with `/command-name` in any Claude Code session in this repo.

## Agents (`agents/`)

Agent definition files for GitHub Copilot and other tools that support the `AGENTS.md` / `.github/agents/` convention.
