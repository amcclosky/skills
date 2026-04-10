# Secret Management with fnox

This project uses [fnox](https://fnox.jdx.dev) for secret management. Secrets are age-encrypted and stored in `fnox.toml`, which is safe to commit to git. Decryption happens automatically via the mise fnox-env plugin at runtime.

## How it works

- `fnox.toml` holds encrypted secrets and provider config (age encryption with a project-specific recipient key).
- The `mise-env-fnox` plugin in `mise.toml` (`_.fnox-env = { tools = true }`) auto-decrypts secrets and injects them as environment variables whenever `mise exec` runs.
- Developers need the corresponding age private key (or SSH key) to decrypt.

## Adding a new secret

```bash
mise exec -- fnox set SECRET_NAME "value" --provider age
```

Or use `--prompt` to avoid leaking the value into shell history:

```bash
mise exec -- fnox set --prompt SECRET_NAME --provider age
```

This encrypts the value and writes it to `fnox.toml`. Commit `fnox.toml` afterward.

## Reading / verifying secrets

```bash
# List all secrets (names only)
mise exec -- fnox list

# Show a decrypted value
mise exec -- fnox get SECRET_NAME
```

## Key rules

1. **Never put plaintext secrets** in `mise.toml`, `.env` files, source code, or any other committed file.
2. **Always use fnox** to manage secrets — `fnox set` to add, `fnox get` to read.
3. **Always run fnox through `mise exec --`** so that the fnox binary and age keys are available.
4. **Commit `fnox.toml`** after adding or rotating secrets — the encrypted values are safe to store in git.
5. **Never log, print, or echo** decrypted secret values in scripts, CI output, or tool responses.
6. **Do not modify `fnox.toml` by hand** — always use `fnox set` to ensure proper encryption.
