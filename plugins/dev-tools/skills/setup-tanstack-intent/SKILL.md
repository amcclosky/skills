---
name: setup-tanstack-intent
description: Set up TanStack Intent for a repo as a consumer — discover skills shipped in npm packages, generate the intent-skills block, and create .claude/rules/intent-skills.md.
user-invocable: true
---

# TanStack Intent (Consumer Setup)

Set up a repo to consume Agent Skills shipped inside npm packages via [TanStack Intent](https://tanstack.com/intent/latest).

## Setup

Generate `.claude/rules/intent-skills.md` by piping `intent list --json` into the bundled script:

```bash
npx @tanstack/intent@latest list --json | node .claude/skills/setup-tanstack-intent/scripts/generate-intent-skills.ts
```

This discovers all intent-enabled packages in `node_modules`, resolves stable paths where possible, and writes the rules file.

To write to a different path:

```bash
npx @tanstack/intent@latest list --json | node .claude/skills/setup-tanstack-intent/scripts/generate-intent-skills.ts --output AGENTS.md
```

If `intent list` finds no packages, the script exits with an error — the project has no intent-enabled dependencies.

## Checking for updates

After updating npm packages, re-run the same command to regenerate the rules file. The script overwrites the output file, so diff it before committing to review changes.

```bash
npx @tanstack/intent@latest list --json | node .claude/skills/setup-tanstack-intent/scripts/generate-intent-skills.ts
git diff .claude/rules/intent-skills.md
```

## Rules

1. Always run `intent list --json` — never construct mappings by hand.
2. The intent block must stay between `<!-- intent-skills:start -->` and `<!-- intent-skills:end -->` markers.
3. Skill paths point into `node_modules/` — they update when packages are updated.
4. Only add mappings for packages actually installed in the project.
