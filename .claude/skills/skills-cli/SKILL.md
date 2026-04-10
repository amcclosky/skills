---
name: skills-cli
description: Install, remove, update, and restore agent skills using the skills CLI (pnpm dlx skills). Use when user wants to add or remove a skill, update installed skills, restore from the lockfile, or adopt a skill into a plugin. Supports "/skills-cli adopt <skill> <plugin>" to move a skill into a plugin.
---

# Skills CLI

Manage agent skills via `pnpm dlx skills`. Always run through mise and always target `--agent claude-code`.

If invoked as `/skills-cli adopt <skill-name> <plugin-name>`, jump directly to the [Adopt a skill into a plugin](#adopt-a-skill-into-a-plugin) workflow using the provided arguments.

## Install a skill

```bash
# From GitHub repo
mise exec -- pnpm dlx skills add <owner>/<repo> --agent claude-code

# From URL
mise exec -- pnpm dlx skills add <url> --agent claude-code

# Pick specific skills from a multi-skill repo
mise exec -- pnpm dlx skills add <owner>/<repo> --agent claude-code --skill <name>
```

## Remove a skill

```bash
mise exec -- pnpm dlx skills remove <name> --agent claude-code
```

## Update installed skills

```bash
mise exec -- pnpm dlx skills check    # see what's outdated
mise exec -- pnpm dlx skills update   # update all to latest
```

## Restore from lockfile

```bash
mise exec -- pnpm dlx skills experimental_install
```

Run this after cloning or when `skills-lock.json` is present but skills are missing.

## List installed skills

```bash
mise exec -- pnpm dlx skills list
```

## Adopt a skill into a plugin

Move an installed skill from `.claude/skills/` into a plugin and symlink it back.

1. Verify the skill exists in `.claude/skills/<skill-name>` and the plugin exists in `plugins/<plugin-name>/`.
2. Ensure `plugins/<plugin-name>/skills/` directory exists (create if needed).
3. Move the skill:
   ```bash
   mv .claude/skills/<skill-name> plugins/<plugin-name>/skills/<skill-name>
   ```
4. Symlink it back:
   ```bash
   ln -s ../../../plugins/<plugin-name>/skills/<skill-name> .claude/skills/<skill-name>
   ```
5. Verify the symlink resolves correctly:
   ```bash
   ls -la .claude/skills/<skill-name>
   ```
6. Remove the skill's entry from `skills-lock.json` (it's now owned by the plugin, not the skills CLI).

After adopting, the canonical copy lives in the plugin. The symlink keeps it visible to Claude Code.

## Rules

1. **Always pass `--agent claude-code`** when adding or removing skills.
2. **Always run through `mise exec --`**.
3. **Commit `skills-lock.json`** after adding or removing skills.
