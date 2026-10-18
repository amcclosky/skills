# Sign in to Google

Sign in to a Google account (email, password, one-time code) using the **Agent Browser** vault. Works on desktop (Helium + `agent-browser`) and on mobile (iOS Simulator + `wdio session`).

Last verified: 2026-10-18, desktop in Helium with agent-browser 0.39.1, mobile with `wdio session` (WebdriverIO CLI 10.0.2) on an iPhone 17 simulator.

## Before you start

- The vault item is in the **Agent Browser** vault (find its ID with `op item list --vault "Agent Browser"`; titles with parentheses cannot be used in `op://` references, so use the ID).
- Define the helpers from [Logging in on mobile](../../SKILL.md#logging-in-on-mobile) (`opr`, `otp`). Read values inline; never print them.
- **Use the full email address** (`anthony@almostproductive.com`). The vault item's username field holds only `anthony`, which Google rejects ("Couldn't find this account").
- **Do not use `agent-browser auth login`.** It types the vault username (`anthony`) into the email box and then stalls waiting for a password field, because Google asks for each credential on its own page.
- Discard the output of every `fill` that carries a secret: `>/dev/null 2>&1`. `wdio session fill` echoes the value it typed.

## Steps

Refs change on every page, so look them up from a fresh `snapshot -i` each step. Desktop uses `agent-browser`; mobile uses `wdio session` with the same verbs (`open`/`navigate`, `snapshot -i`, `fill <ref>`, `click <ref>`, `wait`, `get url`).

| # | Page (URL contains) | Do |
|---|---|---|
| 1 | `accounts.google.com/v3/signin/identifier` ("Sign in", textbox "Email or phone") | Fill the full email, click "Next". |
| 1b | `.../accountchooser` (signed-out account listed) | Click the account row instead. |
| 2 | `.../challenge/pwd` (textbox "Enter your password") | Fill `"$(opr password)"` (output discarded), click "Next". |
| 2b | `.../challenge/pk` ("Verifying it's you", passkey) | Click "Try another way", then "Enter your password", then step 2. |
| 3 | `.../challenge/selection` ("2-Step Verification") | Click "Get a verification code from the Google Authenticator app". |
| 4 | `.../challenge/totp` (textbox "Enter code") | Fill `"$(otp)"` (output discarded), click "Next". Leave "Don't ask again on this device" as it is (checked by default). |
| 5 | `.../speedbump/passkeyenrollment` ("Simplify your sign-in") | Click "Not now". Do not create a passkey. |
| 6 | `myaccount.google.com`, title "Google Account" | Done. |

Steps 3 to 5 only appear when Google wants them: a fresh browser profile got the 2-step prompt, and a later login from the same profile skipped it. Check the page after each click instead of assuming the order.

## Confirm it worked

Open `https://myaccount.google.com/`. Signed in: title "Google Account" and a button `Google Account: <name> (<email>)`. Signed out: it redirects to `google.com/account/about`.

## Gotchas

- **Persistence needs a clean browser exit.** On desktop, stop Helium with `local-browse stop` (it quits over CDP). A `kill`/`pkill` left the profile marked "Crashed" and the login was lost. The mobile login persisted across a simulator restart with `--no-reset`.
- **Mobile passkey sheet.** On the iOS Simulator, step 2b shows a native "Bluetooth Off" or QR passkey sheet over the page. A WebDriver `click` on "Try another way" still works under it. If something native must be dismissed, use `agent-device press <x> <y>` (back chevron, then the QR sheet's X). Decline iOS's "Save Password?" prompt with "Not Now".
- **Sign out to retest:** open `https://accounts.google.com/Logout`.
- On mobile the keyboard can swallow the first tap on a button; tap again and check with a screenshot.
- After a login, search `.wdio` and any Appium log for the password with `grep -lF` (never `sed` or `echo` the secret) and delete `.wdio`. Appium must run with `--log-level warn`, or it logs typed text.
