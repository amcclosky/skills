# wdio session (Mobile Safari page work)

Drives the **page** in Mobile Safari in the iOS Simulator. Set up the simulator and start Appium first: [ios-simulator.md](ios-simulator.md).

```bash
wdio session open ios --browser safari --udid <UDID> --appium-url http://127.0.0.1:4723/ --no-reset --idle-timeout 0 https://example.com
wdio session snapshot -i                   # interactive elements with refs
wdio session click e3 && wdio session wait 3000
wdio session find "Sign in"                # matching part of the page, with refs
wdio session fill e5 "text"
wdio session screenshot --path ./page.png  # 3x pixels: 1206x2622 on an iPhone 17
wdio session exec -e 'console.log(await browser.execute(() => navigator.userAgent))'
wdio session close
```

(`wdio` above stands for `mise exec -- pnpm dlx @wdio/cli@latest`; run `appium` and `pitchfork` through `mise exec --` too.) Run `wdio session --help` and the `wdio-session` skill text it ships for the full command list.

- Pass `--udid` so Appium uses the booted simulator instead of picking or booting another, `--no-reset` so Safari keeps cookies and logins, and `--idle-timeout 0` so the session is not shut down while you are away.
- `exec` runs in Node: page code goes in `await browser.execute(() => ...)`, otherwise `navigator`/`document` are undefined. `screenshot` needs `--path`.
- Every action prints the WebdriverIO code it ran, **including the value of `fill`**. For secrets, discard the output: `wdio session fill e5 "$(opr password)" >/dev/null 2>&1`.
- `wdio` writes artifacts to `.wdio/session/<name>` in the current directory. Run it from a scratch directory, not the repo, and delete it afterwards.
- A WebDriver click works while a native sheet covers the page, because it targets the DOM element rather than a screen point.
- Logins persist: the Google login survived a simulator restart.
- Appium must run with `--log-level warn`, or it logs every value you `fill` (see [ios-simulator.md](ios-simulator.md#appium)).
