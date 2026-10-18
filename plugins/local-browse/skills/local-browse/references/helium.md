# Helium (desktop browser)

A dedicated, headed [Helium](https://github.com/imputnet/helium) (Chromium) browser, using Helium's own default profile (`~/Library/Application Support/net.imput.helium`, separate from Google Chrome's), exposing CDP on `127.0.0.1:9222`. `~/.agent-browser/config.json` points agent-browser at it by default, so plain `agent-browser <cmd>` drives this Helium.

## Before browsing

```bash
local-browse status   # exit 1 if not running
local-browse start    # no-op if already running; add --headless only if the user asks
```

If `local-browse` is not on PATH or agent-browser cannot connect, run `local-browse setup` once (links the scripts into `~/.local/bin`, registers the credential plugins, sets the default CDP target).

`local-browse stop` quits it cleanly over CDP so cookies are flushed to disk. Logins and cookies persist in the profile across restarts. Never `kill`/`pkill` Helium yourself: that marks the profile as crashed and loses recent logins (a Google login was lost this way).

- Helium allows one instance per profile and is also the user's own Helium app. If it is already open without the debugging port, `local-browse start` refuses with a message; ask the user to quit it rather than quitting it yourself, unless it is clearly idle.
- Overrides: `LOCAL_BROWSE_APP` (default `Helium`; another Chromium browser such as Google Chrome needs `LOCAL_BROWSE_PROFILE` too, because Chrome ignores the debugging port on its default profile), `LOCAL_BROWSE_PROFILE` (a separate user-data-dir, off by default), `LOCAL_BROWSE_PORT`.
