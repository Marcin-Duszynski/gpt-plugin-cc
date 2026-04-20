<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-20 | Updated: 2026-04-20 -->

# schemas

## Purpose
JSON schemas used for structured output from Codex review runs.

## Key Files

| File | Description |
|------|-------------|
| `review-output.schema.json` | Defines the expected shape of structured review output: `verdict`, `summary`, `findings[]` (with severity, title, body, file, line range, recommendation), and `next_steps[]` |

## For AI Agents

### Working In This Directory
- The schema is loaded by `codex.mjs` via `readOutputSchema()` and passed to the Codex app-server `turn/start` request as `outputSchema`
- The `render.mjs` module validates and normalises the parsed output against this shape
- Findings severities: `critical`, `high`, `medium`, `low`

<!-- MANUAL: -->
