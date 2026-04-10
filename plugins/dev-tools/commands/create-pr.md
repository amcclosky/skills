---
description: Create a pull request with context-aware description based on conversation
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(gh pr create:*), Bash(gh pr view:*), WebSearch
---

**Arguments:** $ARGUMENTS

Parse the arguments for any of the following options:
- `--gif` or `gif`: Include a GIF section - search for an appropriate reaction GIF
- `--screenshots` or `screenshots`: Include a Screenshots section (prompt user to add screenshots)
- `--issue <ISSUE>` or `issue:<ISSUE>`: Link to a Jira issue (e.g., `--issue PROJ-1234` or `issue:PROJ-1234`)
- `--sentry <ISSUE>` or `sentry:<ISSUE>`: Link to a Sentry issue (e.g., `--sentry PROJ-1ABC` or `sentry:PROJ-1ABC`)
- Any other text: Treat as additional context for the PR description

Examples:
- `/create-pr --gif` - Include a GIF
- `/create-pr --issue PROJ-1234` - Link to Jira issue PROJ-1234, prefix title with "`PROJ-1234` "
- `/create-pr --sentry PROJ-1ABC` - Link to Sentry issue, prefix title with "`PROJ-1ABC` "
- `/create-pr --gif --screenshots --issue PROJ-5000` - Include all optional sections
- `/create-pr fixes the login bug` - Additional context for the description

---

Create a pull request for the current branch. Follow these steps:

1. Run `git status` to check for uncommitted changes. If there are uncommitted changes, warn the user and ask if they want to commit first.

2. Run `git log main..HEAD --oneline` to see all commits on this branch that will be included in the PR.

3. Run `git diff main...HEAD` to see the full diff of changes.

4. Analyze the changes and conversation history to understand:
   - What was changed and why
   - What type of change this is (fix, feature, breaking change)
   - How to test the changes
   - Whether environment/secrets files were modified

5. Create the PR using `gh pr create` with the body format below. Use GitHub-flavored markdown throughout:
   - Use **bold**, `code`, and other formatting to improve readability
   - Use code blocks with language identifiers (e.g., ```python) for code snippets
   - Use mermaid diagrams (```mermaid) when helpful to illustrate:
     - Data flow or architecture changes
     - State transitions
     - Sequence diagrams for API/service interactions
   - Use tables to summarize changes when there are multiple related modifications
   - Keep descriptions **concise and reviewer-focused** - explain what a reviewer needs to know, not implementation details they can see in the diff

```
## Description

[1-3 concise sentences focused on WHAT changed and WHY. Be direct and reviewer-focused. Avoid restating what's obvious from the diff.]

[Optional: Include a mermaid diagram if the change involves complex flow, architecture, or state changes]

## Closes issue(s)
[Only include if --issue or --sentry argument provided]
- Jira: [<ISSUE>](https://<ORG>.atlassian.net/browse/<ISSUE>)
- Sentry: [<ISSUE>](https://<ORG>.sentry.io/issues/<ISSUE>/)

## How to test / repro / QA instructions

1. [Specific, actionable step]
2. [...]
3. [Expected result]

## Screenshots
[Only include if --screenshots argument provided]
[Placeholder for user to add screenshots]

## What GIF best describes this PR?
[Only include if --gif argument provided]
[Search for and embed an appropriate reaction GIF]

## Changes include

- [ ] Fix (non-breaking change that solves an issue/bug)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (change that is not backwards-compatible and/or changes current functionality)

## Changes to environment variables

[Note any changes to env vars or secrets, or "None"]

## Reminders / Checklist

- [x] All my tests have passed
- [x] Based feature branch off main (default branch)
- [x] I have pulled the latest version of main
- [ ] I have updated the README if needed
- [ ] I have updated environment variable documentation with any new variables
- [ ] I have updated the deployment environment with new environment variables
```

6. **Conditional sections based on arguments:**
   - If `--gif` was provided: Use WebSearch to find an appropriate reaction GIF and include the "## What GIF best describes this PR?" section
   - If `--screenshots` was provided: Include the "## Screenshots" section with a placeholder
   - If `--issue` was provided: Prefix the PR title with the issue number and a space (e.g., "`PROJ-1234` Fix bug..."), and include the "## Closes issue(s)" section with the Jira link
   - If `--sentry` was provided: Prefix the PR title with the Sentry issue ID and a space (e.g., "`PROJ-1ABC` Fix error..."), and include the "## Closes issue(s)" section with the Sentry link

7. After creating the PR, display the PR URL to the user.

**Writing guidelines:**
- Be concise. Reviewers are busy - get to the point.
- Focus on the "why" and any non-obvious decisions. The "what" is in the diff.
- Omit sections that don't apply (e.g., skip "Other comments" if there are none).
- Use formatting to make the PR scannable, not verbose.
