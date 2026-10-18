# iOS Simulator (Mobile Safari)

Use this for any request to do something "on mobile", "in mobile", or on "mobile web", and for real Mobile Safari (mobile layout, touch, iOS-only behavior). Two tools, split by what they can see:

- **`wdio session`** (WebdriverIO, over Appium + XCUITest) drives the **page**: DOM snapshots with refs, click, fill, `wait`, JS, cookies, screenshots, a real iPhone user agent. One session stays alive between shell commands.
- **`agent-device`** drives **native iOS UI** that has no DOM: system sheets (passkey, Bluetooth, QR, "Save Password?"), permission prompts, the keyboard, the Safari toolbar. It taps by accessibility ref or coordinates.

Do not use `agent-browser` here: its iOS provider ignores `--device`, starts a fresh Safari session on every command, and falls back to headless Chrome for commands without `-p ios`.

Tool references: [wdio-session.md](wdio-session.md) (the page) and [agent-device.md](agent-device.md) (native UI).

## Setup (once)

```bash
mise use -g npm:appium@3.8.0 && mise exec -- appium driver install xcuitest   # Appium + XCUITest driver
command -v pitchfork >/dev/null || mise use -g pitchfork                      # background daemons (Appium); skip if already on PATH
mise use -g npm:agent-device@latest                                          # native-UI fallback (needs Node 22.12+)
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer              # with only the Command Line Tools selected, simulators are not found
```

`wdio` itself needs no install: run it as `pnpm dlx @wdio/cli@latest session ...` (this project uses pnpm), through `mise exec --`. Boot the simulator with `agent-device open https://example.com --platform ios --device "iPhone 17"` (first run ~30s; it stays booted after `agent-device close`), and get its UDID from `agent-device devices` or `xcrun simctl list devices booted`.

## Appium

`wdio session` talks to Appium (XCUITest). Run it as a tracked background daemon under pitchfork, through `mise exec --`:

```bash
curl -fs http://127.0.0.1:4723/status >/dev/null || \
  pitchfork run appium --http http://127.0.0.1:4723/status -- appium --port 4723 --log-level warn   # only if Appium is not already up; returns once /status answers
pitchfork stop appium                        # when done
```

- Start Appium yourself under `pitchfork` (so it is tracked, not a stray `&` job) and pass `--appium-url` to `wdio session open`; the session then reuses the one Appium server. The `curl` guard skips the start when an Appium is already answering, including one started outside pitchfork (`pitchfork status appium` exits 0 even when stopped, so don't use its exit code). Check it with `pitchfork list` / `pitchfork logs appium`, restart with `pitchfork restart appium`. Stopping Appium can leave `WebDriverAgentRunner` processes behind: check `pgrep -fl WebDriverAgent` and kill them.
- Always start Appium with `--log-level warn`. At the default level Appium logs every typed value (`POST .../value {"text":"..."}`), so a password filled through `wdio` lands in plaintext in the Appium log, and pitchfork keeps that log on disk (`~/.local/state/pitchfork/logs`). With `warn` a typed test string appeared in no log.
