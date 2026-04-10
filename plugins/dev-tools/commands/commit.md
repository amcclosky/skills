---
description: Commit pending changes with context-aware messages based on conversation
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
---

Commit all pending changes on this branch. Follow these steps:

1. Run `git status` and `git diff` to see all pending changes (staged and unstaged)

2. Analyze the changes and determine if they should be a single commit or split into multiple commits. Split into multiple commits when:
   - Changes affect unrelated features or areas of the codebase
   - There are distinct logical units of work (e.g., a refactor + a new feature)
   - Separating would make the git history clearer and more useful

3. For each commit, write a message with this format:
   - **Line 1**: Conventional commit format: `<type>(<scope>): <description>` (max 72 chars). Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`, `build`. Scope is optional but encouraged.
   - **Line 2**: Blank
   - **Lines 3+**: Detailed description explaining:
     - What specifically changed
     - Why these changes were made (use context from our conversation)
     - Any relevant context that would help someone reviewing later understand the reasoning

4. Stage the appropriate files and create each commit

Use the conversation history to understand the intent and context behind the changes. The detailed description should capture the "why" - not just what changed, but the reasoning and goals behind the changes.
