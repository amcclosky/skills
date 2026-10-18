# Credentials (agent vault)

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
- Known gap: multi-step logins are not supported by `auth login`; it fills only the vault username and stalls on the next page. For Google, follow [sign-in-to-google.md](playbooks/sign-in-to-google.md), which reads the vault inline step by step.

If an item is not found, ask the user to add it. Do not search other vaults or the user's personal browser profiles.

### Logging in on mobile

Neither tool has a credential provider, so read the **Agent Browser** vault item inline and pass it straight to `fill`; never print it. The vault token is in the Keychain:

```bash
opr() { OP_SERVICE_ACCOUNT_TOKEN="$(security find-generic-password -s agent-browser:op-token -w)" mise exec -- op read "op://Agent Browser/<item-id>/$1"; }
otp() { OP_SERVICE_ACCOUNT_TOKEN="$(security find-generic-password -s agent-browser:op-token -w)" mise exec -- op read "op://Agent Browser/<item-id>/one-time password?attribute=otp"; }
wdio session fill <email ref> "anthony@example.com"
wdio session fill <password ref> "$(opr password)" >/dev/null 2>&1   # wdio echoes fill values; discard
wdio session fill <code ref> "$(otp)" >/dev/null 2>&1
```

- Find the item ID with `op item list --vault "Agent Browser"`; `op://` references cannot contain parentheses, so use the ID, not the title.
- Use the account's full address (e.g. `anthony@almostproductive.com`); the vault item's username field holds only `anthony`, which Google rejects.
- The verified Google flow (including the passkey/Bluetooth sheet) is in [sign-in-to-google.md](playbooks/sign-in-to-google.md).
- If a sheet blocks something the DOM cannot reach, dismiss it with `agent-device press <x> <y>` (back chevron, then the QR sheet's X). Decline iOS's "Save Password?" prompt with "Not Now".
- Secrets stay out of logs: after a login, grep `.wdio` for the password value (without printing it) and delete the directory. When checking, use `grep -lF` (fixed string) and never pipe the secret through `sed`/`echo`: a password containing `*` or `.` is a regex, so a `sed` mask can fail and print it. `agent-device` does not log typed text for secure fields, but plain fields such as the email are logged by the XCTest runner.

## User-side vault management

The user stores secrets; prompts keep passwords out of shell history and arguments:

```bash
local-browse vault add <item> <username> [login-url]   # prompts for the password
local-browse vault remove <item>
local-browse vault op-token                            # prompts for the 1Password service-account token
```

One-time 1Password setup: create a vault named **Agent Browser**, create a service account with access to only that vault (read is enough; write lets agents create items with `op`), then run `local-browse vault op-token`.
