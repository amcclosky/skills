# pnpm (Package Manager)

This project uses [pnpm](https://pnpm.io) as its package manager. Never use npm or yarn.

## Commands

Use pnpm equivalents for all package management operations:

| Instead of          | Use                  |
|---------------------|----------------------|
| `npm install`       | `pnpm install`       |
| `npm ci`            | `pnpm install --frozen-lockfile` |
| `npm run <script>`  | `pnpm run <script>`  |
| `npx <cmd>`         | `pnpm dlx <cmd>`     |
| `npm test`          | `pnpm test`          |
| `npm add <pkg>`     | `pnpm add <pkg>`     |
| `npm add -D <pkg>`  | `pnpm add -D <pkg>`  |
| `npm remove <pkg>`  | `pnpm remove <pkg>`  |

Remember to prefix all commands with `mise exec --` per project rules:

```bash
mise exec -- pnpm install
mise exec -- pnpm run build
mise exec -- pnpm dlx some-tool
```

## Key rules

1. **Always use pnpm** — never use `npm` or `yarn` commands.
2. **Use `pnpm dlx`** instead of `npx` for one-off package execution.
3. **Commit `pnpm-lock.yaml`** — this is the lockfile; never commit `package-lock.json` or `yarn.lock`.
4. **Run through `mise exec --`** as with all commands in this project.
