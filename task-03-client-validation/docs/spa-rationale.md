# Single page rationale

## What changed

Before, FreshFold had three account pages:
- `/signup`
- `/login`
- `/reset-password`

Each was a separate route, and moving between them was a full page request: `GET /signup 200 in 1705ms`, `GET /login 200 in 907ms`, `GET /reset-password 200 in 756ms` (evidence 04). The agent listed 5 pages in the app (evidence 01).

Now there is one page, `/account`, showing one of three forms chosen by `?form=signup`, `?form=login` or `?form=reset`, and the app has 3 pages (evidence 02, 03).

## Why instant switching matters

The person switching forms is usually mid-task and slightly stuck: they tried to log in and realised they never signed up, or they forgot their password. That is the worst moment to make them wait. On a low-cost Android phone with a small data bundle, every page load costs time and data, and a slow switch feels like the site broke.

With the forms on one page, the switch is immediate and nothing is downloaded. One page also *could* keep the email they already typed in the login form when they move to "reset password". Mine does not yet: the agent's version clears each form on switch (`defects.md`, 9). That is the next improvement, and it is only possible because the forms share a page.

## What I found on the way

The agent's first version used Next.js `<Link replace>`. It did not do a full browser reload, but the server log showed **a new request on every click**: `GET /account?form=login 200 in 24ms`, `?form=signup 200 in 33ms`, and so on. Changing the query string through the Next.js router re-requests the route from the server.

The agent had reported "switching does not reload the page", which was only half true.

**The fix:** keep the active form in React state, and update the address bar with `window.history.replaceState`. After one F5 load, three switches produced **no new log lines**, while the URL still changed to `?form=signup`, `?form=login` and `?form=reset`. The links still have real `href`s, so right-click "open in new tab" and no-JavaScript visits still work.

**Cost accepted:** `replaceState` does not add history entries, so the browser Back button does not go back to the previous form. It leaves the account page instead. For three small forms I think that is acceptable; for a multi-step checkout it would not be.

## Where separate pages would be the better choice

**Password reset should be a separate page once it is real.** The reset link in the email will carry a one-time token, and the page that receives it does a different job: setting a new password for a specific account.

A separate route for it is better because:
- it can be server-rendered and checked on the server before anything shows;
- it can have its own strict rules, such as no caching, and stopping the token leaking to other sites through the `Referer` header;
- its errors ("this link has expired") belong to that page alone;
- it should never be one click away from a signup form.

More generally, separate pages win when each screen has its own security rules, needs to be found in search on its own, or needs its own analytics and caching. A single page wins when the screens are small siblings that users switch between in one sitting, like these three.
