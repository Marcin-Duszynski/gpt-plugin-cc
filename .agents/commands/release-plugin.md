---
description: Bump a plugin version and update its changelog
argument-hint: "[--plugin <codex|copilot>] [--bump patch|minor|major] [changelog entry ...]"
allowed-tools: Read, Edit, Bash(git:*)
model: haiku
---

Release a new version of a plugin: bump its version in the marketplace manifest and prepend a changelog entry.

## Parsing arguments

From `$ARGUMENTS`, extract:

- `--plugin <name>` — optional. Must match a plugin name in `plugins[]` in `.claude-plugin/marketplace.json`. If omitted, autodetect (see below).
- `--bump <type>` — optional. One of `patch`, `minor`, `major`. If omitted, autodetect (see below).
- Everything else is the changelog text. If omitted, autodetect (see below).

## Autodetecting the plugin

If `--plugin` is not supplied, run:

```bash
git diff --name-only HEAD
```

Collect the changed file paths. Any file under `plugins/<name>/` signals that plugin. Cross-reference against the `plugins[]` entries in `.claude-plugin/marketplace.json` to confirm `<name>` is a known plugin.

- Only one plugin's files changed → use that plugin name
- Files from multiple plugins changed → stop and tell the user to specify `--plugin` explicitly
- No plugin files changed → stop and tell the user to specify `--plugin` explicitly

## Autodetecting bump type and changelog entries

If `--bump` or changelog text is missing, run:

```bash
git diff HEAD -- plugins/<plugin>/
```

Read the diff and use it to fill in what was not supplied:

**Bump type** (if `--bump` was omitted): infer from the nature of the changes:
- Any breaking change (removed export, changed CLI flag, incompatible behaviour) → `major`
- New behaviour, new feature, new option, new default → `minor`
- Bug fix, typo, URL correction, internal refactor with no behaviour change → `patch`

**Changelog entries** (if no text was supplied): write 1–3 concise bullet lines that describe *what changed and why it matters* to a user of the plugin. Base them on the actual diff — do not invent changes. Keep each line under 100 characters.

## Steps

1. **Read current version**

   Read `.claude-plugin/marketplace.json`. Find the entry in `plugins[]` where `name` equals the plugin argument. Extract its `version` string (e.g. `"1.0.0"`).

2. **Calculate new version**

   Apply the bump to the three-part semver:
   - `patch` → increment third number, keep others (1.2.3 → 1.2.4)
   - `minor` → increment second number, reset third to 0 (1.2.3 → 1.3.0)
   - `major` → increment first number, reset second and third to 0 (1.2.3 → 2.0.0)

3. **Update marketplace.json**

   Edit `.claude-plugin/marketplace.json`: set the `version` field of the matching plugin entry to the new version string.

4. **Update changelog**

   Read `plugins/<plugin>/CHANGELOG.md`. Prepend a new section immediately after the `# Changelog` heading:

   ```
   ## <new-version>

   - <entry 1>
   - <entry 2>
   ```

   Leave all existing content intact below the new section.

5. **Commit**

   Stage all unstaged changes — the plugin source files, the marketplace manifest, and the changelog — then create a commit:

   ```bash
   git add .claude-plugin/marketplace.json plugins/<plugin>/
   git commit -m "chore: release version <new-version> of <plugin> plugin"
   ```

6. **Push**

   Push the commit to the remote:

   ```bash
   git push
   ```

7. **Report**

   Output a short summary: plugin name, old version → new version, and the changelog lines added.
