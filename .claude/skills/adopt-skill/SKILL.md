---
name: adopt-skill
description: Move an installed skill from .claude/skills/ into a plugin and symlink it back. Use when user says "adopt skill", "/adopt-skill <skill> <plugin>", or wants to move a skill into a plugin.
---

# Adopt a Skill into a Plugin

Move a skill from `.claude/skills/` into a plugin so the plugin owns it, then symlink it back so Claude Code still finds it.

Usage: `/adopt-skill <skill-name> <plugin-name>`

## Steps

1. Verify the skill exists in `.claude/skills/<skill-name>` and is not already a symlink.
2. Verify the plugin exists in `plugins/<plugin-name>/`.
3. Ensure `plugins/<plugin-name>/skills/` directory exists (create if needed).
4. Move the skill:
   ```bash
   mv .claude/skills/<skill-name> plugins/<plugin-name>/skills/<skill-name>
   ```
5. Symlink it back:
   ```bash
   ln -s ../../plugins/<plugin-name>/skills/<skill-name> .claude/skills/<skill-name>
   ```
6. Verify the symlink resolves correctly:
   ```bash
   ls -la .claude/skills/<skill-name>
   ```
7. Remove the skill's entry from `skills-lock.json` if present (it's now owned by the plugin, not the skills CLI).
