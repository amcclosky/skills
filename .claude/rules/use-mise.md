# Mise (Tool & Environment Manager)

This project uses [mise](https://mise.jdx.dev) to manage external/third-party CLI tools, environment variables, and secrets. Configuration lives in `mise.toml` at the project root.

## Running commands

Always use `mise exec` (or `mise x`) to run **all** commands — not just mise-managed tools. This ensures the full mise environment (tools, env vars, and decrypted secrets) is loaded for every invocation:

```bash
mise exec -- vp run dev
mise exec -- age --version
mise exec -- curl https://api.example.com
```

Do NOT run commands directly without `mise exec` — they will be missing environment variables and secrets that the project depends on.

## Installing new tools

When introducing a new external/third-party CLI tool, add it via mise — do not install it globally or via Homebrew/apt:

```bash
# Add to the project's mise.toml
mise use <tool>@<version>        # core tools (node, python, etc.)
mise use npm:<pkg>@<version>     # npm-distributed CLIs
mise use cargo:<pkg>@<version>   # cargo-distributed CLIs
mise use aqua:<owner>/<repo>     # aqua registry tools
mise use ubi:<owner>/<repo>      # GitHub release binaries
```

After adding, commit the updated `mise.toml` so all contributors get the tool.

## Environment variables

Mise manages env vars for this project. Non-secret env vars are set directly in `mise.toml` under `[env]`:

```bash
mise set MY_VAR=value            # add/update a var
mise exec -- printenv MY_VAR     # verify it's set
```

## Secrets

Secrets are managed via fnox — see the [fnox-secrets](fnox-secrets.md) rules file for the full workflow.

## Key rules

1. **`mise exec --`** before **all** command invocations (not just mise-managed tools) to ensure env/secrets are loaded.
2. **`mise use`** to add new tools — never install externally.
3. **No plaintext secrets** — use fnox (see `fnox-secrets.md`).
4. **Commit `mise.toml`** after tool or env var changes.
