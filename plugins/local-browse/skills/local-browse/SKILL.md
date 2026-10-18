---
name: local-browse
description: Run and use the dedicated persistent Helium browser (Chromium), drive Mobile Safari in a persistent iOS Simulator with wdio session (pages) and agent-device (native iOS UI), and use the agent-only credential vault for agent-browser. Use when a browser task needs a logged-in session, a real headed browser, real mobile Safari or an iPhone view of a page, or credentials for a site; or when the user asks to do or check something "on mobile", "in mobile", or on "mobile web" (use the iOS Simulator workflow, not agent-browser); or when the user mentions local-browse, agent-device, the agent vault, or the "Agent Browser" 1Password vault.
---

# local-browse

A dedicated, headed [Helium](https://github.com/imputnet/helium) (Chromium) browser, using Helium's own default profile (`~/Library/Application Support/net.imput.helium`, separate from Google Chrome's), exposing CDP on `127.0.0.1:9222`. `~/.agent-browser/config.json` points agent-browser at it by default, so plain `agent-browser <cmd>` drives this Helium.

**Mobile requests go to the iOS Simulator.** When the user asks to do, test, view, or screenshot something "on mobile", "in mobile", on "mobile web", on an iPhone, or in Mobile Safari, use `wdio session` for the page and `agent-device` for native iOS UI, as described in [Mobile Safari](#mobile-safari-ios-simulator). Do not use `agent-browser`, its `--device` emulation, or `agent-browser -p ios` for these, even if the agent-browser skill is also loaded.

This skill covers the Helium instance, Mobile Safari in the iOS Simulator, desktop Safari through the bundled safari-mcp server, and credentials. For the browsing commands themselves (navigate, snapshot, click, fill, screenshots), use the `agent-browser:agent-browser` skill if it is available.

## Playbooks

Saved, verified workflows live in [references/playbooks/](references/playbooks/). **Read the matching playbook before starting a task; do not rediscover it.**

- [sign-in-to-google.md](references/playbooks/sign-in-to-google.md): log in to a Google account with the vault, desktop (Helium) or mobile (simulator).
- [sign-in-with-google-oauth.md](references/playbooks/sign-in-with-google-oauth.md): "Sign in/up with Google" on another site once Google is signed in.
- [open-site-on-mobile.md](references/playbooks/open-site-on-mobile.md): open a URL in Mobile Safari, clear banners, screenshot or record, clean up.

When you work out a valuable workflow that is not listed (a login flow, a multi-step task you may repeat), save it as `references/playbooks/<verb-the-thing>.md` and add it to this list. Each playbook has: what it does, a `Last verified:` date and the tools and versions used, prerequisites, a numbered steps table (page to expect, then what to do), how to confirm it worked, and gotchas. Record what you actually ran and saw, never guesses. Never put secrets in a playbook: describe where to read them (`opr`/`otp`), not their values. If a playbook is stale, fix it as part of the task.

## Before browsing

```bash
local-browse status   # exit 1 if not running
local-browse start    # no-op if already running; add --headless only if the user asks
```

If `local-browse` is not on PATH or agent-browser cannot connect, run `local-browse setup` once (links the scripts into `~/.local/bin`, registers the credential plugins, sets the default CDP target).

`local-browse stop` quits it cleanly over CDP so cookies are flushed to disk. Logins and cookies persist in the profile across restarts. Never `kill`/`pkill` Helium yourself: that marks the profile as crashed and loses recent logins (a Google login was lost this way).

- Helium allows one instance per profile and is also the user's own Helium app. If it is already open without the debugging port, `local-browse start` refuses with a message; ask the user to quit it rather than quitting it yourself, unless it is clearly idle.
- Overrides: `LOCAL_BROWSE_APP` (default `Helium`; another Chromium browser such as Google Chrome needs `LOCAL_BROWSE_PROFILE` too, because Chrome ignores the debugging port on its default profile), `LOCAL_BROWSE_PROFILE` (a separate user-data-dir, off by default), `LOCAL_BROWSE_PORT`.

## Cookie banners

Always clear cookie and consent banners before taking any screenshot, on every browser here. They cover the bottom third of a phone viewport and darken the page.

- After each navigation to a new site, look for the banner (`snapshot -i`, or `find "cookie"`) and click its dismiss button (`OK`, `Accept`, `Reject`, or `Close`, whichever the banner offers; on mlb.com `OK` cleared it). Do not open "Cookie Settings" or preference centers.
- Take the screenshot after the banner is gone, and look at it to confirm. If it came back (some sites re-show it after a reload or on a new origin), dismiss it again.
- Reading page text does not need this, but a banner can still intercept clicks, so clear it first if a click does nothing.

## Mobile Safari (iOS Simulator)

Use this for any request to do something "on mobile", "in mobile", or on "mobile web", and for real Mobile Safari (mobile layout, touch, iOS-only behavior). Two tools, split by what they can see:

- **`wdio session`** (WebdriverIO, over Appium + XCUITest) drives the **page**: DOM snapshots with refs, click, fill, `wait`, JS, cookies, screenshots, a real iPhone user agent. One session stays alive between shell commands.
- **`agent-device`** drives **native iOS UI** that has no DOM: system sheets (passkey, Bluetooth, QR, "Save Password?"), permission prompts, the keyboard, the Safari toolbar. It taps by accessibility ref or coordinates.

Do not use `agent-browser` here: its iOS provider ignores `--device`, starts a fresh Safari session on every command, and falls back to headless Chrome for commands without `-p ios`.

### Setup (once)

```bash
mise use -g npm:appium@3.8.0 && mise exec -- appium driver install xcuitest   # Appium + XCUITest driver
command -v pitchfork >/dev/null || mise use -g pitchfork                      # background daemons (Appium); skip if already on PATH
mise use -g npm:agent-device@latest                                          # native-UI fallback (needs Node 22.12+)
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer              # with only the Command Line Tools selected, simulators are not found
```

`wdio` itself needs no install: run it as `pnpm dlx @wdio/cli@latest session ...` (this project uses pnpm), through `mise exec --`. Boot the simulator with `agent-device open https://example.com --platform ios --device "iPhone 17"` (first run ~30s; it stays booted after `agent-device close`), and get its UDID from `agent-device devices` or `xcrun simctl list devices booted`.

### Page work: wdio session

```bash
curl -fs http://127.0.0.1:4723/status >/dev/null || \
  pitchfork run appium --http http://127.0.0.1:4723/status -- appium --port 4723 --log-level warn   # only if Appium is not already up; returns once /status answers
wdio session open ios --browser safari --udid <UDID> --appium-url http://127.0.0.1:4723/ --no-reset --idle-timeout 0 https://example.com
wdio session snapshot -i                   # interactive elements with refs
wdio session click e3 && wdio session wait 3000
wdio session find "Sign in"                # matching part of the page, with refs
wdio session fill e5 "text"
wdio session screenshot --path ./page.png  # 3x pixels: 1206x2622 on an iPhone 17
wdio session exec -e 'console.log(await browser.execute(() => navigator.userAgent))'
wdio session close
pitchfork stop appium                        # when done
```

(`wdio` above stands for `mise exec -- pnpm dlx @wdio/cli@latest`; run `appium` and `pitchfork` through `mise exec --` too.) Run `wdio session --help` and the `wdio-session` skill text it ships for the full command list.

- Pass `--udid` so Appium uses the booted simulator instead of picking or booting another, `--no-reset` so Safari keeps cookies and logins, and `--idle-timeout 0` so the session is not shut down while you are away. Start Appium yourself under `pitchfork` (so it is tracked, not a stray `&` job) and pass `--appium-url`; the session then reuses the one Appium server. The `curl` guard skips the start when an Appium is already answering, including one started outside pitchfork (`pitchfork status appium` exits 0 even when stopped, so don't use its exit code). Check it with `pitchfork list` / `pitchfork logs appium`, restart with `pitchfork restart appium`. Stopping Appium can leave `WebDriverAgentRunner` processes behind: check `pgrep -fl WebDriverAgent` and kill them.
- `exec` runs in Node: page code goes in `await browser.execute(() => ...)`, otherwise `navigator`/`document` are undefined. `screenshot` needs `--path`.
- Always start Appium with `--log-level warn`. At the default level Appium logs every typed value (`POST .../value {"text":"..."}`), so a password filled through `wdio` lands in plaintext in the Appium log, and pitchfork keeps that log on disk (`~/.local/state/pitchfork/logs`). With `warn` a typed test string appeared in no log.
- Every action prints the WebdriverIO code it ran, **including the value of `fill`**. For secrets, discard the output: `wdio session fill e5 "$(opr password)" >/dev/null 2>&1`.
- `wdio` writes artifacts to `.wdio/session/<name>` in the current directory. Run it from a scratch directory, not the repo, and delete it afterwards.
- A WebDriver click works while a native sheet covers the page, because it targets the DOM element rather than a screen point.
- Logins persist: the Google login survived a simulator restart.

### Native UI: agent-device

```bash
agent-device snapshot -i                    # accessibility tree with @e refs
agent-device find "Not Now" press           # or: press @e11~s678127, copying the ref exactly as the last snapshot printed it
agent-device press <x> <y>                  # coordinates, for sheets with no refs (device points, 402x874 on an iPhone 17)
agent-device screenshot ./screen.png
```

- Use it for system UI that `wdio session snapshot` cannot see, and for `press <x> <y>` on sheets that have no refs. To use it for a page too, `agent-device open <url> --platform ios --device "<name>"` first.
- Always pass `--platform ios --device "<name>"` (or `--udid`) on `open`; with several simulators it fails with `AMBIGUOUS_MATCH`.
- Refs are only valid for the latest snapshot. If `press` says the ref needs a complete snapshot, retry with the `@eN~sNNN` form it suggests.
- The `Page:` line in `snapshot` output keeps showing the URL passed to `open` after you navigate. Use a screenshot to check where you are.
- With the keyboard open, the first tap on a button often only dismisses the keyboard. Tap again and check with a screenshot.
- `agent-device doctor` checks the setup.

## Desktop Safari (safari-mcp)

The plugin ships the Safari MCP server (`/usr/bin/safaridriver --mcp`, Safari 27+) as `safari-mcp`. It drives **desktop** Safari on this Mac: open and switch tabs, `navigate_to_url`, `get_page_content`, `screenshot`, `page_interactions` (click, type, scroll, hover, keys), `evaluate_javascript` (takes `expression`, which must `return` its value), `list_network_requests`, `browser_console_messages`, `browser_dialogs`, `set_emulated_media`, and `set_viewport_size`.

- Use it for WebKit-specific checks on desktop: console errors, network requests, JS evaluation, narrow-width layouts.
- It is not Mobile Safari. After `set_viewport_size` to 402 wide the page still reports a Macintosh user agent, `maxTouchPoints` 0, and no touch events, and the height is capped by the window (770 here). For "on mobile" requests use [Mobile Safari](#mobile-safari-ios-simulator) above.
- One-time setup: in Safari, Settings → Developer → check "Allow remote automation and external agents" (enable the Develop menu first). Navigate first: asking for tabs before a window exists can return an error.
- It opens a Safari window that shows a banner saying an agent controls it, and does not use the persistent Helium profile or the agent vault.

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
- Known gap: multi-step logins are not supported by `auth login`; it fills only the vault username and stalls on the next page. For Google, follow [sign-in-to-google.md](references/playbooks/sign-in-to-google.md), which reads the vault inline step by step.

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
- The verified Google flow (including the passkey/Bluetooth sheet) is in [sign-in-to-google.md](references/playbooks/sign-in-to-google.md).
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
