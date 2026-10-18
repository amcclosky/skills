# Setup: installing the tools

Everything this skill uses, how to install it, and how to check it. Install only what the task needs:

| You want | Install |
|---|---|
| The persistent desktop browser | [mise](#core), [agent-browser CLI](#helium-and-agent-browser), [Helium](#helium-and-agent-browser) |
| Logins from the vault | [1Password CLI](#credentials) and the service-account token |
| Mobile Safari | [Xcode and a simulator](#mobile-safari), [Appium](#mobile-safari), [pitchfork](#mobile-safari), [agent-device](#mobile-safari) |
| Desktop Safari checks | [Safari settings](#desktop-safari-safari-mcp) |

Rules for this repo's tooling: install command-line tools with `mise use -g <tool>` (not Homebrew or a global npm install), run packages with `pnpm` (`pnpm dlx`, never `npx`), and prefix commands with `mise exec --`. Check first, then install: `command -v <tool> >/dev/null || mise use -g <tool>`.

Last verified: 2026-10-18 on Darwin 27.0.0 with Xcode 27.1.

## Core

- **mise**: install from <https://mise.jdx.dev>, then make sure `~/.local/bin` is on `PATH` (the `local-browse` command is linked there).
- **Node 22.12 or newer** (agent-device needs it): `mise use -g node@lts`. Tested with Node 24.
- **pnpm**: `mise use -g pnpm`. Used to run WebdriverIO without installing it (`pnpm dlx @wdio/cli@latest session ...`).

## Helium and agent-browser

```bash
command -v agent-browser >/dev/null || mise use -g agent-browser   # aqua:vercel-labs/agent-browser; tested 0.39.1
```

**Helium** is the browser the agent drives. Install the imput Helium (`Helium.app`, bundle id `net.imput.helium`) from <https://helium.computer>, or with Homebrew's `helium-browser` cask (`brew info --cask helium-browser` lists it as a Chromium-based `Helium.app`; I have not installed it from the cask). Then check you got the right app:

```bash
defaults read /Applications/Helium.app/Contents/Info CFBundleIdentifier   # net.imput.helium
```

Do **not** use `brew install --cask helium`: that is a different, unrelated app and is disabled in Homebrew (fails the macOS Gatekeeper check).

You do not need `agent-browser install`. It downloads a separate Chrome for agent-browser to launch itself; here agent-browser attaches to Helium over CDP on port 9222.

Then, from the plugin, run once:

```bash
local-browse setup
```

It links `local-browse` and `agent-browser-plugin-vault` into `~/.local/bin`, registers the `keychain` and `1password` credential providers in `~/.agent-browser/config.json`, and sets `"cdp": "9222"` there. Check:

```bash
local-browse start && local-browse status        # running on port 9222 (profile: Helium default)
agent-browser open https://example.com
```

If Helium is already open without the debugging port, `local-browse start` refuses; quit Helium and run it again. See [helium.md](helium.md).

## Credentials

```bash
command -v op >/dev/null || mise use -g op        # 1Password CLI; tested 2.41.0
```

One-time 1Password setup (the user does this; agents never handle the master account):

1. Create a vault named **Agent Browser**.
2. Create a service account with access to only that vault (read is enough; write lets agents create items with `op`).
3. Store the service-account token in the Keychain: `local-browse vault op-token` (prompts; the token never goes in an argument or shell history).

For passwords kept in the Keychain instead: `local-browse vault add <item> <username> [login-url]`. Check the token exists without printing it:

```bash
security find-generic-password -s agent-browser:op-token >/dev/null 2>&1 && echo "op token present"
```

How to read values safely at login time: [credentials.md](credentials.md).

## Mobile Safari

1. **Xcode** (the full app, from the App Store or developer.apple.com, not just the Command Line Tools) with an iOS simulator runtime installed. Select it, or simulators are not found:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   xcrun simctl list devices available      # should list iPhones
   ```
   Xcode 27 has no `Simulator.app` (it ships `DeviceHub.app`, which opened with no windows when I tried it). `xcrun simctl` and the tools below do not need a window.
2. **A dedicated simulator.** The one used here is named "Agent Browser": an iPhone 17 on iOS 27.0 (`com.apple.CoreSimulator.SimDeviceType.iPhone-17`, `com.apple.CoreSimulator.SimRuntime.iOS-27-0`). Create one with `xcrun simctl create "Agent Browser" <device-type-id> <runtime-id>` (ids from `xcrun simctl list devicetypes` and `xcrun simctl list runtimes`), or in Xcode. Note its UDID from `xcrun simctl list devices`.
3. **Appium and the XCUITest driver:**
   ```bash
   mise use -g npm:appium@3.8.0
   mise exec -- appium driver install xcuitest        # tested xcuitest 12.18.1
   ```
   The first session start builds WebDriverAgent with Xcode, which is slow once and cached after.
4. **pitchfork** (runs Appium as a tracked background daemon):
   ```bash
   command -v pitchfork >/dev/null || mise use -g pitchfork   # tested 2.31.0 (a Homebrew install also works)
   ```
5. **agent-device** (native iOS UI such as passkey sheets and the keyboard):
   ```bash
   mise use -g npm:agent-device@latest                       # tested 0.21.28
   agent-device doctor
   ```
   `doctor` warnings about Android (`adb`), HarmonyOS (`hdc`) and Vega are irrelevant here; look for `✓ device` and `✓ ios-runner-cache`.
6. **WebdriverIO**: nothing to install. It runs as `mise exec -- pnpm dlx @wdio/cli@latest session ...`.

Then follow [ios-simulator.md](ios-simulator.md) to boot the simulator and start Appium, and [wdio-session.md](wdio-session.md) to drive a page.

## Desktop Safari (safari-mcp)

The MCP server is `/usr/bin/safaridriver --mcp` (Safari 27 or newer; it ships with macOS and the plugin's `.mcp.json` registers it as `safari-mcp`). One-time: in Safari, enable the Develop menu, then Settings → Developer → check "Allow remote automation and external agents". See [safari-mcp.md](safari-mcp.md).

## Check everything

```bash
for c in mise node pnpm agent-browser op pitchfork appium agent-device local-browse; do
  command -v "$c" >/dev/null && echo "ok       $c" || echo "MISSING  $c"
done
xcode-select -p                                   # /Applications/Xcode.app/Contents/Developer
mise exec -- appium driver list --installed       # xcuitest installed
curl -fsS http://127.0.0.1:9222/json/version >/dev/null && echo "Helium CDP up" || echo "Helium not running (local-browse start)"
```

Only the tools for the features you use need to be `ok`.
