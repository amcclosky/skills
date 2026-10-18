---
name: local-browse
description: Run and use the dedicated persistent Helium browser (Chromium), drive Mobile Safari in a persistent iOS Simulator with wdio session (pages) and agent-device (native iOS UI), and use the agent-only credential vault for agent-browser. Use when a browser task needs a logged-in session, a real headed browser, real mobile Safari or an iPhone view of a page, or credentials for a site; or when the user asks to do or check something "on mobile", "in mobile", or on "mobile web" (use the iOS Simulator workflow, not agent-browser); or when the user mentions local-browse, agent-device, the agent vault, or the "Agent Browser" 1Password vault.
---

# local-browse

Persistent local browsers for agents: a headed Helium (Chromium) that agent-browser drives over CDP, desktop Safari, and real Mobile Safari in the iOS Simulator, plus an agent-only credential vault. This file is an index; read the reference for the tool you are about to use.

**Mobile requests go to the iOS Simulator.** When the user asks to do, test, view, or screenshot something "on mobile", "in mobile", on "mobile web", on an iPhone, or in Mobile Safari, use `wdio session` for the page and `agent-device` for native iOS UI ([ios-simulator.md](references/ios-simulator.md)). Do not use `agent-browser`, its `--device` emulation, or `agent-browser -p ios` for these, even if the agent-browser skill is also loaded.

For the browsing commands themselves on desktop (navigate, snapshot, click, fill, screenshots), use the `agent-browser:agent-browser` skill (the `agent-browser` plugin is a declared dependency of this plugin).

## References

Read the one you need before using the tool:

| Reference | Read it when |
|---|---|
| [setup.md](references/setup.md) | A tool or command is missing, on a fresh machine, or you need to know how a tool is installed and checked. |
| [helium.md](references/helium.md) | Starting, stopping or checking the persistent Helium browser (`local-browse start\|stop\|status\|setup`), or when agent-browser cannot connect. |
| [ios-simulator.md](references/ios-simulator.md) | Anything "on mobile": one-time setup, booting the simulator, running Appium under pitchfork. |
| [wdio-session.md](references/wdio-session.md) | Driving a page in Mobile Safari (snapshot, click, fill, screenshot, JS). |
| [agent-device.md](references/agent-device.md) | Native iOS UI with no DOM: system sheets, permission prompts, the keyboard. |
| [safari-mcp.md](references/safari-mcp.md) | WebKit checks in desktop Safari (console, network, JS) through the bundled MCP server. |
| [credentials.md](references/credentials.md) | Logging in to a site, or anything involving the Keychain or the "Agent Browser" 1Password vault. |

## Playbooks

Saved, verified workflows live in [references/playbooks/](references/playbooks/). **Read the matching playbook before starting a task; do not rediscover it.**

- [sign-in-to-google.md](references/playbooks/sign-in-to-google.md): log in to a Google account with the vault, desktop (Helium) or mobile (simulator).
- [sign-in-with-google-oauth.md](references/playbooks/sign-in-with-google-oauth.md): "Sign in/up with Google" on another site once Google is signed in.
- [open-site-on-mobile.md](references/playbooks/open-site-on-mobile.md): open a URL in Mobile Safari, clear banners, screenshot or record, clean up.

When you work out a valuable workflow that is not listed (a login flow, a multi-step task you may repeat), save it as `references/playbooks/<verb-the-thing>.md` and add it to this list. Each playbook has: what it does, a `Last verified:` date and the tools and versions used, prerequisites, a numbered steps table (page to expect, then what to do), how to confirm it worked, and gotchas. Record what you actually ran and saw, never guesses. Never put secrets in a playbook: describe where to read them (`opr`/`otp`), not their values. If a playbook is stale, fix it as part of the task.

## Cookie banners

Always clear cookie and consent banners before taking any screenshot, on every browser here. They cover the bottom third of a phone viewport and darken the page.

- After each navigation to a new site, look for the banner (`snapshot -i`, or `find "cookie"`) and click its dismiss button (`OK`, `Accept`, `Reject`, or `Close`, whichever the banner offers; on mlb.com `OK` cleared it). Do not open "Cookie Settings" or preference centers.
- Take the screenshot after the banner is gone, and look at it to confirm. If it came back (some sites re-show it after a reload or on a new origin), dismiss it again.
- Reading page text does not need this, but a banner can still intercept clicks, so clear it first if a click does nothing.

## Secrets

Never ask the user for a password, and never print, echo or log a credential: read vault values inline into the command that uses them and discard that command's output. Details and the safe-check rules are in [credentials.md](references/credentials.md).
