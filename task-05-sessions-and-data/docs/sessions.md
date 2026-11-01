# Sessions

How FreshFold remembers that you're logged in, and what I tested.

## How it works

- **The token.** When you log in or sign up, the server makes a random token with `crypto.randomBytes(32)`, which is 256 bits, and sends it to the browser in a cookie called `ff_session`.
- **The database copy.** The database never stores the token itself. It stores the token's SHA-256 hash in the `Session` table, with the user, the creation time, an expiry 7 days later, the browser's user agent and an empty `revokedAt`.
- **Each request.** On every request the server hashes the cookie it receives and looks the hash up. If the row is missing, expired or revoked, you aren't logged in.
- **Logging out.** Logout deletes the row on the server and clears the cookie. Deleting the row is what matters. A cookie with no matching row is worthless.

Why store a hash and not the token? If someone copies the `Session` table (a leaked backup, say), they get hashes. They can't turn a hash back into a cookie, so they can't use it to log in.

## Cookie flags (evidence 02)

| Flag | Value | What it stops |
| --- | --- | --- |
| HttpOnly | on | Page JavaScript can't read the cookie, so a cross-site scripting bug can't steal it. |
| Secure | production only | The cookie only travels over HTTPS. It's off on `http://localhost`, or local testing wouldn't work. |
| SameSite | Lax | Other websites can't make your browser send it on a background POST, which blocks most cross-site request forgery. Normal links from WhatsApp or email still arrive logged in, which Strict would break. |
| Path | / | Sent to every FreshFold route that needs it. |
| Max-Age | 7 days | The browser forgets it after a week. The server enforces its own expiry too. |

## What I tested

| # | Test | Result |
| --- | --- | --- |
| 01 | Log in twice | Two different tokens: hashes `bee7a3a2…` and `4cae939f…`. A fresh token every time. |
| 05 | Wrong password vs. an email that doesn't exist | The same 401 and the same message, "Email or password is incorrect.", so the login form doesn't reveal who has an account. |
| 07 | Session row after login | One row: hash only, expires 7 days later, `revokedAt` empty. |
| 09 | Logout on a bad connection | **Bug found.** See below. |
| 10 | Logout after the fix | `POST /api/logout 200` arrives before the page moves. |
| 08 | Session table after the fixed logout | 0 rows. The session is really gone. |
| 06 | Two users in one browser | Tunde's signup replaced Kemi's login in every tab. One browser holds one login. |
| 16 | Ordinary user opens /admin | Refused, "403 You don't have access to this page." |
| 11 | Change password in one window, refresh an Incognito window logged in as the same user | Incognito sent to login (`GET /dashboard 307`). The log said **"ended 4 other sessions"**: the Incognito one plus the leftover rows from earlier tests, including the two orphans below. |

## The logout bug (09–10)

The first logout button called `fetch('/api/logout')` without waiting for the answer, then sent you to the login page straight away. The screen said "logged out" whether or not the server agreed.

Proving it took longer than expected:

- Chrome's old "Network request blocking" panel is now **Request conditions**, and it wants full URL patterns. `*api/logout*` was rejected; `http://localhost:3000/api/logout` was accepted.
- Even with the rule on, it said **0 affected**, and the server still received the logout. The browser cancelled the request when the page moved away (status "(unknown)" in the Network tab), so I never got a clean "blocked" result.
- **The server log made the case instead.** In the second run, `GET /account?form=login` arrived *before* `POST /api/logout 200` (evidence 09e). The page left before logout finished. On my Wi-Fi the request won the race anyway. On a weak Lagos mobile connection it can lose, and then the customer sees the login page while their session is still alive.

The fix (agent-written, then checked by reading the file, evidence 10): the button now waits for the server, shows "Logging out…", only leaves the page on a 200, and otherwise stays put with "We couldn't log you out. Check your connection and try again." in an alert. After the fix the log shows logout first and the redirect second (10c), and the Session table is empty (08).

## Something I didn't expect (06a)

- At 18:11:05 and 18:11:10 (UTC), Kemi got **two session rows**, five seconds apart, from the same browser.
- Normally a second login deletes the browser's old row: that's what happened in test 01.
- My best explanation is a double-click on "Log in" while the database was slow. Both requests arrived *before* the browser had any cookie, so neither knew about the other.
- The result is a session that nobody holds a cookie for, still valid for 7 days.
- That isn't a breach, but it's untidy. Changing the password the next day cleaned them up ("ended 4 other sessions"), which shows why a "log out everywhere" control matters.
