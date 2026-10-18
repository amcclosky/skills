# Sign in or sign up with Google on another site

Use a site's "Sign in with Google" / "Sign Up with Google" button when the browser already has a Google session. No password or code is needed.

Last verified: 2026-10-18 on `staging-mobile.backflip.com` (sign up) with `wdio session` on the iOS Simulator, signed in to `anthony@almostproductive.com`. The Google pages are the same on desktop.

## Before you start

- Be signed in to Google first: [sign-in-to-google.md](sign-in-to-google.md).
- Check the account the site will get: the Google chooser lists the signed-in accounts, so pick the one the user named.
- **Ask the user before creating an account or accepting terms** unless they already told you to (they did for the Backflip run). Both are commitments in their name.

## Steps

| # | Page | Do |
|---|---|---|
| 1 | The site's sign-up or login page | Click "Sign Up with Google" (it may be a `generic` element, not a `button`; use the ref from `snapshot -i`). |
| 2 | `accounts.google.com/v3/signin/accountchooser` ("Choose an account to continue to <site>") | Click the account link (`<name> <email>`). |
| 3 | `accounts.google.com/signin/oauth/id` ("Sign in to <site>", "Google will allow <site> to access this info about you") | Read what is shared (here: name, profile picture, email), then click "Continue". |
| 4 | Back on the site (here `/confirm`, a form pre-filled with first and last name) | Fill any missing fields, tick the terms checkbox, click "Sign Up". |
| 5 | The site's home page | Done. Optional onboarding (for example "How did you hear about us?") can appear; skip it unless asked. |

Wait about 4 to 6 seconds after each click (`wait 4000`) and check `get url` before the next step.

## Gotchas

- The OAuth consent step lists the scopes. If it asks for more than basic profile and email, stop and tell the user.
- Optional fields such as a phone number can be left blank; do not invent values.
- The site may show a cookie banner on arrival: clear it first (see Cookie banners in SKILL.md).
