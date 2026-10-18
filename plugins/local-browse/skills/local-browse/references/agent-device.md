# agent-device (native iOS UI)

Drives **native iOS UI** that has no DOM: system sheets (passkey, Bluetooth, QR, "Save Password?"), permission prompts, the keyboard, the Safari toolbar. It taps by accessibility ref or coordinates. For the page itself use [wdio-session.md](wdio-session.md); simulator setup is in [ios-simulator.md](ios-simulator.md).

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
