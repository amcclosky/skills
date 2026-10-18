# amcclosky

A Claude Code plugin marketplace.

## Install

```
claude plugin marketplace add amcclosky/skills
```

## Plugins

### dev-tools

A collection of development skills and agents.

```
claude plugin install dev-tools@amcclosky
```

#### Skills

- **grill-me** — Interview the user relentlessly about a plan or design until reaching shared understanding
- **tdd** — Test-driven development with red-green-refactor loop
- **write-a-skill** — Create new agent skills with proper structure, progressive disclosure, and bundled resources
- **setup-tanstack-intent** — Set up TanStack Intent for a repo as a consumer

#### Agents

- **commit** — Commit pending changes with context-aware messages based on conversation

#### Commands

- `/commit` — Commit pending changes (invokes the commit agent)
- `/create-pr` — Create a pull request with context-aware description based on conversation

---

### ui-skills

A collection of UI, design, and frontend best-practice skills.

```
claude plugin install ui-skills@amcclosky
```

#### Skills

- **react-best-practices** — React performance optimization guidelines (60 rules across 8 categories, originally from Vercel Engineering)
- **react-composition-patterns** — React composition patterns that scale (compound components, render props, context providers, React 19 APIs)
- **react-view-transitions** — Implement smooth animations using React's View Transition API
- **web-design-guidelines** — Review UI code for Web Interface Guidelines compliance

---

### local-browse

Persistent local browsers for agents: a headed [Helium](https://github.com/imputnet/helium) browser (Chromium) for [agent-browser](https://github.com/vercel-labs/agent-browser), desktop Safari, and Mobile Safari in the iOS Simulator, plus an agent-only credential vault (macOS Keychain or a scoped 1Password service account) and saved playbooks.

```
claude plugin install local-browse@amcclosky
```

After installing, run `local-browse setup` once.

#### Skills

- **local-browse** — Start and use the dedicated Helium browser, drive Mobile Safari in the iOS Simulator with [wdio session](https://webdriver.io/docs/session) (pages) and [agent-device](https://github.com/callstack/agent-device) (native iOS UI), and log in with agent-vault credentials
  - `references/playbooks/` holds saved, verified workflows (sign in to Google, sign in with Google on another site, open a site on mobile) so they are not rediscovered each time

#### Binaries

- `local-browse` — `start`, `stop`, `status`, `setup`, and `vault add|remove|op-token`
- `agent-browser-plugin-vault` — agent-browser credential provider (`keychain` and `1password` backends)

#### MCP servers

- `safari-mcp` — Safari's built-in MCP server (`safaridriver --mcp`, Safari 27+) for desktop Safari. Enable Safari → Settings → Developer → "Allow remote automation and external agents" first.

## Acknowledgements

Some skills are adapted from [mattpocock/skills](https://github.com/mattpocock/skills) and [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills).
