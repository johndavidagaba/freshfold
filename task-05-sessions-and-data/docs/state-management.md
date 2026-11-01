# State management: where each piece of state lives

FreshFold has no global store: no Redux, no Zustand, no React Context for the user. Each piece of state lives in the one place that owns it.

| State | Where it lives | Why there |
| --- | --- | --- |
| Who is logged in | **Server:** the `Session` table, found through the `ff_session` cookie | It's the only place that can't be faked. The browser holds a key, not the truth. |
| The user's name and email on the dashboard | **Server:** read during the page render (`getCurrentUser`) | Fresh on every load. If an admin bans you, the next page load knows. |
| Verified or not | **Database:** `emailVerifiedAt` | The banner reads it on the server. A client flag could be flipped in DevTools. |
| Which form is showing (signup, login or reset) | **URL:** `?form=` | Shareable and refresh-safe. Changing it doesn't trigger a server request (Task 3). |
| Typed form values and field errors | **React `useState`** in the form component | They belong to one form for a few seconds. Nobody else needs them. |
| "Logging out…" and the logout error | **React `useState`** in `logout-button.tsx` | Local to one button. |
| Change-password and delete-account steps | **React `useState`** in their components | Local. The confirm step is a state, not `window.confirm`. |
| Rate-limit counters | **Database:** `RateLimit` | Has to survive restarts and be shared across requests. |

## The rule I'm following

**If it decides what someone is allowed to do, it lives on the server.** If it only decides what one component shows for a moment, it lives in that component. The URL holds anything worth sharing or refreshing.

## Where it got tested

- **Two users in one browser (06).** One cookie means one login per browser. Every tab shows the same person because they all ask the server.
- **Logout (09–10).** The bug was exactly state in the wrong place. The screen decided "logged out" on its own, before the server agreed.

## What I'd add if it grew

When the dashboard gets bookings, a data-fetching library (or plain server components) beats a global store. The server is still the source of truth. The client would only cache it.
