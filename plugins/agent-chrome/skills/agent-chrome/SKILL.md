---
name: agent-chrome
description: Run and use the dedicated persistent Chrome and the agent-only credential vault for agent-browser. Use when a browser task needs a logged-in session, a real headed Chrome, or credentials for a site; or when the user mentions agent-chrome, the agent vault, or the "Agent Browser" 1Password vault.
---

# agent-chrome

A dedicated, headed Chrome with its own persistent profile (`~/.agent-browser/chrome-profile`), exposing CDP on `127.0.0.1:9222`. `~/.agent-browser/config.json` points agent-browser at it by default, so plain `agent-browser <cmd>` drives this Chrome.

This skill only covers the Chrome instance and its credentials. For the browsing commands themselves (navigate, snapshot, click, fill, screenshots), use the `agent-browser:agent-browser` skill if it is available.

## Before browsing

```bash
agent-chrome status   # exit 1 if not running
agent-chrome start    # no-op if already running; add --headless only if the user asks
```

If `agent-chrome` is not on PATH or agent-browser cannot connect, run `agent-chrome setup` once (links the scripts into `~/.local/bin`, registers the credential plugins, sets the default CDP target).

`agent-chrome stop` quits it. Logins and cookies persist in the profile across restarts.

## Logging in

Use the agent vault; never ask the user for a password and never print or echo credentials.

```bash
agent-browser auth login <profile> --credential-provider keychain --item <item>
agent-browser auth login <profile> --credential-provider 1password --item <item>
```

- `keychain` reads the macOS Keychain generic password with service `agent-browser:<item>`; the account is the username and the comment is the login URL.
- `1password` reads `<item>` from the **Agent Browser** vault only, using a service-account token kept in the Keychain. If the token is missing it fails closed rather than falling back to the user's personal 1Password session.
- Add `--url <login-url>` if the item has no URL, or `--no-navigate` to log in on the page that is already open.
- Credentials are resolved just-in-time and passed straight into the page; they are not saved by agent-browser.
- Known gap: flows that ask for a TOTP code on a second step after the password are not supported by credential providers yet. Ask the user to complete that step.

If an item is not found, ask the user to add it. Do not search other vaults or the user's personal Chrome.

## User-side vault management

The user stores secrets; prompts keep passwords out of shell history and arguments:

```bash
agent-chrome vault add <item> <username> [login-url]   # prompts for the password
agent-chrome vault remove <item>
agent-chrome vault op-token                            # prompts for the 1Password service-account token
```

One-time 1Password setup: create a vault named **Agent Browser**, create a service account with access to only that vault (read is enough; write lets agents create items with `op`), then run `agent-chrome vault op-token`.
