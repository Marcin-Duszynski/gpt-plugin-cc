<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# prompts

## Purpose
Prompt templates used by the plugin to instruct Codex during reviews. Templates use `{{VARIABLE}}` placeholders that are interpolated at runtime by `prompts.mjs`.

## Key Files

| File | Description |
|------|-------------|
| `adversarial-review.md` | Template for the adversarial review prompt; includes placeholders for `{{FOCUS}}`, `{{CONTEXT}}`, and `{{COLLECTION_GUIDANCE}}` |
| `stop-review-gate.md` | Template for the stop-time review gate; instructs Codex to review Claude's pending response |

## For AI Agents

### Working In This Directory
- Templates are loaded by `scripts/lib/prompts.mjs` via `loadPromptTemplate(rootDir, name)`
- Interpolation uses `{{KEY}}` syntax (uppercase, underscores)
- Keep templates focused on Codex instructions; avoid Claude-specific phrasing

<!-- MANUAL: -->
