# Open a site on mobile and capture it

Open a URL in real Mobile Safari (iOS Simulator), clear banners, screenshot or record, and clean up.

Last verified: 2026-10-18 with `wdio session` 10.0.2, Appium 3.8.0 (XCUITest), iPhone 17 simulator "Agent Browser".

## Steps

1. **Simulator booted.** `xcrun simctl list devices booted` should list the target. If not, boot it (`agent-device open https://example.com --platform ios --device "<name>"`, first run about 30 s) and note its UDID.
2. **Appium up**, with the log level that keeps typed text out of logs (run through `mise exec --`):
   ```bash
   curl -fs http://127.0.0.1:4723/status >/dev/null || \
     pitchfork run appium --http http://127.0.0.1:4723/status -- appium --port 4723 --log-level warn
   ```
3. **Open the session** (run `wdio` from a scratch directory, not the repo, because it writes `.wdio/` there):
   ```bash
   wdio session open ios --browser safari --udid <UDID> --appium-url http://127.0.0.1:4723/ --no-reset --idle-timeout 0 <url>
   ```
4. **Go to the page.** The URL on `open` loads it (worked for `example.com` and `myaccount.google.com`); later pages use `wdio session navigate <url>`. Both print the final URL and title, so redirects are visible (`mobile.backflip.com` redirected to `/register`). A session that ends on `data:text/html,` did not load the page; see below.
5. **Clear banners** (cookie, "open in app"): see Cookie banners in SKILL.md. `snapshot -i`, then click the dismiss button.
6. **Capture.** Screenshot: `wdio session screenshot --path ./page.png` (1206x2622 on an iPhone 17). Video: `wdio session record start`, do the steps, `wdio session record stop --path ./flow.mp4` (stitched from 5 fps screenshots; for smooth video use `xcrun simctl io <UDID> recordVideo out.mov`). Look at the screenshot before reporting.
7. **Read content** without a screenshot: `wdio session exec` with `await browser.execute(() => document.body.innerText)`.

## If the page does not load

- Safari says "server can't be found": check DNS from the Mac (`dig +short <host>`). The simulator uses the Mac's network, so a name that does not resolve there will not resolve in the simulator. Ask for the right address.
- `open`/`navigate` reports that the page "did not open" and is still on `data:text/html,`: same cause (it happened for the unresolvable `baseball.dev`), or bot protection. `get title` shows Safari's error title ("Can't Open Page").

## Clean up

```bash
wdio session close
pitchfork stop appium
pgrep -fl WebDriverAgent    # kill any leftover runner
rm -rf .wdio                # in whichever directory wdio ran
```

The simulator stays booted on purpose so logins persist. Shut it down only if asked (`xcrun simctl shutdown <UDID>`).
