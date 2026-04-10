---
name: skills-cli
description: Install, remove, update, and restore agent skills using the skills CLI (pnpm dlx skills). Use when user wants to add or remove a skill, update installed skills, or restore from the lockfile.
---

# Skills CLI

Manage agent skills via `pnpm dlx skills`. Always run through mise and always target `--agent claude-code`.

## Install skills

Always pass `--yes` to skip interactive prompts (scope selection, confirmation) that hang in non-interactive shells.

**Always pass `--agent claude-code`** — never omit it. Without it the CLI installs to every agent it finds, creating dozens of unwanted directories.

```bash
# All skills from a repo
mise exec -- pnpm dlx skills add <owner>/<repo> --agent claude-code --yes

# Specific skills from a multi-skill repo (pass all names to one --skill flag)
mise exec -- pnpm dlx skills add <owner>/<repo> --agent claude-code --skill <name1> <name2> <name3> --yes

# From a URL
mise exec -- pnpm dlx skills add <url> --agent claude-code --yes
```

When the user asks to install multiple skills from the same repo, use a single `add` command with `--skill <name1> <name2> ...` — do not run separate commands per skill.

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

1. **Always pass `--agent claude-code`** when adding or removing skills. Never omit this flag — the default installs to all detected agents.
2. **Always pass `--yes`** to avoid interactive prompts that hang.
3. **Always run through `mise exec --`**.
4. **Commit `skills-lock.json`** after adding or removing skills.
5. **One command for multiple skills** — use `--skill name1 name2 name3`, not separate invocations.
