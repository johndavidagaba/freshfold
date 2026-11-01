# Task 5: Sessions, gating and data

**FreshFold Laundry.** After Task 4 the server checked passwords, but nobody stayed logged in. This task added sessions, logout, gating for unverified customers, an admin area, password change, account deletion with a grace period, and the documents that say what we keep and why.

## What I built

- **Sessions:**
  - a random 256-bit token in an `ff_session` cookie (HttpOnly, SameSite=Lax, Secure in production, 7 days);
  - only its SHA-256 hash is stored;
  - a fresh token on every login (`docs/sessions.md`, evidence 01, 02, 07).
- **Generic login errors:** a wrong password and an unknown email get the same 401 and message (evidence 05).
- **Logout bug found and fixed:**
  - the button didn't wait for the server, and the server log showed the page leaving before logout arrived (evidence 09e);
  - fixed to await, show "Logging out…" and report failure (evidence 10, 10b, 10c);
  - the session row is really deleted (evidence 08).
- **Two users in one browser:** one cookie means one login, so Tunde's signup replaced Kemi in every tab (evidence 06).
- **Soft gating:** unverified customers see a banner, not a wall (`docs/gating.md`, evidence 03).
- **Admin area:** an ordinary user is refused (evidence 16).
- **Change password:** ends every other session (evidence 11).
- **Delete account:**
  - soft delete: logged out everywhere at once;
  - anonymised after 30 days by `scripts/purge-deleted.mjs`, which is safe to run twice (evidence 12–14).
- **Migrations by hand:**
  - `task5_user_role_and_deletion`;
  - `task5_phone_optional`, so an anonymised user's phone can be emptied. The agent changed the schema but correctly didn't migrate.
- **Published article:** [My logout button lied to me, and the server log caught it](https://www.linkedin.com/pulse/my-logout-button-lied-me-server-log-caught-david-john-p8i0e) on LinkedIn (evidence 17).

## What I decided

- **Soft gating now, hard gating** on booking, payment and email change once those exist, enforced in the route, not the page.
- **A 30-day deletion grace period,** with payment records kept and anonymised rather than deleted (`docs/retention-matrix.md`).
- **No global client store.** Anything that decides permissions lives on the server (`docs/state-management.md`).

## What I got wrong

- **The logout bug.** I asked the agent to build it broken on purpose, then couldn't make Chrome's new Request conditions panel block it. I proved it from the server log instead.
- **Orphan sessions.** A likely double-click left two live sessions for one user.
- **Not finished:**
  - hard gating branch (evidence 04);
  - purge job scheduling;
  - the laundry-owner interview (questions ready, `docs/interview-with-owner.md`);
  - open defects listed in `docs/defects.md`.

## Files

- **docs/:**
  - sessions, gating, retention-matrix, state-management, privacy (draft notice), broken-promise-draft, handbook (7 sections), what-i-do-not-know (10 items), defects, interview-with-owner;
  - article-draft;
  - server-prompt-2.
- **evidence/:** numbered as in the brief, plus extras named by what they show.
