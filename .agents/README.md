# Shared agent assets

## Skills (`skills/`)

Process skills used by Claude Code, Cursor, and GitHub Copilot (via repo instructions). They were copied from the [Superpowers](https://github.com/obra/superpowers) `superpowers` plugin (marketplace) skill set; filenames and front matter are unchanged.

Re-link into tool-specific folders after clone:

```bash
./.agents/scripts/link-agent-configs.sh
```

This creates:

- `.claude/skills` → `.agents/skills` (Claude Code project skills)
- `.github/copilot/skills` → `.agents/skills` (reference path for Copilot; see `AGENTS.md`)
