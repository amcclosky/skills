---
name: skills-cli
description: Install, remove, update, and restore agent skills using the skills CLI (pnpm dlx skills). Use when user wants to add or remove a skill, update installed skills, or restore from the lockfile.
---

# Skills CLI

Manage agent skills via `pnpm dlx skills`. Always run through mise and always target `--agent claude-code`.

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

## Rules

1. **Always pass `--agent claude-code`** when adding or removing skills.
2. **Always run through `mise exec --`**.
3. **Commit `skills-lock.json`** after adding or removing skills.
